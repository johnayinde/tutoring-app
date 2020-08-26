//Schema for the lessons
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const lessonSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    class: {
        type: String,
        enum: ['primary', 'jss', 'sss']
    },
    tutor: {
        type: String,
        required: true,
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

}, { timestamps: true });


module.exports = mongoose.model('Lesson', lessonSchema);