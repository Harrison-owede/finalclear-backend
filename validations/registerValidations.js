const joi = require("joi");

const registerValidations = joi.object({
  firstName: joi.string().min(3).required().messages({
    "string.base": "Firstname should be a string.",
    "string.min": "Firstname should have at least 3 characters",
    "any.required": "First name is required",
  }),

  lastName: joi.string().min(3).required().messages({
    "string.base": "Lastname should be a string.",
    "string.min": "Lastname should have at least 3 characters",
    "any.required": "Last name is required",
  }),

  department: joi.string().required().messages({
    "any.required": "Department is required",
  }),

  matricNumber: joi.string().required().messages({
    "any.required": "Matric number is required",
  }),

  email: joi.string().email().required().messages({
    "string.base": "Email should be a string.",
    "string.email": "Email should be the correct format",
    "any.required": "Email is required",
  }),

  phoneNumber: joi.string().min(10).required().messages({
    "string.base": "Phone Number should be a string.",
    "string.min": "Phone Number have at least 10 characters",
    "any.required": "Phone Number is required",
  }),

  password: joi.string().min(6).max(12).required().messages({
    "string.base": "Password should be a string.",
    "string.min": "Password should have at least 6 characters",
    "string.max": "Password should be at most 12 characters",
    "any.required": "Password is required is required",
  }),

  dob: joi.string().required().messages({
    "any.required": "Date of Birth is required",
  }),

});

module.exports = registerValidations;
