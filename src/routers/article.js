const express = require('express');
const sharp = require('sharp');
const moment = require('moment');
const Article = require('../models/article');
const User = require('../models/user');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// get all Articles
router.get('/articles', async(req, res) => {
    try{
        let articles = await Article.find({deleted: false}).populate("author").skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).sort({'updatedAt': -1});
        // articles = Object.entries(articles)
        console.log(typeof (articles));

        res.status(200).send(articles);
    }catch(err){
        console.log(err.message);

        res.status(500).send({msg: "The server encountered an unexpected condition that prevented it from fulfilling the request."});
    }
});

//TODO: get all Articles of a specific user

// Read an Article
router.get('/articles/:id', async(req, res)=>{

    try{
        if(!Article.validateId(req.params.id)){
            throw new Error("Resource Not Found");
        }

        const article = await Article.findOne({_id: req.params.id, deleted: false}).populate("author");
        if(!article)
        {
            throw new Error("Resource Not Found");
        }
        res.status(200).send(article);
    }catch(err){
        console.log(err.message);

        if(err.message.includes("Resource Not Found"))
        {
            res.status(404).send({msg: err.message});
        }
        res.status(500).send({msg: "The server encountered an unexpected condition that prevented it from fulfilling the request."});
    }

});

// Create an Article
router.post('/articles', auth, upload.single('caption'), async(req, res)=>{
    // console.log(req.body); // testing purposes
    const newArticle = new Article({...req.body, author: req.user._id});
    
    try{
        const buffer = await sharp(req.file.buffer).resize({width: 500, height: 400}).toBuffer();
        // const buffer = await sharp(req.file.buffer).resize({width: 500, height: 400}).png().toBuffer();
        newArticle.image = buffer; // in order to access the buffer in 'req.file.buffer' i must remove the dest property while creating the multer object (see line: 6)
        await newArticle.save();

        res.status(201).send(newArticle);
    }catch(err){
        console.log(err);
        res.status(500).send({msg: "The server encountered an unexpected condition that prevented it from fulfilling the request."});
    }
}, (error, req, res, next)=>{
    res.status(400).send({msg: error.message});
});

// Update an Article
router.put('/article/update/:id', auth, async (req, res)=>{
    const allowed = ['title', 'body'];
    console.log(req.body);
    const upcoming = Object.keys(req.body);

    const validUpdate = upcoming.every((member)=>allowed.includes(member));

    if(!validUpdate)
    {
        res.status(500).send({error: 'A Field or more is NOT valid'});
    }
    if(!Article.validateId(req.params.id)){
        return res.status(404).send({error: 'Resource Not Found'});
    }
    try{
        const article = await Article.findOne({_id: req.params.id, author:req.user._id}); // AndUpdate(req.params.id,req.body, {new:true, runValidators:true}

        if(!article)
        {
            res.status(404).send({error: 'Resource Not Found'});
        }
        upcoming.forEach((item)=> article[item]=req.body[item]);

        await article.save();
        res.status(200).send(article);
    }catch(err){
        console.log(err);

        res.status(500).send({msg: "The server encountered an unexpected condition that prevented it from fulfilling the request."});
        
    }
});

// SoftDelete an Article
router.patch('/article/delete/:id', auth, async(req, res)=>{
    try{
        if(!Article.validateId(req.params.id)){
            throw new Error("Resource Not Found");
        }

        const article = await Article.findOne({_id: req.params.id, deleted: false})
        if(!article)
        {
            throw new Error("Resource Not Found");
        }
        article.deleted = true;
        await article.save();
        res.status(204).send({msg:"done"});
    }catch(err){
        console.log(err.message);

        if(err.message.includes("Resource Not Found"))
        {
            res.status(404).send({msg: err.message});
        }
        res.status(500).send({msg: "The server encountered an unexpected condition that prevented it from fulfilling the request."});
    }
});

// HardDelete an Article
router.delete('/article/delete/:id', auth, async(req, res)=>{
    try{
        if(!Article.validateId(req.params.id)){
            throw new Error("Resource Not Found");
        }

        const article = await Article.findOneAndRemove({_id: req.params.id})
        if(!article)
        {
            throw new Error("Resource Not Found");
        }
        res.status(204).send({msg:"done"});
    }catch(err){
        console.log(err.message);

        if(err.message.includes("Resource Not Found"))
        {
            res.status(404).send({msg: err.message});
        }
        res.status(500).send({msg: "The server encountered an unexpected condition that prevented it from fulfilling the request."});
    }
});

// Get Article image ONLY
router.get('/article/:id/image', async(req, res)=>{
    try {
        if(!Article.validateId(req.params.id)){
            throw new Error("Resource Not Found");
        }
        const article = await Article.findById(req.params.id);
    
        if(!article || !article.image)
        {
            throw new Error("Resource Not Found");
        }

        res.set('Content-Type', 'image/png');
        res.status(200).send(article.image);
    } catch (err) {
        res.status(404).send(err.message);
    }
});
module.exports = router;