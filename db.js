const mongoose = require("mongoose");
const express = require('express');
const app = express();
// const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("Database connected");
  })
  .catch((err) => console.log(err));
