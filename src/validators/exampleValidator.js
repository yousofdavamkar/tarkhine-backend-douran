const Joi = require('joi');

const createResourceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required'
  }),
  description: Joi.string().max(1000).optional().allow(''),
  status: Joi.string().valid('active', 'inactive').optional(),
  category: Joi.string().max(50).optional()
});

const updateResourceSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(1000).optional().allow(''),
  status: Joi.string().valid('active', 'inactive').optional(),
  category: Joi.string().max(50).optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const validateCreateResource = (req, res, next) => {
  const { error, value } = createResourceSchema.validate(req.body);

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

const validateUpdateResource = (req, res, next) => {
  const { error, value } = updateResourceSchema.validate(req.body);

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
  validateCreateResource,
  validateUpdateResource
};
