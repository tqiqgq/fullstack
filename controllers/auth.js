const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const keys = require('../config/keys')
errorHandler = require('../utils/errorHandler')

module.exports.login = async function(req, res) {
   const candidate = await User.findOne({email: req.body.email})

   if (candidate) {
       // check email in DB
       const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
       if (passwordResult) {
           //generation token
           const token = jwt.sign({
               email: candidate.email,
               userId: candidate._id
           }, keys.jwt, {expiresIn: 60 * 60})

           res.status(200).json({
               token: `Bearer ${token}`
           })
       } else {
           res.status(401).json({
               message: 'Passwords not coincide '
            }) // пароли не совпали
       }
   } else {
       // user not found
       res.status(404).json({message: 'Not found this email'})
   }
}


module.exports.register = async function(req, res) {
    //email and password
    const candidate = await User.findOne({email: req.body.email})
    if (candidate) {
        // user exist
        
        res.status(409).json({
            message: 'This email is busy. Try another'
        })
    } else {
        //need a create user
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            console.log(req.body.email)
            await user.save()
            res.status(201).json(user)
        } catch(e) {
            errorHandler(res, error)
        }
        
    }
    
}