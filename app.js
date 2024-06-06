const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const dashboardRouter = require("./routes/dashboard");
const adminRouter = require("./routes/admin");
const siteRouter = require("./routes/site");
const logoutRouter = require("./routes/logout");
const profileRouter = require("./routes/profile");

const { seedDatabase } = require("./lib/seed");

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap-icons/")));

const { sessionPool } = require("./lib/sessionPool");
const sessionStore = new MySQLStore({}, sessionPool);
sessionStore.createDatabaseTable();

seedDatabase();

app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "strict",
      // 1 day
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/dashboard", dashboardRouter);
app.use("/admin", adminRouter);
app.use("/site", siteRouter);
app.use("/profile", profileRouter);

app.use(logoutRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
