const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name is required",
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: "Email is required",
        trim: true
    },
    password:{
        type: String,
        required: "Password is required"
    }
},{timestamps: true});

module.exports = mongoose.model("Author",authorSchema)