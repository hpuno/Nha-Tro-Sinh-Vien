const homeRouter = require("./home.router");
const authRouter = require("./auth.router");

module.exports = (app) => {
  app.use("/", homeRouter);
  app.use("/auth", authRouter);
};
