//Schema for the subjects
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const subjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    class: {
        type: String,
        enum: ['pry', 'jss', 'sss']
    },
    tutors: [{
        type: Schema.Types.ObjectId,
        ref: 'Tutors'
    }],

}, { timestamps: true });


module.exports = mongoose.model('Subject', subjectSchema);