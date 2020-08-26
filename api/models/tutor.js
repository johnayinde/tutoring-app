const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutorSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   class: {
      type: String,
      enum: ['primary', 'jss', 'sss']
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