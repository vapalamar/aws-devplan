const Joi = require("joi");

const createUser = {
  firstName: Joi.string()
    .max(50)
    .required(),
  lastName: Joi.string()
    .max(50)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .max(50)
    .required()
};

const login = {
  email: Joi.string().required(),
  password: Joi.string().required()
};

module.exports = {
  createUser,
  login
};
