const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const connectDB = require("./db/db.connect");
const userController = require("./user/userController");
const postController = require("./post/postController");
connectDB();
app.use(express.json());
app.use("/api", userController);
app.use("/api", postController);
app.use((error, req, res, next) => {
  if (error) {
    res.status(error.status).json({ message: error.message });
  }
});

port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server is up on port " + port);
});

module.exports = app;
