const Joi = require('joi');

const uploadMetadataSchema = Joi.object({
  alt: Joi.string().max(255).optional(),
  category: Joi.string().max(50).optional()
});

const validateUploadMetadata = (req, res, next) => {
  // Only validate if body contains data
  if (Object.keys(req.body).length === 0) {
    return next();
  }

  const { error, value } = uploadMetadataSchema.validate(req.body);

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
  validateUploadMetadata
};
