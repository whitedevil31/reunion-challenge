const yup = require("yup");

const userSchema = yup.object({
  username: yup.string().trim().email().required(),
  email: yup.string().trim().email().required(),
  password: yup
    .string()
    .trim()
    .min(8, "Password must have at least 8 characters")
    .required(),
});

module.exports = userSchema;
