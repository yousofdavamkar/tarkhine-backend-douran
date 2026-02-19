const Joi = require('joi');

const createMenuSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required'
  }),
  logoAlt: Joi.string().max(255).optional().allow('').messages({
    'string.max': 'Logo alt text must not exceed 255 characters'
  }),
  isActive: Joi.boolean().optional(),
  position: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Position must be a non-negative integer',
    'number.integer': 'Position must be an integer'
  })
});

const updateMenuSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  logoAlt: Joi.string().max(255).optional().allow(''),
  isActive: Joi.boolean().optional(),
  position: Joi.number().integer().min(0).optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const createMenuItemSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required'
  }),
  link: Joi.string().uri().optional().messages({
    'string.uri': 'Link must be a valid URL'
  }),
  isActive: Joi.boolean().optional(),
  position: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Position must be a non-negative integer',
    'number.integer': 'Position must be an integer'
  })
});

const updateMenuItemSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  link: Joi.string().uri().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().integer().min(0).optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const createSubMenuItemSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required'
  }),
  link: Joi.string().uri().optional().messages({
    'string.uri': 'Link must be a valid URL'
  }),
  isActive: Joi.boolean().optional(),
  position: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Position must be a non-negative integer',
    'number.integer': 'Position must be an integer'
  })
});

const updateSubMenuItemSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  link: Joi.string().uri().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().integer().min(0).optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const validateCreateMenu = (req, res, next) => {
  const { error, value } = createMenuSchema.validate(req.body);

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

const validateUpdateMenu = (req, res, next) => {
  const { error, value } = updateMenuSchema.validate(req.body);

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

const validateCreateMenuItem = (req, res, next) => {
  const { error, value } = createMenuItemSchema.validate(req.body);

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

const validateUpdateMenuItem = (req, res, next) => {
  const { error, value } = updateMenuItemSchema.validate(req.body);

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

const validateCreateSubMenuItem = (req, res, next) => {
  const { error, value } = createSubMenuItemSchema.validate(req.body);

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

const validateUpdateSubMenuItem = (req, res, next) => {
  const { error, value } = updateSubMenuItemSchema.validate(req.body);

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
  validateCreateMenu,
  validateUpdateMenu,
  validateCreateMenuItem,
  validateUpdateMenuItem,
  validateCreateSubMenuItem,
  validateUpdateSubMenuItem
};
