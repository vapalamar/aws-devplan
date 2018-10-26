const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const articleSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  tags: [String],
  author: { type: ObjectId, ref: "User", required: true }
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
