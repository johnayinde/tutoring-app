const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const userRoute = require("./api/routes/users");
const categoryRoute = require("./api/routes/category");
const subjectRoute = require("./api/routes/subject");
const lessonRoute = require("./api/routes/lesson");
const tutorRoute = require("./api/routes/tutor");


require("dotenv").config();
require("./startup/db");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handle any CORS error
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*')
   res.header('Access-Control-Allow-Headers',
      'Origin,X-Requested-With, Content-Type, Accept,Authorization');
   if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Headers',
         'PUT, DELETE,POST,GET,PATCH')
      return res.status(200).json({})
   }
   next()
})

app.use("/api/v1", userRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/subject", subjectRoute);
app.use("/api/v1/lesson", lessonRoute);
app.use("/api/v1/tutor", tutorRoute);

app.get('/', (req, res, next) => {
   res.send("Wellcome to my online tutoring App")
})



app.use((req, res, next) => {
   const error = new Error('Route Not Found');
   error.status = 404;
   next(error);
})

app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
      error: {
         message: error.message,
      }
   })
})


app.listen(2000);