const mongoose = require("mongoose");
const express = require('express');
const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.CONNECTION_URL || "mongodb://localhost/tutoring_api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log(`Database connected @ PORT ${PORT}`);
  })
  .catch((err) => console.log(err));
