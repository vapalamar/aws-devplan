const Joi = require("joi");

const getArticles = {
  limit: Joi.number()
    .greater(-1)
    .default(10),

  offset: Joi.number()
    .greater(-1)
    .default(0)
};

const createArticle = {
  title: Joi.string()
    .max(100)
    .required(),

  text: Joi.string().required(),
  tags: Joi.array()
};

module.exports = {
  getArticles,
  createArticle
};
