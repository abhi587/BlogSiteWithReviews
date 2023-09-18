const BlogsModel = require("../models/blogsModel")
const AuthorModel = require("../models/authorModel");
const ReviewModel = require('../models/reviewModel');
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");

//********************VALIDATION FUNCTION*************************** */
const { isValid, isValidIdType, isValidRequest, isNameValid, isValidEmail } = require("../validation/validation")

//********************************CREATE BLOG*************************************/

const createBlog = async function (req, res) {
    try {

        const requestBody = req.body;
        const queryParams = req.query;
        const decodedToken = req.decodedToken;

        //query params must be empty
        if (isValidRequest(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" });
        }

        //request body must not be empty
        if (!isValidRequest(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "Blog details are required" });
        }

        //using destructuring
        const { title, body, authorId, category } = requestBody;


        if (!isValid(title)) {
            return res
                .status(400)
                .send({ status: false, message: "Blogs title is required" });
        }

        if (!isValid(body)) {
            return res
                .status(400)
                .send({ status: false, message: "Blog body is required" });
        }

        if (!isValidIdType(authorId)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter a valid authorid" });
        }

        const authorByAuthorId = await AuthorModel.findById(authorId);

        if (!authorByAuthorId) {
            return res
                .status(404)
                .send({ status: false, message: `No author found by ${authorId}` });
        }

        //is author authorized to create this blog
        if (authorId != decodedToken.authorId) {
            return res
                .status(403)
                .send({ status: false, message: "Unauthorized access" });
        }

        if (!isValid(category)) {
            return res
                .status(400)
                .send({ status: false, message: "Blogs category is required" });
        }

        const blogData = {
            title: title.trim(),
            body: body.trim(),
            authorId: authorId.trim(),
            category: category.trim(),
            reviews: 0,
            isDeleted: false,
        }


        const blog = await BlogsModel.create(blogData);

        res
            .status(201)
            .send({ status: true, message: "new Blog created successfully", data: blog });

    } catch (error) {

        return res
            .status(500)
            .send({ msg: error.message })

    }
}

//********************************OWN BLOGS ***************************/

const getOwnBlogs = async function (req, res) {
    try {

        const requestBody = req.body;
        const queryParams = req.query;
        const decodedToken = req.decodedToken;
        authorId = decodedToken.authorId;

        //query params must be empty
        if (isValidRequest(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" });
        }

        //request body must be empty
        if (isValidRequest(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid required" });
        }


        const allBlogs = await BlogsModel.find({
            authorId: authorId,
            isDeleted: false
        })


        if (allBlogs.length == 0) {
            return res
                .status(404)
                .send({ status: false, message: "no blogs found" })
        }

        res
            .status(200)
            .send({ status: true, message: "blogs list", blogsCount: allBlogs.length, blogsList: allBlogs });
    }
    catch (error) {

        res.status(500).send({ error: error.message })

    }
}




//********************************ALL BLOGS & FILTERED BLOGS***************************/


const getAllBlogsWithFilter = async function (req, res) {
    try {

        const requestBody = req.body;
        const queryParams = req.query;

        //conditions to find all not deleted blogs
        const filterCondition = {
            isDeleted: false,
        };

        if (isValidRequest(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "data is required in query" });
        }

        //if queryParams are present then each key to be validated then only to be added to filterCondition object. on that note filtered blogs to be returened
        if (isValidRequest(queryParams)) {
            const { authorId, category } = queryParams;

            if (queryParams.hasOwnProperty("authorId")) {
                if (!isValidIdType(authorId)) {
                    return res
                        .status(400)
                        .send({ status: false, message: "Enter a valid authorId" });
                }
                const authorByAuthorId = await AuthorModel.findById(authorId);

                if (!authorByAuthorId) {
                    return res
                        .status(404)
                        .send({ status: false, message: `no author found ${authorId} ` })
                }
                filterCondition["authorId"] = authorId;
            }

            if (queryParams.hasOwnProperty("category")) {
                if (!isValid(category)) {
                    return res
                        .status(400)
                        .send({ status: false, message: "Blog category should be in valid format" });
                }
                filterCondition["category"] = category.trim();
            }

            const filetredBlogs = await BlogsModel.find(filterCondition)

            if (filetredBlogs.length == 0) {
                return res
                    .status(404)
                    .send({ status: false, message: "no blogs found" });
            }

            res
                .status(200)
                .send({ status: true, message: "filtered blog list", blogsCounts: filetredBlogs.length, blogList: filetredBlogs })

            //if no queryParams are provided then finding all not deleted blogs
        } else {
            const allBlogs = await BlogsModel.find(filterCondition);

            if (allBlogs.length == 0) {
                return res
                    .status(404)
                    .send({ status: false, message: "no blogs found" })
            }
            res
                .status(200)
                .send({ status: true, message: "blogs list", blogsCount: allBlogs.length, blogsList: allBlogs });
        }

    } catch (error) {

        res.status(500).send({ error: error.message })

    }
}


//*****************************UPDATING A BLOG*************************/

const updateBlog = async function (req, res) {
    try {

        const blogId = req.params["blogId"]
        const requestBody = req.body;
        const queryParams = req.query;

        if (isValidRequest(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" })
        }

        if (!isValidRequest(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "blog details are required for update" })
        }

        if (!isValidIdType(blogId)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter a valid blogId" })
        }

        const blogByBlogID = await BlogsModel.findOne({
            _id: blogId,
            isDeleted: false
        });

        if (!blogByBlogID) {
            return res
                .status(404)
                .send({ status: false, message: `no blog found by ${blogId}` });
        }

        //using destructuring then validating selected keys by user
        const { title, body, category } = requestBody;

        //update object has been created with two properties. if updating key is to be replaced && type is string then will be added to $set and if it is to be added && type is an array then will be added to $addToSet

        const update = {
            $set: {}
        };

        if (requestBody.hasOwnProperty("title")) {
            if (!isValid(title)) {
                return res
                    .status(400)
                    .send({ status: false, message: "blog title should be in valid format" });
            }
            update.$set["title"] = title.trim();
        }

        if (requestBody.hasOwnProperty("body")) {
            if (!isValid(body)) {
                return res
                    .status(400)
                    .send({ status: false, message: "blog body should be in valid format" });
            }
            update.$set["body"] = body.trim();
        }

        if (requestBody.hasOwnProperty("category")) {
            if (!isValid(category)) {
                return res
                    .status(400)
                    .send({ status: false, message: "blog category should be in valid format" });
            }
            update.$set["category"] = category.trim();
        }

        const updatedBlog = await BlogsModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            update,
            { new: true }
        )

        res
            .status(200)
            .send({ status: true, message: "blog updated successfully", data: updatedBlog });

    } catch (error) {

        res.status(500).send({ error: error.message })

    }
}

//**************************DELETING AN INDIVIDUAL BLOG*********************** */

const deleteBlog = async function (req, res) {
    try {

        const requestBody = req.body;
        const queryParams = req.query;
        const blogId = req.params.blogId;

        if (isValidRequest(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid Request" });
        }

        if (isValidRequest(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid Request" });
        }

        if (!isValidIdType(blogId)) {
            return res
                .status(400)
                .send({ status: false, message: `${id} is not a valid blogID` });
        }

        const blogByBlogId = await BlogsModel.findOne({
            _id: blogId,
            isDeleted: false
        })

        if (!blogByBlogId) {
            return res
                .status(404)
                .send({ status: false, message: `no blog found by ${blogId}` })
        }

        await BlogsModel.findByIdAndUpdate(
            { _id: blogId },
            { $set: { isDeleted: true } },
            { new: true }
        );

        res
            .status(200)
            .send({ status: true, message: "blog sucessfully deleted" });

    } catch (error) {

        res.status(500).status({ status: false, message: error.message })

    }
}


//******************************EXPORTING ALL BLOG'S HANDLERS******************************* */

module.exports = {
    createBlog,
    getOwnBlogs,
    getAllBlogsWithFilter,
    updateBlog,
    deleteBlog
}