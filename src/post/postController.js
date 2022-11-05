const express = require("express");

const router = express.Router();
const auth = require("../utils/auth");
const dbClient = require("../db/db.connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("http-errors");
const mongodb = require("mongodb");
const { response } = require("express");

router.post("/posts", auth, async (req, res, next) => {
  const title = req.body.title;
  const desc = req.body.description;
  const userData = JSON.parse(req.env.user);
  try {
    if (title === undefined) throw HttpError(400, "Title is required");

    if (desc === undefined) throw HttpError(400, "description is required");
    const dbConnect = await dbClient();

    const postData = {
      userId: userData._id,
      title,
      description: desc,
      createdAt: new Date().getTime(),
    };
    const response = await dbConnect
      .db()
      .collection("posts")
      .insertOne(postData);

    res.status(201).json({
      title,
      description: desc,
      createdAt: postData.createdAt,
      postId: response.insertedId,
    });
  } catch (err) {
    next(err);
  }
});
router.delete("/posts/:id", auth, async (req, res, next) => {
  const postId = req.params.id;
  const userData = JSON.parse(req.env.user);
  try {
    if (postId === undefined) throw HttpError(400, "Id is required");
    const dbConnect = await dbClient();
    const findPost = await dbConnect
      .db()
      .collection("posts")
      .findOne({ userId: userData._id, _id: mongodb.ObjectId(postId) });
    if (!findPost) {
      throw HttpError(404, "Post not found");
    }

    await dbConnect
      .db()
      .collection("posts")
      .deleteOne({ _id: mongodb.ObjectId(postId) });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
});

router.delete("/posts/:id", auth, async (req, res, next) => {
  const postId = req.params.id;
  const userData = JSON.parse(req.env.user);
  try {
    if (postId === undefined) throw HttpError(400, "Id is required");
    const dbConnect = await dbClient();
    const findPost = await dbConnect
      .db()
      .collection("posts")
      .findOne({ userId: userData._id, _id: mongodb.ObjectId(postId) });
    if (!findPost) {
      throw HttpError(404, "Post not found");
    }

    await dbConnect
      .db()
      .collection("posts")
      .deleteOne({ _id: mongodb.ObjectId(postId) });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
});

router.post("/like/:id", auth, async (req, res, next) => {
  const postId = req.params.id;
  const userData = JSON.parse(req.env.user);
  try {
    if (postId === undefined) throw HttpError(400, "Id is required");
    const dbConnect = await dbClient();
    const findPost = await dbConnect
      .db()
      .collection("posts")
      .findOne({ _id: mongodb.ObjectId(postId) });
    if (!findPost) {
      throw HttpError(404, "Post not found");
    }
    const liked = await dbConnect
      .db()
      .collection("likes")
      .findOne({ userId: userData._id, postId });
    if (!liked) {
      await dbConnect
        .db()
        .collection("likes")
        .insertOne({ postId, userId: userData._id });
    }

    res.status(200).json({ message: "Post liked" });
  } catch (err) {
    next(err);
  }
});
router.post("/unlike/:id", auth, async (req, res, next) => {
  const postId = req.params.id;
  const userData = JSON.parse(req.env.user);
  try {
    if (postId === undefined) throw HttpError(400, "Id is required");
    const dbConnect = await dbClient();
    const findPost = await dbConnect
      .db()
      .collection("posts")
      .findOne({ _id: mongodb.ObjectId(postId) });
    if (!findPost) {
      throw HttpError(404, "Post not found");
    }
    const liked = await dbConnect
      .db()
      .collection("likes")
      .findOne({ userId: userData._id, postId });

    if (liked) {
      await dbConnect
        .db()
        .collection("likes")
        .deleteOne({ postId, userId: userData._id });
    }
    res.status(200).json({ message: "Unliked post" });
  } catch (err) {
    next(err);
  }
});

router.post("/comment/:id", auth, async (req, res, next) => {
  const postId = req.params.id;
  const comment = req.body.comment;
  const userData = JSON.parse(req.env.user);
  try {
    if (postId === undefined) throw HttpError(400, "Id is required");
    if (comment === undefined) throw HttpError(400, "comment is required");
    const dbConnect = await dbClient();
    const findPost = await dbConnect
      .db()
      .collection("posts")
      .findOne({ _id: mongodb.ObjectId(postId) });
    if (!findPost) {
      throw HttpError(404, "Post not found");
    }
    const response = await dbConnect
      .db()
      .collection("comments")
      .insertOne({ userId: userData._id, comment, postId });
    res.status(200).json({ commentId: response.insertedId });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
router.get("/posts/:id", auth, async (req, res, next) => {
  const postId = req.params.id;

  try {
    if (postId === undefined) throw HttpError(400, "Id is required");

    const dbConnect = await dbClient();
    const findPost = await dbConnect
      .db()
      .collection("posts")
      .findOne({ _id: mongodb.ObjectId(postId) });
    if (!findPost) {
      throw HttpError(404, "Post not found");
    }
    const likes = await dbConnect
      .db()
      .collection("likes")
      .find({ postId })
      .toArray();
    const comments = await dbConnect
      .db()
      .collection("comments")
      .find({ postId })
      .toArray();

    res.status(200).json({
      ...findPost,
      no_of_likes: likes.length,
      no_of_comments: comments.length,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
module.exports = router;
