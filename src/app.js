const express = require('express');
require('./db/mongoose'); // MUST get loaded 

const userRouter = require('./routers/user');
const articleRouter = require('./routers/article');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(articleRouter);

module.exports = app