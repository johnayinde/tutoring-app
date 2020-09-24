//Schema for the category
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: {
    enum: ["student", "tutor"],
    type: String,
    required: true,
  },
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: "Subject",
  }],
  tutors: [{
    type: Schema.Types.ObjectId,
    ref: "Tutor",
  }],
  students: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  lessons: [{
    type: Schema.Types.ObjectId,
    ref: "Lesson",
  }],
},
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
