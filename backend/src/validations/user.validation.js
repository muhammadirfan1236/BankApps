const Joi = require("joi");
const {
  password,
  alphabets,
  username,
  phoneNumber,
  objectId,
} = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required().custom(alphabets),
    lastName: Joi.string().required().custom(alphabets),
    role: Joi.number().required(),
    username: Joi.string().required().custom(username),
  }),
};
const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    email: Joi.string().email().allow(""),
    firstName: Joi.string().allow("").custom(alphabets),
    lastName: Joi.string().allow("").custom(alphabets),
  }),
};

module.exports = {
  createUser,
  updateUser,
};
