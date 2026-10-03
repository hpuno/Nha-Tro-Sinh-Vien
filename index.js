const express = require("express");
require("dotenv").config();
require("./config/cloudinary");
const port = process.env.PORT;
const initData = require("./models/initData.model");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const methodOverride = require("method-override");
const clientRouter = require("./router/client/index.router");
const adminRouter = require("./router/admin/index.router");
const { keycloak, memoryStore } = require("./config/keycloak");

const app = express();

// connect database
initData.initTables();

// pug
app.set("views", `${__dirname}/view`);
app.set("view engine", "pug");

// statis file
app.use(express.static(`${__dirname}/public`));

// body parser
app.use(bodyParser.urlencoded({ extended: true }));

// method-override
app.use(methodOverride("_method"));

// keycloak
app.use(
  expressSession({
    secret: "he-thong-nha-tro-secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);
app.use(keycloak.middleware());

// flash
app.use(cookieParser(process.env.KEY));
app.use(flash());

// router
clientRouter(app);
adminRouter(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
