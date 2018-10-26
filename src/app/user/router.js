const Boom = require("boom");
const User = require("./model");
const validator = require("./validator");
const service = require("./service");

const routes = [
  {
    method: "POST",
    path: "",
    handler: createUser,
    options: {
      auth: false,
      validate: {
        payload: validator.createUser
      }
    }
  },
  {
    method: "GET",
    path: "count",
    options: { auth: "jwt" },
    handler: countUsers
  }
];

async function countUsers(request, h) {
  return await User.countDocuments().exec();
}

async function createUser(request, h) {
  const alreadyExists = await User.findOne()
    .where("email")
    .equals(request.payload.email)
    .exec();
  if (alreadyExists) {
    return Boom.badRequest("User with such email already exists");
  }

  try {
    const hash = await service.encodeUserPass(request.payload.password);
    const userModel = new User({ ...request.payload, password: hash });
    const user = await userModel.save();

    return user;
  } catch (err) {
    return Boom.badRequest(err.message);
  }
}

module.exports = routes.map(r => {
  r.path = r.path ? `user/${r.path}` : "user";
  return r;
});
