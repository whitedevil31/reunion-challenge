const User = require("../user/userSchema");
const jwt = require("jsonwebtoken");
const dbClient = require("../db/db.connect");
const HttpError = require("http-errors");
const mongodb = require("mongodb");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const dbConnect = await dbClient();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const response = await dbConnect
      .db()
      .collection("user")
      .findOne({ _id: mongodb.ObjectId(decoded._id) });

    if (response) {
      req.env = {
        user: JSON.stringify(decoded),
      };
      next();
    } else {
      throw HttpError(404, "User not found");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = auth;
