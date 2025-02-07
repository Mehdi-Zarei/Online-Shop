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
const productsRouter = require("./modules/product/product.routes");
const notesRouter = require("./modules/note/V1/note.routes");
const commentRouter = require("./modules/comment/V1/comment.routes");
const cartRouter = require("./modules/cart/V1/cart.routes");
const checkoutRouter = require("./modules/checkout/V1/checkout.routes");
const orderRouter = require("./modules/order/V1/order.routes");
const sellerRequestRouter = require("./modules/sellerRequest/V1/sellerRequest.routes");

const {
  redirectToProductPage,
} = require("./modules/shortLink/V1/shortLink.controller");

const { errorHandler } = require("./middlewares/errorHandler");

//* Swagger Doc
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger.js");

//* Passport Path Files
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
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/seller-requests", sellerRequestRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkouts", checkoutRouter);
app.use("/api/v1/orders", orderRouter);
app.get("/api/v1/p/:shortIdentifier", redirectToProductPage);
app.use("/apis/v1", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//* 404 Error Handler

app.use((req, res) => {
  return res.status(404).json({ message: "OoPss!Page Not Found !!" });
});

//* Global Error Handler

app.use(errorHandler);

module.exports = app;
