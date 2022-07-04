const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const taskScema = new mongoose.Schema({
  description: {
    type: String,
    require: true,
    trim: true,
  },
  complated: {
    type: Boolean,
    default: false,
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User'
  }
},{
  timestamps: true,
});

taskScema.pre("save", async function (next) {
  const task = this;
  if (task.isModified("password")) {
    task.password = await bcrypt.hash(task.password, 8);
  }
  next();
});


const task = mongoose.model("Task",taskScema)




module.exports = task;