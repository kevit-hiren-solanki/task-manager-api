const express = require("express");
const Task = require("../models/task");
const auth  =  require("../middleware/auth")
const router = new express.Router();

router.post("/task", auth , async (req, res) => {
  // const task = new Task(req.body);
  const task =  new Task({
    ...req.body,
    owner:req.user._id
  })
  try {

    await task.save();
    res.send(task);

    res.status(201);
    console.log(task);
  } catch (err) {
    res.status(400).send(err);

  }
});

router.get("/task", auth , async (req, res) => {
  try {
    const task = await Task.find({owner : req.user._id});
    res.send(task);
    // await req.user.populate({path: 'task', match:{complated : false}}).execPopulate()
    // res.send(req.user.task);
  } catch ({error}) {
    res.status(400).send({error: error});
  }
});




router.get("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
      const task = await Task.findOne({owner: req.user._id}).exec()
      console.log(task); 
      if (!task) {
        return res.status(404).send('task is null');
      }
      res.send(task);
} catch (e) {
    res.status(404).send();
  }
});


router.delete("/task/:id",auth ,async (req, res) => {
  // try {
    // const task = await Task.findOneAndDelete({ name: req.params.name });
    const task = await Task.findOneAndDelete({_id: req.params.id ,owner: req.user._id})
    if(!task)
    {
      res.status(404).send('somthing wrong')
    }
    res.send(task);
  // } catch (err) {
  //   res.status(404).send(err);
  // }
});

// console.log("----------------------------------------------------");

router.patch("/task/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowupdate = ["description" , "complated" ];
  const isvalides = updates.every((updates) => allowupdate.includes(updates));
  if (!isvalides) {
    return res.status(400).send({ error: "Invalide updates!" });
  }
  try {
    const task =  await Task.findOne({_id : req.params.id, owner: req.user._id})
    if (!task) {
      console.log("task not found");
      res.status(404);
    }
    updates.forEach((update) =>{ task[update] = req.body[update]}) 
    task.save()
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router