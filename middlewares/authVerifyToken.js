const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { ErrorHandler } = require("./ErrorHandler");
require("dotenv").config();

const authVerifyToken = async (req, res, next) => {
    let token;
    console.log("checking for request headers for token", req.headers)

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const verify = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            req.user = await User.findById(verify.id).select("-password");
            next();
        } catch (error) {
            console.log("error in moddleware authVerifyToken", error)
            next(new ErrorHandler(401, "not authorized , token failed"));
        }
    }

    if(!token){
        next(new ErrorHandler(401, "no token"));
    }
}

module.exports = {
    authVerifyToken
}