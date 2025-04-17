require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL);
        console.log("Database connected succssfully")
    } catch (error) {
        console.log("ERROR: ", error)
        
    }
};

module.exports = connectDB