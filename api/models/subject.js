//Schema for the subjects
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Category = require("./category");


const subjectSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['pry', 'jss', 'sss']
    },
    tutors: [{
        type: Schema.Types.ObjectId,
        ref: 'Tutor',
    }],

}, { timestamps: true });

// subjectSchema.post('delete', (doc) => {
//     const subjectId = doc._id;
//     console.log("subject id", subjectId);
//     Category.find({ category: 'student', subjects: { $in: [subjectId] } })
//         .then(subject => {
//             console.log("promis", subject);

//             Promise.all(
//                 subject.map(sub => {
//                     Category.findOneAndUpdate(sub._id, { $pull: { subjects: subjectId } }, { new: true })
//                 })
//             )
//         })

// })
module.exports = mongoose.model('Subject', subjectSchema);