const dashboardRouter = require("./dashboard.router");
const tenantRouter = require("./tenant.router");
const housingRouter = require("./housing.router");
const employeeRouter = require("./employee.router");
const roleRouter = require("./role.router");

module.exports = (app) => {
  app.use("/admin/dashboard", dashboardRouter);
  app.use("/admin/tenant", tenantRouter);
  app.use("/admin/housing", housingRouter);
  app.use("/admin/employee", employeeRouter);
  app.use("/admin/role", roleRouter);
};
