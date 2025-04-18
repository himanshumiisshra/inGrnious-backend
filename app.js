const express = require("express");
require("dotenv").config;
const mongoose = require("mongoose");
const cors = require("cors");
const DBConnect = require("./DbConnection");
const app = express();


app.use(express.json());
app.use(cors({origin: true}));
app.use(express.urlencoded({extended: false}));
const server = app.listen(process.env.PORT);
const authRoutes = require("./routes/authRoutes");
// const noteRoute = require("./routes/noteRoute");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Databast connected successfully");
    } catch (error) {
        console.log(error)
    }
}

connectDB();
console.log(`Connected to ${process.env.PORT}`)