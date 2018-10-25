const Hapi = require("hapi");

require("./infra");

const server = Hapi.server({
  port: process.env.API_PORT,
  host: process.env.API_HOST
});

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
