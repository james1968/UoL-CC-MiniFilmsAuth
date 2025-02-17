const express = require('express')
const router = express.Router()

const User = require('../models/user')
const {registerValidation, loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/register', async(req, res)=> {

    // Validation 1 Registration details
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation 2 Duplicate email
    const userExists = await User.findOne({email:req.body.email})
    if(userExists){
        return res.status(400).send({message:'User already exists'})
    }

    // Hashed password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password,salt)


    // Code to insert data    
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })
    try{
        const savedUser = await user.save()
    res.send(savedUser)
    }catch(err){
        res.status(400).send({message:err})
    }
    
})

router.post('/login', async(req, res)=> {
    
    // Validation 1 Registration details
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation 2 User exists
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).send({message:'User does not exist'})
    }

    // Validate password
    const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
    if(!passwordValidation){
        return res.status(400).send({message:"Incorrect password"})
    }

    // Create token

    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token',token).send({'auth-token':token})


})

module.exports=router