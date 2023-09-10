const ReviewModel = require("../models/reviewModel")
const BlogModel = require("../models/blogsModel")
const mongoose = require('mongoose')

/********************VALIDATION FUNCTION*************************** */
const { isValid, isValidIdType, isValidRequest, isNameValid, isValidEmail } = require("../validation/validation")

//*****************************CREATING NEW REVIEW***********************************/

const newReview = async function (req, res) {
    try {

        const requestBody = req.body
        const queryParams = req.query
        const blogId = req.params.blogId

        //query params should empty
        if (isValidRequest(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "Invalid request" });
        }

        if (!isValidRequest(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "review data is required to create review" });
        }

        if (!blogId) {
            return res
                .status(400)
                .send({ status: false, message: "blogId is required" });
        }

        if (!isValidIdType(blogId)) {
            return res
                .status(400)
                .send({ status: false, message: "enter a valid blogId" });
        }

        const blogByblogId = await BlogModel.findOne({ _id: blogId, isDeleted: false})

        if (!blogByblogId) {
            return res
                .status(404)
                .send({ status: false, message: `no blog found by ${blogId}` });
        }

        //using destructuring then checking existence of property. if exits then validating that key
        const { reviewedBy, review } = requestBody

        //creating an object to add validation keys from requestBody
        const reviewData = {}

        if (requestBody.hasOwnProperty("reviewedBy")) {
            if (isValid(reviewedBy)) {
                reviewData["reviewedBy"] = reviewedBy.trim()
            } else {
                return res
                    .status(400)
                    .send({ status: false, message: "enter name in valid format" })
            }
            //if requestbody doesnot have the "reviewedBy" then assigning its default value
        } else {
            reviewData["reviewedBy"] = "Guest"
        }


        if (requestBody.hasOwnProperty("review")) {
            if (typeof (review) === "string" && review.trim().length > 0) {

                reviewData["review"] = review.trim()

            } else {
                return res
                    .status(400)
                    .send({ status: false, message: "enter review in valid format" })
            }
        }

        //adding properties like :bookId, default value of isDeleted and review creation data and time inside reviewData
        reviewData.blogId = blogId
        reviewData.isDeleted = false

        const createReview = await ReviewModel.create(reviewData)

        const updateReviewCountInBook = await BlogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false, deletedAt: null },
            { $inc: { reviews: +1 } },
            { new: true });

        const allReviewsOfThisBlog = await ReviewModel.find({ blogId: blogId, isDeleted: false })

        //using .lean() to convert mongoose object to plain js object for adding a property temporarily
        const blog = await BlogModel.findOne({ _id: blogId, isDeleted: false}).lean()

        //temprorily adding one new property inside book which consist all reviews of this book
        blog.reviewData = allReviewsOfThisBlog

        res
            .status(201)
            .send({ status: true, message: "review added successfully", data: blog })

    } catch (error) {

        res.status(500).send({ error: error.message })

    }
}


//****************************UPDATING A REVIEW********************************/

const updateReview = async function (req, res) {
    try {

        const queryParams = req.query
        const requestBody = req.body
        const blogId = req.params.blogId
        const reviewId = req.params.reviewId

        //query must be empty
        if (isValidRequest(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" });
        }

        if (!isValidRequest(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "data is required for review update" })
        }

        if (!blogId) {
            return res
                .status(400)
                .send({ status: false, message: "BlogId is required in path params" })
        }

        if (!isValidIdType(blogId)) {
            return res
                .status(400)
                .send({ status: false, message: "enter a valid blogId" })
        }

        //using .lean() to convert mongoose object to plain js object for adding a propert temprorily
        const blogByblogId = await BlogModel.findOne({ _id: blogId, isDeleted: false}).lean()

        if (!blogByblogId) {
            return res
                .status(404)
                .send({ status: false, message: `no blog found by ${blogId}` })
        }

        if (!reviewId) {
            return res
                .status(400)
                .send({ status: false, message: "reviewId is required in path params" })
        }

        if (!isValidIdType(reviewId)) {
            return res
                .status(400)
                .send({ status: false, message: `enter a valid reviewId` })
        }

        const reviewByReviewId = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })

        if (!reviewByReviewId) {
            return res
                .status(404)
                .send({ status: false, message: `No review found by ${reviewId}` });
        }

        if (reviewByReviewId.blogId != blogId) {
            return res
                .status(400)
                .send({ status: false, message: "review is not from this blog" })
        }

        const { review, reviewedBy} = requestBody

        //creating an empty object for adding all updates as per requestbody
        const update = {}

        //if requestbody has the mentioned property then validate that property and adding it to updates object
        if (requestBody.hasOwnProperty("reviewedBy")) {
            if (!isValid(reviewedBy)) {
                return res
                    .status(400)
                    .send({ status: false, message: "enter a valid name" })
            }
            update["reviewedBy"] = reviewedBy.trim()
        }


        if (requestBody.hasOwnProperty("review")) {
            if (typeof (review) === "string" && review.trim().length > 0) {
                update["review"] = review.trim()
            } else {
                return res
                    .status(400)
                    .send({ status: false, message: "enter review in valid format" })
            }
        }

        const reviewUpdate = await ReviewModel.findOneAndUpdate(
            { _id: reviewId, isDeleted: false },
            { $set: update },
            { new: true })

        const allReviewsOfThisBlog = await ReviewModel.find({ blogId: blogId, isDeleted: false })

        //adding a temporary property inside book whic consist all reviews of this book
        blogByblogId.reviewData = allReviewsOfThisBlog

        res
            .status(200)
            .send({ status: true, message: "review update successfully", data: blogByblogId })

    } catch (error) {

        res.status(500).send({ error: error.message })

    }
}


//*************************************DELETING A REVIEW****************************/

const deleteReview = async function (req, res) {
    try {

        const queryParams = req.query
        const requestBody = req.body
        const blogId = req.params.blogId
        const reviewId = req.params.reviewId

        //query must be empty
        if (isValidRequest(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" });
        }

        if (isValidRequest(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "data is not required in requestbody" })
        }

        if (!blogId) {
            return res
                .status(400)
                .send({ status: false, message: "BlogId is required in path params" })
        }

        if (!isValidIdType(blogId)) {
            return res
                .status(400)
                .send({ status: false, message: "enter a valid blogId" })
        }

        const blogByblogId = await BlogModel.findOne({ _id: blogId, isDeleted: false})

        if (!blogByblogId) {
            return res
                .status(404)
                .send({ status: false, message: `no blog found by ${blogId}` })
        }

        if (!reviewId) {
            return res
                .status(400)
                .send({ status: false, message: "reviewId is required in path params" })
        }

        if (!isValidIdType(reviewId)) {
            return res
                .status(400)
                .send({ status: false, message: `enter a valid reviewId` })
        }

        const reviewByReviewId = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })

        if (!reviewByReviewId) {
            return res
                .status(404)
                .send({ status: false, message: `No review found by ${reviewId}` });
        }

        if (reviewByReviewId.blogId != blogId) {
            return res
                .status(400)
                .send({ status: false, message: "review is not from this blog" })
        }

        const markDirtyReview = await ReviewModel.findByIdAndUpdate(
            reviewId,
            { $set: { isDeleted: true } },
            { new: true }
        )

        const updateReviewCountInBlog = await BlogModel.findByIdAndUpdate(
            blogId,
            { $inc: { reviews: -1 } },
            { new: true }
        )

        res
            .status(200)
            .send({ status: true, message: "review has been successfully deleted" })

    } catch (error) {

        res.status(500).send({ error: error.message })

    }
}



module.exports.newReview = newReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview