const Exceptions = {
  // DATABASE EXCEPTION
  WRONG_DB_USERNAME_PASSWORD: "Wrong database's username or password",
  WRONG_CONNECTION_STRING: "Wrong server's name or connection string",
  CANNOT_CONNECT_MONGODB: "Cannot connect to MongoDB",

  // CRUD EXCEPTIONS
  FAIL_TO_GET_ITEM: "Fail to get data",
  FAIL_TO_CREATE_ITEM: "Fail to create data!!",
  FAIL_TO_UPDATE_ITEM: "Fail to update data!!",
  FAIL_TO_DELETE_ITEM: "Fail to delete data!!",

  // VALIDATE EXCEPTIONS
  USER_HAS_EXIST: "This user already has an account!!",

  // WRONG VALUE
  WRONG_EMAIL_PASSWORD: "Email or Password is not correct!!",
  WRONG_PASSWORD: "Password is not correct!!",

  // NOT VALID FORMAT
  EMAIL_NOT_VALID: "This email is invalid!!",
  PASSWORD_NOT_VALID: "This password is invalid!!",
  PHONE_NUMBER_NOT_VALID: "This phone number is invalid!!",
  PHONE_NUMBER_LENGTH_NOT_VALID:
    "This phone number must contain 10 - 11 numbers!!",

  // REQUIRED VALUE
  EMAIL_IS_REQUIRED: "Email must be provided!!",
  PASSWORD_IS_REQUIRED: "Password must be provided!!",
  PHONE_NUMBER_IS_REQUIRED: "Phone number must be provided!!",
};

module.exports = Exceptions;
