const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only letters and numbers',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must not exceed 30 characters',
      'any.required': 'Username is required'
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    })
});

const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'any.required': 'Username is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

const validateRegister = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    return res.error(
      error.details[0].message,
      'VALIDATION_ERROR',
      400
    );
  }

  // Remove confirmPassword from validated data
  const { confirmPassword, ...data } = value;
  req.validatedData = data;
  next();
};

const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.error(
      error.details[0].message,
      'VALIDATION_ERROR',
      400
    );
  }

  req.validatedData = value;
  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
