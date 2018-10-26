const userRouter = require("./user/router");
const articleRouter = require("./article/router");

module.exports = [...userRouter, ...articleRouter].map(r => {
  r.path = `/api/v1/${r.path}`;
  return r;
});
