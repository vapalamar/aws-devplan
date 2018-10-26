const Hapi = require("hapi");

require("./infra");

const server = Hapi.server({
  port: process.env.IS_DOCKER ? process.env.API_PORT : "8081",
  host: process.env.API_HOST
});

const init = async () => {
  await require("./plugins/auth")(server);
  server.route(require("./app/routes"));
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
