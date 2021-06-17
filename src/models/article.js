const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema
(
    {
        title: 
        {
            type: String,
            required: true,
            trim: true,
        },
        
        body:
        {
            type: String,
            required: true,
        },

        image:
        {
            type: Buffer,
            required: false,
        },

        deleted:
        {
            type: Boolean,
            default: false
        },

        author:
        {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: true // This will automatically add, createdAt & updatedAt fields in the collection
    }
);



const Article = mongoose.model('Article', articleSchema);
module.exports = Article;