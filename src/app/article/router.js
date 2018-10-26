const Boom = require("boom");
const Article = require("./model");
const User = require("../user/model");
const userService = require("../user/service");
const validator = require("./validator");

const routes = [
  {
    method: "GET",
    path: "count",
    options: { auth: false },
    handler: countArticles
  },
  {
    method: "GET",
    path: "{id}",
    options: { auth: false },
    handler: getArticleById
  },
  {
    method: "GET",
    path: "",
    options: { auth: false, validate: { query: validator.getArticles } },
    handler: getArticles
  },
  {
    method: "POST",
    path: "",
    options: { auth: "jwt", validate: { payload: validator.createArticle } },
    handler: createArticle
  },
  {
    method: "DELETE",
    path: "{id}",
    options: { auth: "jwt" },
    handler: deleteArticle
  },
  {
    method: "PUT",
    path: "{id}",
    options: { auth: "jwt", validate: { payload: validator.createArticle } },
    handler: updateArticle
  }
];

async function countArticles(request, h) {
  return await Article.countDocuments().exec();
}

async function getArticleById(request, h) {
  return await Article.findById(request.params.id).exec();
}

async function getArticles(request, h) {
  return await Article.find()
    .skip(request.query.offset)
    .limit(request.query.limit)
    .exec();
}

async function createArticle(request, h) {
  const { id } = userService.getUserFromToken(request.headers.authorization);
  const authorUser = await User.findById(id).exec();
  const articleDTO = request.payload;
  articleDTO.author = authorUser;

  try {
    const articleModel = new Article(articleDTO);
    const article = await articleModel.save();

    return article;
  } catch (e) {
    return Boom.internal(e);
  }
}

async function deleteArticle(request, h) {
  const article = await Article.findById(request.params.id).exec();
  if (!article) {
    return Boom.notFound("Article does not exist");
  }

  const { id } = userService.getUserFromToken(request.headers.authorization);
  if (id !== article.author._id.toString()) {
    return Boom.forbidden("You are not allowed to delete this article");
  }

  await Article.findByIdAndDelete(article.id).exec();

  return h.response("Delete successful").code(204);
}

async function updateArticle(request, h) {
  const article = await Article.findById(request.params.id).exec();
  if (!article) {
    return Boom.notFound("Article does not exist");
  }

  const { id } = userService.getUserFromToken(request.headers.authorization);
  if (id !== article.author._id.toString()) {
    return Boom.forbidden("You are not allowed to delete this article");
  }
  const articleDTO = request.payload;
  articleDTO.author = article.author;

  return await Article.findOneAndUpdate({ _id: article.id }, articleDTO).exec();
}

module.exports = routes.map(r => {
  r.path = r.path ? `article/${r.path}` : "article";
  return r;
});
