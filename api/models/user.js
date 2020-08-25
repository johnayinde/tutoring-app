const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const validate = require("validator");

//Schema for the users
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    token: {
      type: String
    },
    category: {
      type: String,
      required: true,
      default: 'student',
      enum: ['student', 'tutor']
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    subjects: {
      type: Array
    },
    lessons: [{
      type: Schema.Types.ObjectId,
      ref: 'Lesson'
    }],
  }, { timestamps: true });


userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin, category: this.category },
    process.env.JWT_KEY);
  return token;
}

const User = mongoose.model("user", userSchema);
module.exports = User
