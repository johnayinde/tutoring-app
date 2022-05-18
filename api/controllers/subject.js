const User = require("../models/user");
const debug = require("debug")("app:userController");
const Category = require("../models/category");
const Subject = require("../models/subject");

class subjectController {
	static async getSubjectByCategoryById(req, res, next) {
		/**
   get subjectId (params)
   get the category name(params)
   find doc from Subject with the provided params
   */

		const category = req.params.category;
		const id = req.params.id;
		debug(category, id);
		if (!category || !id) return res.status(404).send("fields cannot be empty");
		try {
			const subject = await Subject.findOne({ _id: id, category });
			if (!subject) return res.status(404).send("Invalid category/id");

			res.status(200).json({
				status: true,
				subject,
			});
		} catch (error) {
			res.status(500).send(error);
		}
	}

	static async getAllSubjectByCategory(req, res, next) {
		/**
   get the category name(params)
   find doc from Subject with the provided params
   */
		const category = req.params.category;
		debug(category);
		if (!category) return res.status(404).send("field cannot be empty");
		try {
			const subject = await Subject.find({ category }).select("-tutors");
			if (!subject || subject < 1)
				return res.send(`No subject  found for ${category}`);

			res.status(200).json({
				status: true,
				subject,
			});
		} catch (error) {
			res.status(500).send(error);
		}
	}

	static async getAll(req, res) {
		try {
			Subject.find({})
				.select("_id subject category tutors")
				.exec()
				.then((docs) => {
					if (!docs || docs < 1)
						return res.status(423).send("No subjects found");

					res.status(200).json({
						status: true,
						docs,
					});
				})
				.catch((err) => {
					res.status(500).send(err);
					console.log(`Oops! ${err.stack}`);
				});
		} catch (error) {
			res.status(500).send(error);
		}
	}

	static async getAllCategories(req, res) {
		try {
			const allCat = await Subject.find(
				{},
				{ _id: 0, category: 1, subject: 1 }
			);

			if (!allCat || allCat < 1)
				return res.status(400).send("No categories to display");

			res.status(200).json({
				status: true,
				allCat,
			});
		} catch (error) {
			res.status(500).send(error);
		}
	}
	static async getAllTutorByCategory(req, res) {
		/**
          /:category/:subject
         get the category name and subject name
         find by category and subject in Subject collection
         populate the tutors fields
       */
		try {
			const allTuts = await Subject.find({
				category: req.params.category,
				subject: req.body.subject,
			}).populate("tutors");

			if (!allTuts || allTuts < 1)
				return res.status(400).send("No tutors for given category/subject");

			res.status(200).json({
				status: true,
				allTuts,
			});
		} catch (error) {
			res.status(500).send(error);
		}
	}

	static async postSubjectByCategory(req, res, next) {
		/**
		 * - provide subject from body and category by params
		 * - check if subject exist in the category throw (error)
		 *   else create subject (success)
		 * add new subjectID to Category collection( students and tutor) by their category  name (push)
		 */
		try {
			const category = req.params.category;
			let subject = req.body.subject;
			if (!category || !subject)
				return res.status(400).send("field cannot be empty");

			subject = subject.toLowerCase();
			console.log(subject.toLowerCase());
			const sub = new Subject({ subject, category });
			const exist = await Subject.exists({ subject, category });
			if (exist) return res.status(400).send("Subject Already exist");

			await sub.save();
			debug("created subject", sub);

			const studentCategory = await Category.findOneAndUpdate(
				{ category: "student" },
				{ $push: { subjects: sub._id } },
				{ useFindAndModify: false, new: true }
			);

			const tutorCategory = await Category.findOneAndUpdate(
				{ category: "tutor" },
				{ $push: { subjects: sub._id } },
				{ useFindAndModify: false, new: true }
			);
			debug(studentCategory, tutorCategory);

			res.status(200).json({
				status: "success",
				message: `Subject created successfully ${subject}`,
			});
		} catch (error) {
			res.status(500).send(error);
		}
	}

	static async registerSubjectByCategory(req, res, next) {
		/**
     * Tutor want to register a subject
       * - provide subject from body and category by params
        -check if subject exist in the category (error;)
         - update user with provided subject
         else 
         create subject (success)
        add new subjectID to Category collection( students and tutor) and user by their category  name (push)
       */
		const category = req.params.category;
		const subject = req.body.subject;
		if (!category || !subject)
			return res.status(400).send("field cannot be empty");

		try {
			const sub = new Subject({ subject, category });
			const exist = await Subject.exists({ subject, category });

			if (exist) {
				const findSub = await User.findOne({
					_id: req.user._id,
					subjects: subject,
				});

				if (findSub)
					return res.status(400).send(`You already registered for ${subject}`);

				const newSub = await User.findByIdAndUpdate(
					{ _id: req.user._id },
					{ $push: { subjects: subject } },
					{ useFindAndModify: false, new: true }
				);
				res.status(200).send({
					status: true,
					message: `${subject} registered successfully`,
				});
				return;
			}
			await sub.save();
			debug("created subject", sub);

			const studentCategory = await Category.findOneAndUpdate(
				{ category: "student" },
				{ $push: { subjects: sub._id } },
				{ useFindAndModify: false, new: true }
			);

			const tutorCategory = await Category.findOneAndUpdate(
				{ category: "tutor" },
				{ $push: { subjects: sub._id } },
				{ useFindAndModify: false, new: true }
			);

			const newSub = await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ $push: { subjects: subject } },
				{ useFindAndModify: false, new: true }
			);
			debug(studentCategory, tutorCategory, newSub);

			res.status(200).json({
				status: "success",
				message: `Subject created and registered successfully ${subject}`,
			});
		} catch (error) {
			res.status(500).json(error);
		}
	}

	static async getRegisteredSubject(req, res) {
		const userSub = await User.findById({ _id: req.user._id }).select(
			"subjects"
		);
		if (!userSub || userSub < 1)
			return res.status(400).send("No subject avalable");

		res.status(200).json({
			status: "success",
			userSub,
		});
	}

	static async updateSubjectByCategoryById(req, res, next) {
		/**
		 * - get newSubject(body) and old subjectID  category (params)
		 * - findAndupdate subject by oldId and category
		 */
		const id = req.params.id;
		const subject = req.body.subject;
		if (!subject || !id) return res.status(400).send("field cannot be empty");
		const sub = await Subject.findByIdAndUpdate(
			id,
			{ $set: { subject } },
			{ useFindAndModify: false, new: true }
		);

		debug("updated subject", sub);
		res.status(200).json({
			status: "success",
			message: `Subject updated successfully ${subject}`,
		});
	}

	static async deleteSubjectByCategoryById(req, res, next) {
		/**
		 * - get subjectID (params)
		 * - findAnddelete subject by oldId
		 * - query student and tutor field in Category (sub docs)
		 *  and delete $pull subject doc by subjectId
		 */
		const id = req.params.id;
		if (!id) return res.status(400).send("field cannot be empty");

		try {
			const subDoc = await Subject.findByIdAndRemove(id);
			if (!subDoc) return res.status(500).send("invalid subject ID");
			debug(" subject deleted", subDoc);
			console.log("deleted from Sub", subDoc);

			const studentCategory = await Category.findOneAndUpdate(
				{ category: "student" },
				{ $pull: { subjects: id } },
				{ useFindAndModify: false, new: true }
			);

			const tutorCategory = await Category.findOneAndUpdate(
				{ category: "tutor" },
				{ $pull: { subjects: id } },
				{ useFindAndModify: false, new: true }
			);
			console.log("embeded docs deleted");
			console.log(studentCategory, tutorCategory);

			res.status(200).json({
				status: "success",
				message: `Subject deleted successfully `,
			});
		} catch (error) {
			res.status(500).send(error);
			console.log(error);
		}
	}

	static async deleteRegisteredSubject(req, res, next) {
		const { subject } = req.body;

		try {
			if (!subject) return res.status(400).send("subject field is required");

			const exist = await Subject.findOne({
				category: req.params.category,
				subject,
			});
			if (!exist) return res.status(400).send("Not found / Invaid credentials");

			const subDoc = await Subject.findOneAndDelete(
				{ category: req.params.category, subject },
				{ subject }
			);
			console.log("deleted from Subject", subDoc);

			const tutorDoc = await User.findOneAndUpdate(
				{ _id: req.user._id },
				{ $pull: { subjects: subject } },
				{ useFindAndModify: false, new: true }
			);
			console.log("deleted from User");

			const stuCat = await Category.findOneAndUpdate(
				{ category: "student" },
				{ $pull: { subjects: subDoc._id } },
				{ useFindAndModify: false, new: true }
			);

			const tutCat = await Category.findOneAndUpdate(
				{ category: "tutor" },
				{ $pull: { subjects: subDoc._id } },
				{ useFindAndModify: false, new: true }
			);

			res.status(200).json(tutorDoc);
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	}

	static async searchSubjectByNameSorted(req, res, next) {
		/**
   get the subject name(params)
   find doc from Subject with the provided params
   */
		let subject = req.query.subject;

		debug(subject);
		if (!subject) return res.status(404).send("field cannot be empty");

		try {
			// console.log("exist", exist);

			const result = await Subject.find({
				subject: { $regex: "/" + subject + "/", $options: "i" },
			})
				.select("-tutors")
				.sort({ subject: 1 });
			console.log("sub result", result);

			if (!result || result <= 1) return res.status(400).send("no subject");
			res.status(200).json({
				status: true,
				subject,
			});
		} catch (error) {
			res.status(500).send(error);
			console.log(error);
		}
	}

	static async updateRegisteredSubject(req, res, next) {
		const { oldSubject, newSubject } = req.body;

		try {
			if (!newSubject) return res.status(400).send("field cannot be empty");

			const tutorDoc = await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ $pullAll: { subjects: oldSubject } },
				{ useFindAndModify: false, new: true }
			)
				.then((docs) => {
					newSubject.forEach((sub) => {
						docs.subjects.push(sub);
					});
					docs.save();
					console.log("new subjects", docs);
					res.status(200).json(docs);
				})
				.catch((error) => {
					console.log(error);
				});
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	}

	static async deleteCategory(req, res) {
		try {
			if (!req.params.category)
				return res.status(400).send("category name is required");

			const exist = await Subject.exists({ category: req.params.category });
			if (!exist) return res.status(400).send("Category does not exist");

			const deleted = await Subject.deleteMany({
				category: req.params.category,
			});
			if (!deleted) return res.status(500).send("error occured");

			console.log(deleted);

			res.status(200).json({
				status: true,
				message: `category ${req.params.category} deleted`,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	}

	static async updateCategory(req, res) {
		const { category } = req.body;
		if (!req.params.category || !category)
			return res.status(400).send("category name is required");

		try {
			const exist = await Subject.exists({ category: req.params.category });
			if (!exist) return res.status(400).send("Category does not exist");

			const updatedCat = await Subject.updateMany(
				{ category: req.params.category },
				{ $set: { category } },
				{ useFindAndModify: false, new: true }
			);
			if (!updatedCat) return res.status(500).send("error occured");

			res.status(200).json({
				status: true,
				message: `category ${req.params.category} updated`,
			});
		} catch (error) {
			res.status(500).send(error);
			console.log(error);
		}
	}
}

module.exports = subjectController;
