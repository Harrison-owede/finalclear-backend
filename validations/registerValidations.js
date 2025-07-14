const Joi = require("joi");

const registerValidations = Joi.object({
  firstName: Joi.string().min(3).required().messages({
    "string.base": "Firstname should be a string.",
    "string.min": "Firstname should have at least 3 characters",
    "any.required": "First name is required",
  }),

  lastName: Joi.string().min(3).required().messages({
    "string.base": "Lastname should be a string.",
    "string.min": "Lastname should have at least 3 characters",
    "any.required": "Last name is required",
  }),



  matricNumber: Joi.string().required().messages({
    "any.required": "Matric number is required",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "Email should be a string.",
    "string.email": "Email should be the correct format",
    "any.required": "Email is required",
  }),

  phoneNumber: Joi.string().min(10).required().messages({
    "string.base": "Phone Number should be a string.",
    "string.min": "Phone Number have at least 10 characters",
    "any.required": "Phone Number is required",
  }),

  department: Joi.string().min(3).required().messages({
    "string.base": "Department should be a string.",
    "string.min": "Department should have at least 3 characters",
    "any.required": "Department is required",
  }),

  password: Joi.string().min(6).max(12).required().messages({
    "string.base": "Password should be a string.",
    "string.min": "Password should have at least 6 characters",
    "string.max": "Password should be at most 12 characters",
    "any.required": "Password is required is required",
  }),

  confirmPassword: Joi.any()
  .valid(Joi.ref("password"))
  .required()
  .label("Confirm password")
  .messages({
    "any.only": "{{#label}} does not match password.",
    "any.required": "{{#label}} is required.",
  }),



});

module.exports = registerValidations;
