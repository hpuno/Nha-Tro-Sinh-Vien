const express = require("express");
require("dotenv").config();
require("./config/cloud");
const port = process.env.PORT;
const initData = require("./models/initData.model");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const methodOverride = require("method-override");

const app = express();

// connect database
initData.initTables();

// pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// statis file
app.use(express.static(`${__dirname}/public`));

// body parser
app.use(bodyParser.urlencoded({ extended: true }));

// flash
app.use(cookieParser(process.env.KEY));
app.use(expressSession({ cookie: { maxAge: 60000 } }));
app.use(flash());

// method-override
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
