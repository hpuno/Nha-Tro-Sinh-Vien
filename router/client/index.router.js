const homeRouter = require("./home.router");
const authRouter = require("./auth.router");
const rentalRouter = require("./rental.router");
const userRouter = require("./user.router");
const middleware = require("../../middleware/auth.middleware");

module.exports = (app) => {
  app.use("/", middleware.authClient, homeRouter);
  app.use("/auth", authRouter);
  app.use("/rental", middleware.authClientPrivate, rentalRouter);
  app.use("/user", middleware.authClientPrivate, userRouter);
};
