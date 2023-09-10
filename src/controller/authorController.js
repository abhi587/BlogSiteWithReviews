const AuthorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")


//**************************************VALIDATION FUNCTIONS****************************** */

const {isValid,isValidRequest,isNameValid,isValidEmail} = require("../validation/validation")

//****************************************REGISTER NEW AUTHOR********************************* */

const createAuthor = async function (req, res) {
  try {
    let requestBody = req.body

    if (!isValidRequest(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "author data is required" });
    }

    //using desturcturing
    const { name, email, password } = requestBody;


    if (!isValid(name) || !isNameValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Name is required or its should contain character" })
    }


    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" })
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid email address" })
    }

    const isEmailUnique = await AuthorModel.findOne({ email: email })

    if (isEmailUnique) {
      return res
        .status(409)           
        .send({ status: false, message: "Email already exits" });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" })
    }

    const authorData = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    };

    const newAuthor = await AuthorModel.create(authorData);
    res
      .status(201)
      .send({ status: true, message: "author registered successfully", data: newAuthor });


  } catch (err) {
    res.status(500).send({ err: err.message })

  }
}

//****************************AUTHOR LOGIN****************************** */

const authorLogin = async function (req, res) {
  try {

    const requestBody = req.body;
    const queryParams = req.query;

    if (isValidRequest(queryParams)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid request" });
    }

    if (!isValidRequest(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "data is required" });
    }

    const userName = requestBody.email;
    const password = requestBody.password;

    if (!isValidEmail(userName)) {
      return res
        .status(400)
        .send({ status: false, message: "enter a valid email address" });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" })
    }

    const author = await AuthorModel.findOne({
      email: userName,
      password: password
    });

    if (!author) {
      return res
        .status(404)
        .send({ status: false, message: "no author found " })
    }


    let token = jwt.sign({
      authorId: author._id.toString()
    },
      "blogSite"
    );

    res.header("x-api-key", token);

    res
      .status(200)
      .send({ status: true, message: "Author Login Successfully", data: token })

  } catch (error) {

    res.status(500).send({ error: error.message })            

  }
}

//**********************EXPORTING BOTH HANDLERS********************** */

module.exports = { createAuthor, authorLogin }