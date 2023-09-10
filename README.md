## blog site##

#### Task 


As part of our evaluation process, we’d like you to complete a small assignment that would help us assess your skills. Your task involves creating a mini version of a RESTful API for a simple blogging platform.
Here are the specifics:
1. User Registration and Login:
We’d like you to create a registration and login mechanism using JSON Web Tokens (JWT) for authentication.
2. Blog Post Creation, Reading, Updating, and Deletion (CRUD Operations):
Logged-in users should be able to create a blog post, read their own and others’ posts, edit their own posts, and delete their own posts.
3. Commenting Feature:
Logged-in users should be able to comment on their own and others’ posts. Also, they should be able to edit or delete their own comments.
4. Database:
All the data should be stored in a database of your choice. However, we’d like to see your ability to work with relational databases like MySQL, PostgreSQL, or SQLite.
5. Documentation:
Please provide clear documentation of your API endpoints, including the necessary HTTP methods, headers, and data structures for request and response bodies.


## 1. create author

    API - localhost:3000/authors

    {
    "name":"abcd",
    "email":"abcde@gmail.com",
    "password":"1234"
    }

    Take this as an example to create a author 

    Response:- {
    "status": true,
    "message": "author registered successfully",
    "data": {
        "name": "abcd",
        "email": "abcde@gmail.com",
        "password": "1234",
        "_id": "64fd8341b6a5651f130323b7",
        "createdAt": "2023-09-10T08:50:09.658Z",
        "updatedAt": "2023-09-10T08:50:09.658Z",
        "__v": 0
    }
    }

## 2. login page

    Api - localhost:3000/login
     
    {
    "email":"abcde@gmail.com",
    "password":"1234"
    }

    Take this for login info. as an example in return it will return a token 

    Response - {
    "status": true,
    "message": "Author Login Successfully",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JJZCI6IjY0ZmQ4MzQxYjZhNTY1MWYxMzAzMjNiNyIsImlhdCI6MTY5NDMzOTAxMH0.XMyKSxTmm-MNb48pKkgJ7LfeNX6PLF3Fv7Hkls_1mhc"
    }

## From here Token should be provided in the header as key a-api-key and Token as value.

## 3. POST BLOG

    Api - localhost:3000/blogs

    {
    "title":"good day",
    "body":"hdgdgagdfstsd424242424dg",
    "authorId":"64fd8341b6a5651f130323b7",
    "category":"wifi"
    }

        Response - {
    "status": true,
    "message": "new Blog created successfully",
    "data": {
        "title": "good day",
        "body": "hdgdgagdfstsd424242424dg",
        "authorId": "64fd8341b6a5651f130323b7",
        "category": "wifi",
        "reviews": 0,
        "isDeleted": false,
        "_id": "64fd8fee9b9b10f6924b0189",
        "__v": 0
    }
    }


## 4. GET OWN BLOGS CREATED BY THE SAME AUTHOR

    APi  - localhost:3000/ownBlogs
 
    Just need to hit the api and it will return the details of blog of the login author

    Reaponse - {
    "status": true,
    "message": "blogs list",
    "blogsCount": 2,
    "blogsList": [
        {
            "_id": "64fd8356b6a5651f130323bb",
            "title": "good day",
            "body": "hdgdgagdg",
            "authorId": "64fd7ebf62eaa09aa121c749",
            "reviews": 1,
            "isDeleted": false,
            "__v": 0
        },
        {
            "_id": "64fd84ddf185310bb63c1530",
            "title": "good day",
            "body": "hdgdgagdg",
            "authorId": "64fd7ebf62eaa09aa121c749",
            "category": "sports",
            "reviews": 0,
            "isDeleted": false,
            "__v": 0
        }
    ]
    }

## 5. GET ALL THE BLOGS WITH FILTER LIKE PATICULAR AUTHOR's OR BY CATEGORY

    Api ex -   
            WithOut any Filter :- localhost:3000/AllBlogs
            With different filter in the Params :- localhost:3000/AllBlogs?category=wifi&authorId=64fd7ebf62eaa09aa121c749

    auhtorId Or category is required in the query params to get the filtered details
        If not given any params it will return all the blogs.

        Response :-   
                        {
    "status": true,
    "message": "blogs list",
    "blogsCount": 4,
    "blogsList": [
        {
            "_id": "64fd8356b6a5651f130323bb",
            "title": "good day",
            "body": "hdgdgagdg",
            "authorId": "64fd7ebf62eaa09aa121c749",
            "reviews": 2,
            "isDeleted": false,
            "__v": 0
        },
        {
            "_id": "64fd84ddf185310bb63c1530",
            "title": "good day",
            "body": "hdgdgagdg",
            "authorId": "64fd7ebf62eaa09aa121c749",
            "category": "sports",
            "reviews": 0,
            "isDeleted": false,
            "__v": 0
        },
        {
            "_id": "64fd8fe49b9b10f6924b0186",
            "title": "good day",
            "body": "hdgdgagdg",
            "authorId": "64fd8341b6a5651f130323b7",
            "category": "sports",
            "reviews": 0,
            "isDeleted": false,
            "__v": 0
        },
        {
            "_id": "64fd8fee9b9b10f6924b0189",
            "title": "good day",
            "body": "hdgdgagdfstsd424242424dg",
            "authorId": "64fd8341b6a5651f130323b7",
            "category": "wifi",
            "reviews": 0,
            "isDeleted": false,
            "__v": 0
        }
    ]
        }

## 6. UPDATE AUTHOR's OWN BLOGS DETAILS

    Api ex - localhost:3000/blogs/64fd831bb6a5651f130323b3(blogId)

    Also required blogId in the params that is required to updated

    {
    "title":"one day football",
    "body":"it was fun to play it whole day"
    "category":"football"
    }
    these details can be updated by putting in the request body 

    Response :-  {
    "status": true,
    "message": "blogs list",
    "blogsCount": 2,
    "blogsList": [
        {
            "_id": "64fd8356b6a5651f130323b3",
            "title": "how are you ",
            "body": "its upadted sucessfully ",
            "authorId": "64fd7ebf62eaa09aa121c749",
            "reviews": 1,
            "isDeleted": false,
            "__v": 0
        },
        {
            "_id": "64fd84ddf185310bb63c1530",
            "title": "good d",
            "body": "hdgdgagdg",
            "authorId": "64fd7ebf62eaa09aa121c749",
            "category": "sports",
            "reviews": 0,
            "isDeleted": false,
            "__v": 0
        }
    ]
    }


## 7. DELETE OWN BLOGS

    Api - localhost:3000/blogs/64fd831bb6a5651f130323b3(blogId)

    blogId is required in the params that is need to be deleted .

    Response :- {
    "status": true,
    "message":  "blog sucessfully deleted"


## 8. PUT A REVIEW TO A BLOG

    Api - localhost:3000/blog/64fd8356b6a5651f130323bb(blogId)/review

    author can give review to his or else blogs

    blogid is required in the params to give a review

    {
    "reviewedBy":"abhi",
    "review":"it was good"
    }


    Response :-  {
    "status": true,
    "message": "review added successfully",
    "data": {
        "_id": "64fd8356b6a5651f130323bb",
        "title": "good day",
        "body": "hdgdgagdg",
        "authorId": "64fd7ebf62eaa09aa121c749",
        "reviews": 2,
        "isDeleted": false,
        "__v": 0,
        "reviewData": [
            {
                "_id": "64fda9e511dad931a16aee82",
                "blogId": "64fd8356b6a5651f130323bb",
                "reviewedBy": "abhi",
                "review": "it was good",
                "isDeleted": false,
                "createdAt": "2023-09-10T11:35:01.235Z",
                "updatedAt": "2023-09-10T11:35:01.235Z",
                "__v": 0
            },
            {
                "_id": "64fdaa4eb1e5b40bf010f54a",
                "blogId": "64fd8356b6a5651f130323bb",
                "reviewedBy": "abhi",
                "review": "it was good",
                "isDeleted": false,
                "createdAt": "2023-09-10T11:36:46.069Z",
                "updatedAt": "2023-09-10T11:36:46.069Z",
                "__v": 0
            }
        ]
    }
    }

## 9. UPDATE A REVIEW

    Api - localhost:3000/blog/64fd8356b6a5651f130323bb(blogId)/review/64fdaa4eb1e5b40bf010f54a(reviewId)

    Author can update only his own review

    blogId and reviewId is required in the params

    {
    "review":"i strongly recommend it "
    "reviewedBy": "ab thik h"
    }

    any of these data are can be updated by provided in the body

        Response :-  {
    "status": true,
    "message": "review added successfully",
    "data": {
        "_id": "64fd8356b6a5651f130323bb",
        "title": "good day",
        "body": "hdgdgagdg",
        "authorId": "64fd7ebf62eaa09aa121c749",
        "reviews": 2,
        "isDeleted": false,
        "__v": 0,
        "reviewData": [
            {
                "_id": "64fda9e511dad931a16aee82",
                "blogId": "64fd8356b6a5651f130323bb",
                "reviewedBy": "abhi",
                "review": "it was good",
                "isDeleted": false,
                "createdAt": "2023-09-10T11:35:01.235Z",
                "updatedAt": "2023-09-10T11:35:01.235Z",
                "__v": 0
            },
            {
                "_id": "64fdaa4eb1e5b40bf010f54a",
                "blogId": "64fd8356b6a5651f130323bb",
                "reviewedBy": "done",
                "review": "updated sucessfully ",
                "isDeleted": false,
                "createdAt": "2023-09-10T11:36:46.069Z",
                "updatedAt": "2023-09-10T11:36:46.069Z",
                "__v": 0
            }
        ]
    }
}

## 10. DELETE A REVIEW

    Api - localhost:3000/blog/64fd8356b6a5651f130323bb(blogId)/review/64fdaa4eb1e5b40bf010f54a(reviewId)

    Author can delete his own review

    blogID and review id required in the params to delete it

    Response :- {
    "status": true,
    "message": "review has been successfully deleted"
}