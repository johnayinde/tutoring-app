//Schema for the lessons
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const lessonSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    schoolCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },

    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    },
    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },


}, { timestamps: true });


module.exports = mongoose.model('Lesson', lessonSchema);