const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
// _____________________________________________________________________________

// Middleware
articleSchema.methods.toJSON = function (){
    const article = this;
    const articleObject = article.toObject();
    
    // delete articleObject.image;

    return articleObject;
}
// _____________________________________________________________________________

articleSchema.statics.validateId = (id) => {
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return true;
      }
      return false;
}
const Article = mongoose.model('Article', articleSchema);
module.exports = Article;