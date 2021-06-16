const mongoose = require('mongoose');

console.log(process.env.MONGODB_URL);
console.log(process.env.PORT);
console.log(process.env.JWT_SECRET);
try {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true, // 
        useCreateIndex: true, // False by default. Set to true to make Mongoose's default index build use
        useFindAndModify: false,  // True by default. Set to false to make findOneAndUpdate() and findOneAndRemove() use native findOneAndUpdate() rather than findAndModify().
        useUnifiedTopology: true //False by default. Set to true to opt in to using the MongoDB driver's new connection management engine. You should set this option to true, except for the unlikely case that it prevents you from maintaining a stable connection.
    })
}catch (error) {
    console.log(error);
    handleError(error);
  }
