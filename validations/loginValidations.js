const Joi = require('joi');

const loginValidations = Joi.object({
    email: Joi.string().email().required().messages({
      'string.base' : 'Email should be a string',
      'string.email' : 'email should be the correct format',
      'an.required' : 'Email is required',
    }),


    password: Joi.string().min(6).max(12).required().messages({
      "string.base": "Password should be a string.",
      "string.min": "Password should have at least 6 characters",
      "string.max": "Password should be at most 12 characters",
      "any.required": "Password is required is required",
    }),

})

module.exports = loginValidations;