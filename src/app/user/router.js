const Boom = require("boom");
const User = require("./model");
const validator = require("./validator");
const service = require("./service");

const routes = [
  {
    method: "POST",
    path: "token",
    handler: login,
    options: {
      auth: false,
      validate: {
        payload: validator.login
      }
    }
  },
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

async function login(request, h) {
  const user = await User.findOne()
    .where("email")
    .equals(request.payload.email)
    .exec();

  if (!user) {
    return Boom.notFound("User not found");
  }

  const correctPassword = await service.comparePassword(
    request.payload.password,
    user.password
  );

  if (!correctPassword) {
    return Boom.badRequest("Incorrect email or password");
  }

  try {
    const token = await service.createUserToken(
      user.id,
      user.email,
      user.password
    );
    return token;
  } catch (e) {
    return Boom.internal(e);
  }
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
