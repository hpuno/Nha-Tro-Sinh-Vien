const dashboardRouter = require("./dashboard.router");
const tenantRouter = require("./tenant.router");
const housingRouter = require("./housing.router");
const employeeRouter = require("./employee.router");
const roleRouter = require("./role.router");
const authRouter = require("./auth.router");
const adminMiddleware = require("../../middleware/auth-admin.middleware");
module.exports = (app) => {
  app.use(
    "/admin/dashboard",
    adminMiddleware.authAdminPrivate,
    dashboardRouter,
  );
  app.use("/admin/tenant", adminMiddleware.authAdminPrivate, tenantRouter);
  app.use("/admin/housing", adminMiddleware.authAdminPrivate, housingRouter);
  app.use("/admin/employee", adminMiddleware.authAdminPrivate, employeeRouter);
  app.use("/admin/role", adminMiddleware.authAdminPrivate, roleRouter);
  app.use("/admin/auth", authRouter);
};
