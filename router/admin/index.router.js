const dashboardRouter = require("./dashboard.router");
const tenantRouter = require("./tenant.router");
const housingRouter = require("./housing.router");
const employeeRouter = require("./employee.router");
const roleRouter = require("./role.router");
const authRouter = require("./auth.router");
const roomRouter = require("./room.router");
const rentalRouter = require("./rental.router");
const adminMiddleware = require("../../middleware/auth-admin.middleware");

module.exports = (app) => {
  app.use(
    "/admin/dashboard",
    adminMiddleware.authAdminPrivate,
    dashboardRouter,
  );
  app.use("/admin/tenant", adminMiddleware.authAdminPrivate, tenantRouter);
  app.use(
    "/admin/housing",
    adminMiddleware.authAdminPrivate,
    adminMiddleware.privateRouter,
    housingRouter,
  );
  app.use(
    "/admin/employee",
    adminMiddleware.authAdminPrivate,
    adminMiddleware.privateRouter,
    employeeRouter,
  );
  app.use(
    "/admin/role",
    adminMiddleware.authAdminPrivate,
    adminMiddleware.privateRouter,
    roleRouter,
  );
  app.use("/admin/room", adminMiddleware.authAdminPrivate, roomRouter);
  app.use("/admin/rental", adminMiddleware.authAdminPrivate, rentalRouter);

  app.use("/admin/auth", authRouter);
};
