const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
app.listen(process.env.PORT);

const userRouter  = require('./routes/users');
const booksRouter  = require('./routes/books');
const cartsRouter  = require('./routes/carts');
const likesRouter  = require('./routes/likes');
const ordersRouter = require('./routes/orders');

app.use("/users",userRouter);
app.use("/books",booksRouter);
app.use("/carts",cartsRouter);
app.use("likes",likesRouter);
app.use("orders",likesRouter);
