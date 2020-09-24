const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutorSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   level: {
      type: String,
      enum: ['pry', 'jss', 'sss']
   },
   subject: {
      type: Array
   },
   lessons: [{
      type: Schema.Types.ObjectId,
      ref: 'Lesson'
   }],
});

module.exports = mongoose.model('Tutor', tutorSchema);