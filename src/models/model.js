const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalide");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive");
      }
    },
  },
  description: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("password can not contain password");
      }
    },
  },
  complated: {
    type: Boolean,
  },
  tokens:[{
    token:{
      type: String,
      required: true,
    }
  }],
  avatar:{
    type: Buffer,
  }
},{
  timestamps: true
});
userSchema.virtual("task", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});


userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar

  return userObject;
};

userSchema.methods.generateAuthToken = async (user) => {
  // const user = this;
  console.log(user);
  const token = jwt.sign({ _id: user._id.toString() }, "thisismynewcourse");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};


userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });  
  if (!user) {
      throw new Error("Unable to login");
    }
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);  
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  console.log('*-*--*-**-*--*-*-*---');
  
  return user;
};

userSchema.pre('remove',async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next();
}) 

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
