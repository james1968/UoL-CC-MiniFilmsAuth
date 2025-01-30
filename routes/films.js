const express = require('express')
const router = express.Router()

const film = require('../models/film')

router.get('/', async(req, res)=>{
    try{
        const films = await film.find()
        res.send(films)
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router