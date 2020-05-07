//Schema for the subjects
const mongoose = require ("mongoose");
const Schema = mongoose.Schema;


const subjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    schoolCategory: {
        type: Schema.Types.String,
        ref: 'Category'
    },
    tutors: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
},{timestamps: true});


module.exports = mongoose.model('Subject', subjectSchema);