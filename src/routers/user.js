const express = require('express');

const User = require('../models/user');
const Article = require('../models/article');
const router = express.Router();
const auth = require('../middleware/auth');
//TODO: get all Articles of a specific user
// Register
router.post('/users', async(req, res)=>{
    try{
        const newUser = new User(req.body);
        await newUser.save(); // create

        const token = await newUser.generateAuthToken(); // & authorize

        res.status(201).send({newUser, token});  // it's important to send the generated token back to the user, because thats what he's going to use to authenticate in the future.
    }catch(err){
        console.log(err);

        if(err.message.includes("duplicate key error collection"))
        {
            res.status(409).send({msg: "This Email is already taken"}); 
        }
        else{
            res.status(500).send({msg: "The server encountered an unexpected condition that prevented it from fulfilling the request."}); 
        }
    }
});

// Login
router.post('/users/login', async(req, res)=>{
    try{    
        const user = await User.findUserByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.status(200).send({user, token}); // it's important to send the generated token back to the user, because thats what he's going to use to authenticate in the future.
    }catch(err){
        console.log(err);

        res.status(400).send({msg: err.message});
    }
});

// Logout
router.post('/users/logout', auth, async(req, res)=>{
    try{
        const token = req.token;

        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        })

        await req.user.save();

        res.status(200).send({msg: "Logged Out"})
    }catch(err){
        console.log(err);

        res.status(400).send(err);
    }
});

// Hard-Logout
router.post('/users/logoutAll', auth, async(req, res)=>{
    try{
        req.user.tokens = [];

        await req.user.save();

        res.status(200).send({msg: "Logged Out From All the devices"})
    }catch(err){
        console.log(err);

        res.status(400).send(err);
    }
});

// User's Profile
router.get('users/me', (req, res)=>{

});

// User's Articles
router.get('/user/articles', auth, async(req, res)=>{
    const user = new User(req.user);

    await req.user.populate({
        path: 'articles', 
        match:{deleted:false}
    }).execPopulate();
    console.log(req.user.articles);

    const result = {user: req.user, articles:req.user.articles}
    res.send(result);
});

// get all users (Testing)
router.get('/users', async (req, res) => {
    try{
        const users = await User.find({});
        res.status(200).send({users});
    }catch(err){
        console.log(err);
        
        es.status(500).send({err: "sth went wrong"});
    }
});

module.exports = router;