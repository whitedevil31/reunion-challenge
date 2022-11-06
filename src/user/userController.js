const express = require("express");

const router = express.Router();
const auth = require("../utils/auth");
const dbClient = require("../db/db.connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("http-errors");
const mongodb = require("mongodb");
router.post("/authenticate", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    if (email === undefined) throw HttpError(400, "Email is required");

    if (password === undefined) throw HttpError(400, "Password is required");
    const dbConnect = await dbClient();
    const findUser = await dbConnect.db().collection("user").findOne({ email });
    if (!findUser) {
      throw HttpError(
        401,
        "Email does not exist, please create a new account!"
      );
    }
    const correctPassword = await bcrypt.compare(password, findUser.password);

    if (!correctPassword) {
      throw HttpError(401, "Password Incorrect, please try again.");
    }
    const token = jwt.sign(
      {
        email: findUser.email,
        _id: findUser._id,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "10d" }
    );
    res.status(200).json({ message: "Token created", result: token });
  } catch (err) {
    next(err);
  }
});

router.post("/create_user", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  try {
    if (email === undefined) throw HttpError(400, "Email is required");

    if (password === undefined) throw HttpError(400, "Password is required");
    if (username === undefined) throw HttpError(400, "username is required");
    const dbConnect = await dbClient();
    const findUser = await dbConnect.db().collection("user").findOne({ email });

    if (findUser) {
      throw HttpError(409, "Email already exist");
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const response = await dbConnect
      .db()
      .collection("user")
      .insertOne({ email, password: hashedPassword, username });
    const token = jwt.sign(
      {
        email: email,
        _id: response.insertedId,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "10d" }
    );
    res.status(201).json({ message: "User created", result: token });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
router.post("/follow/:id", auth, async (req, res, next) => {
  const userId = req.params.id;
  const userData = JSON.parse(req.env.user);

  try {
    if (userId === undefined) throw HttpError(400, "Id is required");
    const dbConnect = await dbClient();
    const findUser = await dbConnect
      .db()
      .collection("user")
      .findOne({ _id: mongodb.ObjectId(userId) });

    if (!findUser) throw HttpError(404, "User not found");
    const findIfAlreadyExist = await dbConnect
      .db()
      .collection("followers")
      .findOne({
        userId: mongodb.ObjectId(userId),
        follower: mongodb.ObjectId(userData._id),
      });
    if (!findIfAlreadyExist) {
      await dbConnect
        .db()
        .collection("followers")
        .insertOne({
          userId: mongodb.ObjectId(userId),
          follower: mongodb.ObjectId(userData._id),
        });
    }

    res.status(200).json({ message: "Following the user" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
router.post("/unfollow/:id", auth, async (req, res, next) => {
  const userId = req.params.id;
  const userData = JSON.parse(req.env.user);
  try {
    if (userId === undefined) throw HttpError(400, "Id is required");
    const dbConnect = await dbClient();
    const findUser = await dbConnect
      .db()
      .collection("user")
      .findOne({ _id: mongodb.ObjectId(userId) });

    if (!findUser) throw HttpError(404, "User not found");
    const findIfAlreadyExist = await dbConnect
      .db()
      .collection("followers")
      .findOne({
        userId: mongodb.ObjectId(userId),
        follower: mongodb.ObjectId(userData._id),
      });

    if (findIfAlreadyExist) {
      await dbConnect
        .db()
        .collection("followers")
        .deleteOne({
          userId: mongodb.ObjectId(userId),
          follower: mongodb.ObjectId(userData._id),
        });
    }

    res.json({ message: "Unfollowing the user " });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
router.get("/user", auth, async (req, res, next) => {
  const userData = JSON.parse(req.env.user);

  try {
    const dbConnect = await dbClient();
    const findUser = await dbConnect
      .db()
      .collection("user")
      .findOne({ _id: mongodb.ObjectId(userData._id) });

    const followingData = await dbConnect
      .db()
      .collection("followers")
      .find({ follower: mongodb.ObjectId(userData._id) })
      .count();
    const followersData = await dbConnect
      .db()
      .collection("followers")
      .find({ userId: mongodb.ObjectId(userData._id) })
      .count();
    res.json({
      username: findUser.username,
      number_of_followers: followersData,
      number_of_following: followingData,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
module.exports = router;
