const { default: mongoose } = require('mongoose');

const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValidRequest = function (object) {
  return Object.keys(object).length > 0;
};

const isValidIdType = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
};

const isNameValid = function (value) {
  let regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
  return regex.test(value)
}

const isValidEmail = function (email) {
  const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regexForEmail.test(email);
};


module.exports = {
  isValid,
  isValidIdType,
  isValidRequest,
  isNameValid,
  isValidEmail
}