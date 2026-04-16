/* eslint-env node */
/* global require, module, process */

// bcrypt guide: https://www.npmjs.com/package/bcryptjs
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// cookies options for auth
const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

// function creates the  jwt token for a user. then loads the data stored for the user's data.
function createToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
}

// creates a new account, checks required feilds, and checks if the email already is in use. req = request, res = response. parameters had to stay this way because of how express handles them
async function register(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;

        // if there is a missing field, an error response of 400 will show a missing fields notice. same applies if a user is already registered with the email
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // before saving the password, hash it to make it more secure
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const token = createToken(user._id);

        res.cookie("token", token, cookieOptions);

        res.json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    } catch (err) {
        console.error("Register error:", err.message);
        res.status(500).json({ message: "Registration failed" });
    }
}

// login in function. checks that the found user has a valid login before creating a token. gives response status of any errors that occur
async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = createToken(user._id);

        res.cookie("token", token, cookieOptions);

        res.json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicture: user.profilePicture
        });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: "Login failed" });
    }
}

// logs the user out, clears the token
function logout(req, res) {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
}

// current user
async function me(req, res) {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error("Me error:", err.message);
        res.status(500).json({ message: "Failed to get user" });
    }
}


// google oauth docs: https://www.npmjs.com/package/google-auth-library
// google oauth. verifies the token from google, finds or creates user, sets jwt cookie
async function googleAuth(req, res) {
    try {
        const { token } = req.body;

        // await allows the function to be completed later. it's going to verify the token with google and pauses until done
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        // extracting the users information from the token
        const payload = ticket.getPayload();
        const { email, given_name: firstName, family_name: lastName = '', picture: profilePicture } = payload;

        // find existing user. if there's not an existing user, create a new user with the following credentials.
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                firstName,
                lastName,
                email,
                password: 'oauth-google',
                profilePicture
            });
        } else if (profilePicture && user.profilePicture !== profilePicture) {
            // always keep the profile picture URL up to date from google.
            // google URLs can change between sessions and expire if not refreshed.
            user.profilePicture = profilePicture;
            await user.save();
        }

        // adds a jwt token to the user and sends back the user info
        const jwtToken = createToken(user._id);
        res.cookie("token", jwtToken, cookieOptions);

        res.json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicture: user.profilePicture
        });
    } catch (err) {
        console.error("Google auth error:", err.message);
        res.status(401).json({ message: "Google authentication failed" });
    }
}

module.exports = { register, login, logout, me, googleAuth };