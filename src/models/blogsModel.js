const { timeStamp } = require("console")
const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Title is required",
        trim: true
    },
    body: {
        type: String,
        required: "Body is required",
        trim: true
    },
    authorId: {
        type: ObjectId,
        required: true,
        ref: "Author"
    },
    category: {
        type:String,
        required:"category is required",
        trim:true
    },
    reviews:{
        type     : Number,
        default  : 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
    
}, { timeStamp: true })


module.exports = mongoose.model("Blog", blogSchema)