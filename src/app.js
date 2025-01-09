const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

//* Import Path Files

const { corseOptions } = require("./middlewares/corsOptions");
const authRoutes = require("./modules/auth/V1/auth.routes");
const { errorHandler } = require("./middlewares/errorHandler");
const passport = require("passport");
const passportLocal = require("./strategies/passport-local");

//* Built-in Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

//* Third-party Middleware

app.use(cors(corseOptions));

passport.use(passportLocal);

//* Import Routes

app.use("/api/v1", authRoutes);

//* 404 Error Handler

app.use((req, res) => {
  return res.status(404).json({ message: "OoPss!Page Not Found !!" });
});

//* Global Error Handler

app.use(errorHandler);

module.exports = app;
