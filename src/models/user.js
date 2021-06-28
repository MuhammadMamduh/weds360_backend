const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

// Schema
const userSchema = new Schema
(
    {
        name:
        {
            type: String,
            required: true,
            trim: true
        },
        email:
        {
            type: String,
            unique:true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value){
                if(!validator.isEmail(value))
                {
                    throw new Error('This is NOT a valid Email format');
                }
            }
        },
        password:
        {
            type: String,
            trim: true,
            minlength: 7,
            validate(value){
                if(value.toLowerCase().includes('password'))
                {
                    throw new Error('Password should NOT contain the word [password]');
                }
            }
        },
        age:
        {
            type: Number,
            default: 0,
            validate(value) {
                if(value<0)
                {
                    throw new Error('Age must be a postive number');
                }
            }
        },
        tokens:[{
                token:{
                    type: String,
                    required: true,
                }
            }],
        avatar: {
            type: Buffer,
        },
        // articles:[{ type: Schema.Types.ObjectId, ref: 'Article' }]
    },
    {
        timestamps: true
    }
);
// ______________________

userSchema.virtual('articles', {
    ref: 'Article',
    localField: '_id',
    foreignField: 'author'
})
// ______________________________________________________________________________________

// Middleware
userSchema.methods.toJSON = function (){
    const user = this;
    const userObject = user.toObject();
    
    delete userObject.password;
    delete userObject.tokens;
    // delete userObject.avatar;


    return userObject;
}

userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password, 8); 
    }

    next();
});

userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner:user._id});

    next();
});
// ______________________________________________________________________________________

userSchema.statics.findUserByCredentials = async (email, password) => {
    
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Invalid Email or Password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);

    if(!isMatch){
        throw new Error('Invalid Email or Password');
    }

    return user;
}

// validate user
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET);

    user.tokens.push({token});
    await user.save(); // & here save actually does update

    return token;
}

const User = mongoose.model('User', userSchema);
module.exports = User;