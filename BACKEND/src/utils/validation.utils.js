const Joi = require('joi');

const registerSchema = Joi.object({
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).required(),
  email: Joi.string().email().max(100).required(),
  phone: Joi.string().max(20).optional().allow(''),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .pattern(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/)
    .required(),
  confirm_password: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
  }),
  terms: Joi.boolean().valid(true).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().max(100).required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };
