const express = require("express");
const User = require("../models/model");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer = require("multer");
const Task = require("../models/model");
const  { sendWelcome ,sendCencle } =require('../emails/accounts')
const sharp = require("sharp");

const { findById } = require("../models/task");
const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 700, height: 700 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  // try{
  const user = await User.findById(req.params.id);
  if (!user || !user.avatar) {
    throw new Error();
  }
  res.set("Content-Type", "image/jpg");
  res.send(user.avatar);
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcome(user.email,user.name)
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_CREDENTIALS);
    console.log(token);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});


router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log(user);
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_CREDENTIALS);
    console.log(token);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    res.status(200).send({ user: user, token });
  } catch (err) {
    res.status(400).send("something is wrong ");
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    // console.log(req.user.token);
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send("sussessfully logged out");
  } catch (err) {
    res.status(500).send(err);
  }
});

// BAKKI..................
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    console.log(req.user.tokens);
    req.user.tokens = [];
    await req.user.save();
    res.send("all users logged out");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/users/me", auth, async (req, res) => {
  console.log(req.user);
  if (req.user == null) {
    res.status(404).send("user not found");
  }
  res.send(req.user);
});

router.get("/users", auth, async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
    console.log(user);
  } catch (err) {
    res.status(400).send(err);
  }
});
 

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowupdate = ["name", "age", "email", "password", "description"];
  const isvalides = updates.every((updates) => allowupdate.includes(updates));
  if (!isvalides) {
    return res.status(400).send({ error: "Invalide updates!" });
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    sendCencle(req.user.email,req.user.name)
    await req.user.remove();
    res.send(req.user);
    // let user = await User.findByIdAndDelete(req.params.id);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;


// const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//   new: true,
//   runValidators: true,
// });
// const user  = await User.findById(req.params.id)
// router.delete("/users/:name", async (req, res) => {
//   try {
//     let user = await User.findOneAndDelete({ name: req.params.name });
//     res.send(user);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// router.get("/users/:name", async (req, res) => {
//   try {
//     const user = await User.findOne({ name: req.params.name }).exec();
//     if (!user) {
//       res.status(404).send("something is wrong");

//     }
//     res.send(user);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });