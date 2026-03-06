/* eslint-env node */
/* global require, module, process */

// bcrypt guide: https://www.npmjs.com/package/bcryptjs
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
}

// login in function. checks that the found user has a valid login before creating a token
async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid login" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Invalid login" });
    }

    const token = createToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    });
}

// logs the user out, clears the token
function logout(req, res) {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
}

// current user
async function me(req, res) {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
}

module.exports = { register, login, logout, me };