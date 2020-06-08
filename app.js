const express = require("express");
const app = express();
const userRoute = require("./api/routes/users");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = 3000;


require("./db");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1", userRoute);

app.listen(port, console.log("connect to database at " + port));
