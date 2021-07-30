const express = require("express");
const router = express.Router();
const Postmodel = require("../models/PostModel");
const Usermodel = require("../models/UserModel");
const authMiddleware = require("../middleware/authMiddleware");
const uuid = require("uuid").v4;

// Create Post
router.post("/", authMiddleware, async (req, res) => {
  const { text, location, picUrl } = req.body;

  if (text.length < 1) {
    return res.status(401).send("متن باید حداقل بیشتر از 1 کاراکتر باشد");
  }

  try {
    const newPost = {
      user: req.userId,
      text,
    };

    if (location) newPost.location = location;
    if (picUrl) newPost.picUrl = picUrl;

    const post = await new Postmodel(newPost).save();

    return res.status(200).json(post._id);
  } catch (error) {
    res.status(500).send("server error");
  }
});

//Get All Post
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Postmodel.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user");

    return res.status(200).json(posts);
  } catch (error) {
    return res.json(401).send("server error");
  }
});

//Get A Post By ID
router.get("/:postid", authMiddleware, async (req, res) => {
  const post = await Postmodel.findById(req.params.postid)
    .populate("user")
    .populate("comments.user");

  if (!post) {
    return res.status(404).send("مطلب مورد نظر یافت نشد");
  }

  return res.status(200).json(post);
});

// DELETE POST BY ID
router.delete(":/potid", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { postid } = req.params;

    const user = await Usermodel.findById(userId);

    const post = await Postmodel.findById(postid);

    if (post.user.toString() !== userId) {
      if (user.role === "root") {
        await post.remove();
        return res.status(200).send("پست با موفقیت حذف شد");
      } else {
        return res.status(404).send("اجازه دسترسی برای حذف پست را ندارید");
      }
    }

    await post.remove();
    return res.status(200).send("پست با موفقیت حذف شد");
  } catch (error) {
    return res.status(500).send("server error");
  }
});

//POST LIKE
router.post("/like/:postid", authMiddleware, async (req, res) => {
  try {
    const { postid } = req.params;

    const { userId } = req;

    const post = await Postmodel.findById(postid);
    if (!post) {
      return res.status(404).send("Post Not Found");
    }

    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length > 0;

    if (isLiked) {
      return res.status(401).send("پست  قبلا لایک شده");
    }

    await post.likes.unshift({ user: userId });
    await post.save();

    return res.status(200).send("پست لایک شد");
  } catch (error) {
    return res.status(500).send("خطای سرور");
  }
});

//POST UNLIKE
router.put("/unlike/:postid", authMiddleware, async (req, res) => {
  try {
    const { postid } = req.params;

    const { userId } = req;

    const post = await Postmodel.findById(postid);

    if (!post) {
      return res.status(404).send("Post Not Found");
    }

    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length === 0;

    if (isLiked) {
      return res.status(401).send("پست  قبلا لایک نشده");
    }

    const index = await post.likes
      .map((like) => like.user.toString())
      .indexOf(userId);

    await post.likes.splice(index, 1);
    await post.save();

    return res.status(200).send("پست دیسلایک شد");
  } catch (error) {
    return res.status(500).send("خطای سرور");
  }
});

//GET ALL LIKED POSTS
router.get("/like/:postid", authMiddleware, async (req, res) => {
  try {
    const { postid } = req.params;
    const { userId } = req;

    const post = await Postmodel.findById(postid).populate("likes.user");
    if (!post) {
      return res.status(401).send("پست یافت نشد");
    }

    return res.status(200).json(post.likes);
  } catch (error) {
    return res.status(500).send("خطای سرور");
  }
});

//ADD  NEW COMMENT
router.post("/comment/:postid", authMiddleware, async (req, res) => {
  try {
    const { postid } = req.params;
    const { userId } = req;
    const { text } = req.body;

    console.log("salam");

    const post = await Postmodel.findById(postid);
    if (!post) {
      return res.status(404).send("پست یافت نشد");
    }

    const newComment = {
      _id: uuid(),
      text,
      user: userId,
      date: Date.now(),
    };

    await post.comments.unshift(newComment);
    await post.save();

    return res.status(200).json(newComment._id);
  } catch (error) {
    return res.status(500).send("خطای سرور");
  }
});

//DELETE COMMENT
router.delete("/:postid/:commentid", authMiddleware, async (req, res) => {
  try {
    const { postid, commentid } = req.params;
    const { userId } = req;

    const post = await Postmodel.findById(postid);
    if (!post) {
      return res.status(404).send("پست یافت نشد");
    }

    const comment = await post.comments.find(
      (comment) => comment._id === commentid
    );
    if (!comment) {
      return res.status(404).send("نظر یافت نشد");
    }

    const user = await Usermodel.findById(userId);

    const deleteComment = async () => {
      const index = post.comments
        .map((comment) => comment._id)
        .indexOf(commentid);
      await post.comments.splice(index, 1);
      await post.save();
      return res.status(200).send("نظر با موفقیت حذف شد");
    };

    if (comment.user.toString() !== userId) {
      if (user.role === "root") {
        await deleteComment();
      } else {
        return res.status(401).send("احراز هویت نشده");
      }
    }

    await deleteComment();
  } catch (error) {
    return res.status(500).send("خطا از سرور");
  }
});

module.exports = router;
