const jwt = require("jsonwebtoken");
const BlogModel = require('../models/blogsModel');

//**************************AUTHENTICATION*****************************/

const authentication = async function(req,res,next){

    const token = req.headers["x-api-key"];
    
    if(!token){
        return res
            .status(400)
            .send({msg:"please provide token"});
    }

    try{
        const decodedToken = jwt.verify(token, "blogSite");

        if(!decodedToken)
        return res
            .status(401)
            .send({status:false, msg:"invalid token"});
        

        req.decodedToken = decodedToken;

        next();
        
    }catch(error){

        res
            .status(500)
            .send({error: error.message})

    }

};

//*********************************AUTHORIZATION**********************************/

const authorization = async function (req,res,next){
    try{

        const blogId = req.params["blogId"];
        const decodedToken = req.decodedToken;

        const blogByBlogId = await BlogModel.findOne({
            _id: blogId,
            isDeleted: false,
            deletedAt: null,
        });

        if(!blogByBlogId){
            return res
                .status(404)
                .send({status:false, message:`no blogs found by ${blogId}`});
        }

        if(decodedToken.authorId != blogByBlogId.authorId){
            return res
                .status(403)
                .send({status:false , message:"unauthorize access"});
        }

        next();

    }catch(error){

        res
            .status(500)
            .send({error: error.message})

    }
}


//***************************EXPORTING BOTH MIDDLEWARE FUNCTION********************* */

module.exports = {authentication, authorization};