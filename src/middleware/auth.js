const jwt = require('jsonwebtoken');
const User = require('../models/model')

const auth  =  async (req, res, next) => {
    try{
        // console.log(req.headers("authorization"));
        const token = req.header("Authorization").replace("Bearer ", "");
  
        const decode = jwt.verify(token, process.env.JWT_CREDENTIALS);
        
        const user = await User.findOne({_id:decode._id, 'tokens.token': token})
        // if(!user)throw new Error()
            
        req.token = token
        req.user  =  user
        next()
    }catch(err){
        res.status(400).send({error: 'please Authenticate first'})
    }
}

module.exports = auth