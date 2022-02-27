const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.Auth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        req.Auth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'mysecuretoken');
    } catch (err) {
        req.Auth = false;
        return next();
    }
    if (!decodedToken) {
        req.Auth = false;
        return next();
    }
    req.Auth = true;
    req.loginUser = decodedToken.username;
    req.role = decodedToken.role
    next();
};