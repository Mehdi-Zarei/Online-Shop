const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

//* Import Path Files

const { corseOptions } = require("./middlewares/corsOptions");
const authRoutes = require("./modules/auth/V1/auth.routes");
const usersRoutes = require("./modules/users/V1/users.routes");
const locationRoutes = require("./modules/provinces & cities/V1/location.Routes");
const sellerRouter = require("./modules/seller/V1/seller.routes");
const categoryRouter = require("./modules/categories/V1/category.routes");

const { errorHandler } = require("./middlewares/errorHandler");

const passport = require("passport");
const passportLocal = require("./strategies/passport-local");
const passportGoogle = require("./strategies/passport-google");
const passportAccessToken = require("./strategies/passport-accessToken");
const passportRefreshToken = require("./strategies/passport-refreshToken");

//* Built-in Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "..", "public")));

//* Third-party Middleware

app.use(cors(corseOptions));

//* Passport Strategies

passport.use(passportLocal);
passport.use(passportGoogle);
passport.use("accessToken", passportAccessToken);
passport.use("refreshToken", passportRefreshToken);

//* Import Routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/location", locationRoutes);
app.use("/api/v1/categories", categoryRouter);

//* 404 Error Handler

app.use((req, res) => {
  return res.status(404).json({ message: "OoPss!Page Not Found !!" });
});

//* Global Error Handler

app.use(errorHandler);

module.exports = app;
