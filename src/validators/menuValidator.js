const Joi = require('joi');

const subMenuSchema = Joi.object({
  id: Joi.number().integer().min(1).optional(), // for updates
  name: Joi.string().min(2).max(100).required(),
  link: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().integer().min(0).optional()
});

const createMenuSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required'
  }),
  link: Joi.string().required().messages({
    'any.required': 'Link is required'
  }),
  hasSubmenu: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().integer().min(0).optional(),
  submenus: Joi.array().items(subMenuSchema).optional()
});

const updateMenuSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  link: Joi.string().optional(),
  hasSubmenu: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().integer().min(0).optional(),
  submenus: Joi.array().items(subMenuSchema).optional()
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

module.exports = {
  validateCreateMenu,
  validateUpdateMenu
};
