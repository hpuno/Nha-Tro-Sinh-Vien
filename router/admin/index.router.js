const dashboardRouter = require("./dashboard.router");
const tenantRouter = require("./tenant.router")

module.exports = (app) => {
  app.use("/admin/dashboard", dashboardRouter);
app.use("/admin/tenant", tenantRouter)
};
