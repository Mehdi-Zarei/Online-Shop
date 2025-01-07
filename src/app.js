const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

//* Import Path Files

//* Built-in Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

//* Third-party Middleware

//* Import Routes

//* 404 Error Handler

app.use((req, res) => {
  return res.status(404).json({ message: "OoPss!Page Not Found !!" });
});

//* Global Error Handler

module.exports = app;
