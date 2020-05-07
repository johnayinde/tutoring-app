const express = require('express');
const app = express();
const genRoute = require('./routes/auth')
const mongoose = require("mongoose");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(genRoute);


mongoose
	.connect(
		"mongodb+srv://ayindejohn:Ayindeno1.@cluster0-ibfxg.mongodb.net/test?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(result => {
		console.log("Database connected");
		app.listen(3000);
	})
	.catch(err => console.log(err));