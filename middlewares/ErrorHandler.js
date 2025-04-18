class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = {
    errorMiddleware: (err, req, res, next) => {
        err.message = err.message || "Internal server Error";
        err.statusCode = err.statusCode || 500;
        console.log("middleware error",err);
        console.log("middlware error",err.message);

        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode
        });
    },
    ErrorHandler,
}