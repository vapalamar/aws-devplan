const User = require("./model");

const routes = [
  {
    method: "GET",
    path: "count",
    config: { auth: false },
    handler: countUsers
  }
];

async function countUsers(request, h) {
  return await User.countDocuments();
}

module.exports = routes.map(r => {
  r.path = `user/${r.path}`;
  return r;
});
