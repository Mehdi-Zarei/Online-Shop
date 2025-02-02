const yup = require("yup");

const createCommentSchema = yup.object({
  content: yup
    .string()
    .min(1, "Content must be at least 1 character long.")
    .max(500, "Content must be less than or equal to 500 characters.")
    .required("Content is required."),

  score: yup
    .number()
    .min(1, "Score must be at least 1.")
    .max(5, "Score must be at most 5.")
    .required("Score is required."),
});

const addReplyCommentSchema = yup.object({
  content: yup
    .string()
    .min(1, "Content must be at least 1 character long.")
    .max(500, "Content must be less than or equal to 500 characters.")
    .required("Content is required."),
});

const setCommentStatusSchema = yup.object({
  isAccept: yup
    .boolean()
    .required("isAccept is required.")
    .oneOf([true, false], "isAccept must be either true or false."),
});

module.exports = {
  createCommentSchema,
  setCommentStatusSchema,
  addReplyCommentSchema,
};
