const userRouter = require("./user/router");

module.exports = [...userRouter].map(r => {
  r.path = `/api/v1/${r.path}`;
  return r;
});
