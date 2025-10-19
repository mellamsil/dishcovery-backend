const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");

// Custom validators

// URL validator: requires protocol (http:// or https://)
const validateURL = (value, helpers) => {
  if (validator.isURL(value, { require_protocol: true })) {
    return value;
  }
  return helpers.error("string.uri");
};

// MongoDB ObjectId validator
const validateObjectId = (value, helpers) => {
  if (/^[0-9a-fA-F]{24}$/.test(value)) {
    return value;
  }
  return helpers.error("any.custom");
};

// User signup validation

const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": 'The "name" field must be filled in',
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" must be a valid email address',
    }),
    password: Joi.string().required().min(8).messages({
      "string.empty": 'The "password" field must be filled in',
      "string.min": 'The "password" must be at least 8 characters long',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    favoriteCuisine: Joi.string().allow("").optional(),
    dietaryPreferences: Joi.string().allow("").optional(),
    preferences: Joi.string().allow("").optional(),
    termsAgreement: Joi.boolean().valid(true).required().messages({
      "any.only": "You must agree to the Terms of Service and Privacy Policy",
    }),
  }),
});

// User signin validation

const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// Item creation validation

const validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": 'The "name" field must be filled in',
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
  }),
});

// Recipe creation validation

const validateCreateRecipe = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required().min(2).max(100).messages({
      "string.empty": 'The "title" field must be filled in',
      "string.min": 'The minimum length of the "title" field is 2',
      "string.max": 'The maximum length of the "title" field is 100',
    }),
    ingredients: Joi.string().required().messages({
      "string.empty": 'The "ingredients" field must be filled in',
    }),
    description: Joi.string().required().messages({
      "string.empty": 'The "description" field must be filled in',
    }),
    instructions: Joi.string().required().messages({
      "string.empty": 'The "instructions" field must be filled in',
    }),
    notes: Joi.string().allow("").optional(),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
  }),
});

// Item ID validation (route params)

const validateItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().required().custom(validateObjectId).messages({
      "string.empty": 'The "itemId" parameter must be filled in',
      "any.custom":
        'The "itemId" parameter must be a valid 24-character hexadecimal',
    }),
  }),
});

// Optional: Authorization header validation

const validateAuthHeader = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required().messages({
      "string.empty": "Authorization header is required",
    }),
  }).unknown(), // allow other headers
});

// Optional: Query validation (pagination)

const validateQuery = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().integer().min(1).messages({
      "number.base": 'The "page" query must be a number',
      "number.min": 'The "page" query must be at least 1',
    }),
    limit: Joi.number().integer().min(1).max(100).messages({
      "number.base": 'The "limit" query must be a number',
      "number.min": 'The "limit" query must be at least 1',
      "number.max": 'The "limit" query cannot exceed 100',
    }),
  }),
});

// Export all validators

module.exports = {
  validateSignup,
  validateSignin,
  validateCreateItem,
  validateCreateRecipe,
  validateItemId,
  validateAuthHeader,
  validateQuery,
};
