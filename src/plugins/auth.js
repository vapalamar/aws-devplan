const User = require("../app/user/model");

const validate = async function(decoded, request) {
  const user = await User.findById(decoded.id);

  if (!user) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
};

module.exports = async server => {
  await server.register(require("hapi-auth-jwt2"));

  server.auth.strategy("jwt", "jwt", {
    key: process.env.AUTH_KEY,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] }
  });

  server.auth.default("jwt");
};
