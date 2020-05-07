const mongoose = require ("mongoose");
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

//Schema for the users
const userSchema = new Schema(
    {
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    userCategory : {
        type: String,
        enum: ['student', 'tutor'],
        required: true
    },
    admin:{
        type: Boolean,
        default: false,
    },
    schoolCategory : {
        type: Schema.Types.String,
        ref: 'Category'
    },
    subjects:{
        type:Array
    },
    lesson: [{
        type: Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    assignedSubjects:[{
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    
},
    {timestamps: true}
);




module.exports = mongoose.model('User', userSchema);

