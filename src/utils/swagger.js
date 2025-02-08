const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Shop project REST API Document",
    version: "1.0.0",
    description:
      "Node.js Shop Rest Apis Document.This project is a multi-vendor e-commerce platform that allows users to register, browse and purchase products, and vendors to list their own items for sale. Payments are processed through the Zarinpal gateway, and users can leave reviews for products.",
  },

  host: "localhost:3000",
  basePath: "/apis/v1",
};

const options = { swaggerDefinition, apis: ["./docs/V1/*.yaml"] };

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
