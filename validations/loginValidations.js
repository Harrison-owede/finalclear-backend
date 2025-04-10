const joi = require('joi');

const loginValidations = joi.object({
    email: joi.string().email().required().messages({
      'string.base' : 'Email should be a string',
      'string.email' : 'email should be the correct format',
      'an.required' : 'Email is required',
    }),


    password: joi.string().min(6).required().messages({
        'string.base' : 'Password should be a string',
        'string.min' : 'Password should have at least 6 characters',
        'any.required' : 'Password is required',
    }),

})

module.exports = loginValidations;