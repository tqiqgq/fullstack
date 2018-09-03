const User = require('../models/User')



module.exports.login = function(req, res) {
    res.status(200).json({
        login: {
            email: req.body.email,
            password: req.body.password
        }
    })
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
    }
    user.save().then(() => console.log('User created'))
}