const yup = require("yup");
const mongoose = require("mongoose");

const createNoteSchema = yup.object().shape({
  productID: yup
    .string()
    .required()
    .test("is-valid-objectid", "Product ID Not Valid !!", (value) =>
      mongoose.isValidObjectId(value)
    ),
  content: yup.string().required().max(500),
});

const updateNoteSchema = yup.object().shape({
  content: yup.string().required().max(500),
});

module.exports = { createNoteSchema, updateNoteSchema };
