const express = require('express')
const router = express.Router()

const film = require('../models/film')
const verifyToken = require('../verifyToken')

router.get('/', verifyToken, async(req, res)=>{
    try{
        const films = await film.find()
        res.send(films)
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router