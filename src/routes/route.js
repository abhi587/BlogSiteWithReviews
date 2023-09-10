const express  = require("express")
const router =express.Router()
const authorController =require("../controller/authorController")
const blogController =require("../Controller/blogController")
const ReviewController = require('../controller/reviewController')
const middleware = require('../middleWare/auth')

//**************************AUTHOR API's****************** */

// Create auhtor // authorLogin
router.post("/authors",authorController.createAuthor)
router.post("/login",authorController.authorLogin)

//********************************BLOG API's********************************************/

//Create blog // get own blogs // get all blogs //update blog //delete blogs by path params //delete blogs by query params
router.post("/blogs" , middleware.authentication, blogController.createBlog)
router.get("/ownBlogs" , middleware.authentication, blogController.getOwnBlogs)
router.get("/AllBlogs" , middleware.authentication, blogController.getAllBlogsWithFilter)
router.put("/blogs/:blogId" , middleware.authentication, middleware.authorization, blogController.updateBlog)
router.delete("/blogs/:blogId" , middleware.authentication, middleware.authorization, blogController.deleteBlog)

//********************************************Review********************************************************* */

//create new review
router.post('/blog/:blogId/review', middleware.authentication, ReviewController.newReview )
//update review
router.put('/blog/:blogId/review/:reviewId', middleware.authentication, middleware.authorization, ReviewController.updateReview)
//delete review
router.delete('/blog/:blogId/review/:reviewId',  middleware.authentication, middleware.authorization, ReviewController.deleteReview)

module.exports = router;