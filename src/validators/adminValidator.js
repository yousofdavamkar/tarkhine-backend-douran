const Joi = require('joi');

const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid('ADMIN', 'USER')
    .required()
    .messages({
      'any.only': 'Role must be either ADMIN or USER',
      'any.required': 'Role is required'
    })
});

/**
 * Validate role update request
 */
const validateUpdateRole = (req, res, next) => {
  const { error, value } = updateRoleSchema.validate(req.body);

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
  validateUpdateRole
};
