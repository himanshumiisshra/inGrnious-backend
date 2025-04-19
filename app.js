const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const DBConnect = require("./DbConnection");
const app = express();
const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per windowMs
    message: "Too many requests from this IP, please try again in a minute.",
  });


app.use(limiter);
app.use(express.json());
app.options("*", cors());
app.use(express.urlencoded({extended: false}));
const server = app.listen(process.env.PORT);
const authRoutes = require("./routes/authRoutes");
const { errorMiddleware } = require("./middlewares/ErrorHandler");
const noteRoute = require("./routes/noteRoutes");

app.get("/", (req, res) => {
    res.send("Server is live 🚀");
  });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Databast connected successfully");
    } catch (error) {
        console.log(error)
    }
}

connectDB();
console.log(`Connected to ${process.env.PORT}`);

app.use(errorMiddleware);
app.use(authRoutes, errorMiddleware)
app.use("/notes",noteRoute, errorMiddleware)