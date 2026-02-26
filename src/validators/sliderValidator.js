const Joi = require('joi');

const createSliderSchema = Joi.object({
    title: Joi.string().max(255).required(),
    btnTitle: Joi.string().max(100).required(),
    link: Joi.string().max(255).required(),
    isActive: Joi.boolean().optional(),
    position: Joi.number().integer().min(0).optional()
});

const updateSliderSchema = Joi.object({
    title: Joi.string().max(255).optional(),
    btnTitle: Joi.string().max(100).optional(),
    link: Joi.string().max(255).optional(),
    isActive: Joi.boolean().optional(),
    position: Joi.number().integer().min(0).optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

const validateCreateSlider = (req, res, next) => {
    const { error, value } = createSliderSchema.validate(req.body);

    if (error) {
        return res.error(error.details[0].message, 'VALIDATION_ERROR', 400);
    }

    req.validatedData = value;
    next();
};

const validateUpdateSlider = (req, res, next) => {
    const { error, value } = updateSliderSchema.validate(req.body);

    if (error) {
        return res.error(error.details[0].message, 'VALIDATION_ERROR', 400);
    }

    req.validatedData = value;
    next();
};

module.exports = {
    validateCreateSlider,
    validateUpdateSlider
};
