const { body } = require("express-validator");
const EXCEPTIONS = require("../exceptions/Exceptions");

const registerValidator = [
  body("firstName")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("First name can not be empty!")
    .bail()
    .isLength({ min: 2 })
    .withMessage("Minimum 2 characters required!")
    .bail(),
  body("lastName")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Last name can not be empty!")
    .bail()
    .isLength({ min: 2 })
    .withMessage("Minimum 2 characters required!")
    .bail(),
  body("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage(EXCEPTIONS.EMAIL_IS_REQUIRED)
    .bail()
    .isEmail()
    .withMessage(EXCEPTIONS.EMAIL_NOT_VALID)
    .bail(),
  body("phoneNumber")
    .trim()
    .not()
    .isEmpty()
    .withMessage(EXCEPTIONS.PHONE_NUMBER_IS_REQUIRED)
    .bail()
    .isLength({ min: 10, max: 11 })
    .withMessage(EXCEPTIONS.PHONE_NUMBER_LENGTH_NOT_VALID)
    .bail()
    .isMobilePhone()
    .withMessage(EXCEPTIONS.PHONE_NUMBER_NOT_VALID)
    .bail(),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage(EXCEPTIONS.PASSWORD_IS_REQUIRED)
    .bail()
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters")
    .bail()
    .isStrongPassword()
    .withMessage(EXCEPTIONS.PASSWORD_NOT_VALID),
];

module.exports = { registerValidator };
