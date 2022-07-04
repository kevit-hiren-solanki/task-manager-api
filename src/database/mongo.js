const mongoose = require("mongoose");
// const user  = require('./db')

mongoose.connect(process.env.MONGODB_CONNECTION, () =>
  console.log("Mongodb connection established")
);


// const me  = new User({
//   name:'hiren',
//   age: 20,
//   email: 'rs@example.com    ',
//   description:'hirenss',
//   password: 'password1525',
//   complated : true
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((err)=>
//   console.log(err))

// app.listen(3000,()=> {console.log('listening on port 3000')})
