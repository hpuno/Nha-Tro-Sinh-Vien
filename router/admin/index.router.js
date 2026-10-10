const dashboardRouter = require("./dashboard.router");
const tenantRouter = require("./tenant.router");
const housingRouter = require("./housing.router");

module.exports = (app) => {
  app.use("/admin/dashboard", dashboardRouter);
  app.use("/admin/tenant", tenantRouter);
  app.use("/admin/housing", housingRouter);
};
