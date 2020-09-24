//Schema for the lessons
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["pry", "jss", "sss"],
    },
    tutor: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
