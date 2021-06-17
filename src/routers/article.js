const express = require('express');

const Article = require('../models/article');
const router = express.Router();
const auth = require('../middleware/auth');

// get all Articles
router.get('/articles', (req, res) => {

});

//TODO: get all Articles of a specific user

// Read an Article
router.get('/articles/:id', (req, res)=>{

});

// Create an Article
router.post('/articles', auth, (req, res)=>{

});

// Update an Article
router.patch('/articles/:id', auth, (req, res)=>{

});

// Delete an Article
router.delete('/articles/:id', auth, (req, res)=>{

});

module.exports = router;