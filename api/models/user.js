const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const validate = require("validator");

//Schema for the users
const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      // validate: (value) => {
      //   if (!validate.isEmail(validate)) {
      //     throw new Error({ error: "invalid Email address" });
      //   }
      // },
    },

    token: {
      type: String,
      required: true,
    },

    lesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },

    subjects: {
      type: Array,
    },

    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
