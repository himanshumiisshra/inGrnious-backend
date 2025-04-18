const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const user = require("../models/userModel");
const { ErrorHandler } = require("../middlewares/ErrorHandler");;
const { validateEmail, validatePassword } = require("../utils/validations");


const home = (req, res, next) => {
    const data = {
        msg: "logged in successfully"
    };

    try {
        res.json(data)
    } catch (error) {
        console.log("ERROR in home authController: ", error)

    }
};

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_ACCESS_KEY, { expiresIn: "1h" });
};

const refreshToken = (req, res, next) => {
    try {
        const rf_token = req.body.refreshtoken;

        if (!rf_token)
            return next(new ErrorHandler(400, "Please login or Register"));

        jwt.verify(rf_token, process.env.JWT_REFRESH_KEY, (err, user) => {
            console.log("checking with user", user)
            if (err) return next(new ErrorHandler(401, "Invalid Authentication"));
            const accessToken = createAccessToken({
                id: user._id,
            });
            return res.status(200).json({ accessToken })
        });

    } catch (error) {
        next(err);
        console.log(err)

    }
};


const login = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();

        if (!(email && password)) {
            return next(new ErrorHandler(400, "email and password is required"));
        }

        const usr = await user.findOne({ email });
        if (!usr) {
            return next(new ErrorHandler(404, "User not found"))
        }

        const result = await bcrypt.compare(password, usr.password);

        console.log("checking for password", password);
        console.log("checking with saved password", usr.password);

        if (!result) return next(new ErrorHandler(400, "Invalid Credentials"));

        const accessToken = createAccessToken({ id: user._id });
        const refreshToken = jwt.sign({
            id: user._id
        },
            process.env.JWT_REFRESH_KEY,

            { expiresIn: "1h" }
        );

        return res.status(200).json({
            id: usr._id,
            success: true,
            msg: "Logged in successfully",
            usr,
            accessToken,
        });

    } catch (error) {
        console.log("error", error)
        next(error);

    }
};

const signup = async (req, res, next) => {
    try {
        console.log("checking req.body for sign up", req.body)
        const { email, password } = req.body;




        if (!(email && password)) {
            return next(new ErrorHandler(400, "All the input fields are required"))
        }

        if (!validatePassword(password)) {
            return next(
                new ErrorHandler(400, "incorrect password")
            );

        }
        if (!validateEmail(email)) {
            return next(new ErrorHandler(400, "Incorrect email"))
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const usr = new user({
            email,
            password: hashedPassword
        });

        const isUserExists = await user.findOne({ email: email.toLowerCase() });

        if (isUserExists) {
            return next(new ErrorHandler(400, "user by this email already exixts"))
        }

        const savedUser = await usr.save();
        console.log("checking for saved User", savedUser)

        const accessToken = createAccessToken({ id: usr._id });


        const refreshToken = jwt.sign(
            {
                id: usr._id,
            },
            process.env.JWT_REFRESH_KEY,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            id: user._id,
            success: true,
            msg: `Sign up successfull`,
            usr,
            accessToken,
        })

    } catch (error) {
        next(error);
    }
}

module.exports = {
    home,
    login,
    signup,
    refreshToken
}

