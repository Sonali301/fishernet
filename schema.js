const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    boatname: Joi.string().required(),
    nettype: Joi.string().required(),
    description: Joi.string().required(),
    netsize: Joi.object({
      length: Joi.number().required().min(1),
      width: Joi.number().required().min(1),
      depth: Joi.number().required().min(1),
      unit: Joi.string().required(),
    }).required(),
    month: Joi.string().required(),
    image: Joi.string().allow("", null),
  }).required(),
});
