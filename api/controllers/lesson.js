const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const debug = require("debug")("app:userController");
const chalk = require("chalk");
const Category = require("../models/category");
const Lesson = require("../models/lesson");
const Tutor = require("../models/tutor");

module.exports = class lessonController {
   static async bookLessonByStudent(req, res, next) {
      const subject = req.body.subject;
      if (!subject) return res.status(423).send("Subject field required");

      try {
         const newLesson = await Lesson.findOne({ subject });
         if (!newLesson)
            return res.status(423).send(`No Lesson with ${subject} yet`);

         const updateUser = await User.findOneAndUpdate(
            { _id: req.user._id },
            { $push: { lessons: newLesson._id } },
            { useFindAndModify: false, new: true }
         );
         // debug(newLesson, updateUser);

         res.status(200).json({
            status: true,
            message: "You have successfully booked a Lesson",
         });
      } catch (error) {
         res.status(500).send(error);
      }
   }

   static async bookLesson_admin(req, res, next) {
      /**
       * get subject,level,t=name of tutor = req.body
       * create lesson
       * push lesson to category(tutor),
       * push lesson to tutor(name)
       * if no tutor registred
       *    create tutor
       */
      const { subject, level, tutor } = req.body;
      try {
         const tutorExist = await Tutor.findOne({ name: tutor })
         if (!tutorExist) return res.send(`${tutor} is not a registered tutor`);

         const lesson = new Lesson({ subject, tutor, level });
         const exist = await Lesson.findOne({ tutor, level });

         if (exist) return res.send(`Lesson with tutor: ${tutor} already exist`);
         const lu = await lesson.save();
         console.log("lesson saved");

         const newLesson = await Category.findOneAndUpdate(
            { category: "tutor" },
            { $push: { lessons: lu._id } },
            { useFindAndModify: false, new: true }
         );
         console.log("tutor category updated");

         const newSub = await User.findOneAndUpdate(
            { name: tutor },
            { $push: { lessons: lu._id } },
            { useFindAndModify: false, new: true }
         );

         const newLesson2 = await Tutor.findOneAndUpdate(
            { name: tutor },
            { $push: { lessons: lu._id } },
            { useFindAndModify: false, new: true }
         );

         console.log("tutor alredy exist");

         res.status(200).json({
            status: true,
            message: "Lesson saved",
         });
      } catch (error) {
         res.status(500).send(error.stack);
         console.log(error);
      }
   }

   static async getAll(req, res) {
      try {
         Lesson.find({})
            .exec()
            .then((docs) => {
               res.status(200).json(docs);
            })
            .catch((err) => console.log(`Oops! ${err}`));
      } catch (err) {
         console.log(err.stack);
      }
   }

   static async getLessonById(req, res, next) {
      try {
         Lesson.find({ _id: req.params.id })
            .exec()
            .then((docs) => {
               res.status(200).json(docs);
            })
            .catch((err) => console.log(`Oops! ${err}`));
      } catch (err) {
         console.log(err.stack);
      }
   }

   static async updateLessonById(req, res) {
      let { subject, tutor, level } = req.body;
      try {
         Lesson.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: { subject, tutor, level } },
            { useFindAndModify: false, new: true }
         ).then((docs) => res.status(200).json({
            message: "Lesson updated successfully ",
            docs
         }))
            .catch((err) => console.log(`Oops! ${err.stack}`));
      } catch (err) {
         console.log(err.stack);
      }
   }

   static async deleteLessonById(req, res) {
      try {
         const deleted = await Lesson.findByIdAndDelete({ _id: req.params.id });
         if (!deleted) return res.send(`invalid Lesson ID`);
         console.log("item deleted", deleted);

         await Category.findOneAndUpdate(
            { category: "tutor" },
            { $pull: { lessons: deleted._id } },
            { useFindAndModify: false, new: true }
         );
         await User.findOneAndUpdate(
            { name: deleted.tutor },
            { $pull: { lessons: deleted._id } },
            { useFindAndModify: false, new: true }
         );

         await Tutor.findOneAndUpdate(
            { name: deleted.tutor },
            { $pull: { lessons: deleted._id } },
            { useFindAndModify: false, new: true }
         );


         res.status(200).json({
            status: true,
            message: `${deleted.subject} lesson by ${deleted.tutor} deleted`,
         })




      } catch (err) {
         console.log(err.stack);
      }
   }
};
