/* eslint-env node */
/* global require, module, process */

// middleware docs: https://expressjs.com/en/guide/writing-middleware.html
// https://expressjs.com/en/guide/using-middleware.html

const jwt = require('jsonwebtoken');

// this function runs before any protected route. it checks if the user has a valid token in their cookie
function protect(request, response, next) {
    // gets the token from the cookie
    const token = request.cookies.token;

    // if there's no token, the user isn't logged in
    if (!token) {
        return response.status(401).json({ message: 'Not logged in' });
    }

    try {
        // verify the token is real and not expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // connects the user's id to the request so other functions can use it
        request.user = { id: decoded.id };

        // continues to the next function
        next();
    } catch {
        return response.status(401).json({ message: 'Token invalid or expired' });
    }
}

module.exports = protect;