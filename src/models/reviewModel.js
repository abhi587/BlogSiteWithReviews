const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

    blogId:{
        type     : ObjectId,
        required : [true, "blogId must be provided"],
        ref      : "Blog",
        trim     : true 
    },
    reviewedBy:{
        type     : String,
        default  : "Guest",
        trim     : true 
    },
    review:{
        type     : String,
        trim     : true  
    },
    isDeleted:{
        type     : Boolean,
        default  : false
    }    

}, {timestamps : true})

module.exports = mongoose.model("Review", reviewSchema)