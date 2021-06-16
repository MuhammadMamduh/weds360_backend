const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Register
router.post('/users', async(req, res)=>{
    const x = {
        name: "mo",
        email: "mo@email.com",
        password:"12345678",
        age:"10",
        tokens:[]
    }
    JSON.stringify(x);
    await new User(x).save();
    try{
        const newUser = new User(req.body);
        await newUser.save(); // create

        const token = await newUser.generateAuthToken(); // & authorize

        res.status(201).send({user, token});  
    }catch(err){
        console.log(err);
        res.status(500).send({msg: "The server encountered an unexpected condition that prevented it from fulfilling the request."});  
    }
});

// Login
router.get('users/login', (req, res)=>{

});

// Logout
router.post('/users/logout', (req, res)=>{

});

// User's Profile
router.get('users/me', (req, res)=>{

});

// get all users
router.get('/users', async (req, res) => {
    
    try{
        const users = await User.find({});
        res.status(200).send({users});
    }catch(err){
        console.log(err);
    }
});



module.exports = router;