//Schema for the category
const mongoose = require ("mongoose");
const Schema = mongoose.Schema;


const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    tutors: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
},{timestamps: true});


module.exports = mongoose.model('Category', categorySchema);
