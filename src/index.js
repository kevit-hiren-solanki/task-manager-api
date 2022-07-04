const express = require("express");
const multer = require("multer");
require("./database/mongo");
const userRouter =  require("./routers/userrouter")

const taskRouter  = require("./routers/taskrouter")

const app = express();
const port = process.env.PORT || 3000;

// const upload = multer({
//   dest: "images",
//   limits:{
//     fileSize:1000000
//   },
//   fileFilter(req,file,cb)
//   {
//     // if(!file.originalname.endsWith(".pdf"))
//     if(!file.originalname.endsWith(".jpg") || !file.originalname.endsWith(".png") || !file.originalname.endsWith(".jpeg")) 
//     {
//       return cb(new Error("Please upload a pdf please upload only jpg or jprg files"))
//     }
//     cb(undefined,true)
//   }
// });

// app.post("/upload", upload.single("upload"), (res, req) => {
//   res.send()
// });

// app.use((req, res, next) => {
//   res.status(504).send('website under maintenance')
// })

app.use(express.json());

app.use(userRouter)
app.use(taskRouter);




// app.patch("/task/data/:id", (req, res) => {
//   console.log(req.params.id);

//   Task.findOneAndUpdate(
//     { id: req.params.id },
//     { $set: { name: req.body.name, description: req.body.description } }
//   )
//     .then((user) => {
//       res.send(user);
//     })
//     .catch((err) => res.status(400).send(err));
// });


app.listen(port, () => {
  console.log("listening on port " + port);
});

