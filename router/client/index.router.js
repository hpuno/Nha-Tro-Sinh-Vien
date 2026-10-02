const homeRouter = require("./home.router");
const authRouter = require("./auth.router");
const rentalRouter = require("./rental.router");
const middleware = require("../../middleware/auth.middleware");

module.exports = (app) => {
  app.use("/", middleware.authClient, homeRouter);
  app.use("/auth", authRouter);
  app.use("/rental", middleware.authClientPrivate, rentalRouter);
};
