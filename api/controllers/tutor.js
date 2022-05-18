const User = require("../models/user");
const Category = require("../models/category");
const Tutor = require("../models/tutor");
const Subject = require("../models/subject");

class tutorController {
	static async registerTutorAndSubject(req, res, next) {
		/**
		 * get input values {name class subjects[]}
		 * chect if tutor exist else save
		 * add tutor ID to a category of student
		 * add all subjects to tutors(User) subjects[]
		 * loop subjects and add to Subjects for the category if not exixt save
		 * add created subjectId to Category of student
		 */

		const { name, level, subject } = req.body;
		if (!name || !subject || !level)
			return res.status(400).send("field cannot be empty");

		try {
			const newTutor = new Tutor({ name, level, subject });
			const exist = await Tutor.findOne({ name });

			if (exist) return res.send(`Tutor with name: ${name} already exist`);

			const updatedCat = await Category.findOneAndUpdate(
				{ category: "student" },
				{ $push: { tutors: newTutor._id } },
				{ useFindAndModify: false, new: true }
			);
			console.log("saved to student cat");

			const updatedUser = await User.findOneAndUpdate(
				{ _id: req.user._id },
				{ $push: { subjects: subject } },
				{ useFindAndModify: false, new: true }
			);
			console.log("saved to user sub");

			for (let sub of subject) {
				console.log(subject);
				const subjectExist = await Subject.findOne({ subject: sub });

				if (!subjectExist) {
					const newSubject = new Subject({
						subject: sub,
						category: level,
						tutors: newTutor._id,
					});
					await newSubject.save();
					console.log("saved Subject", newSubject);

					const updateStu = await Category.findOneAndUpdate(
						{ category: "student" },
						{ $push: { subjects: newSubject._id } },
						{ useFindAndModify: false, new: true }
					);

					const updateTut = await Category.findOneAndUpdate(
						{ category: "tutor" },
						{ $push: { subjects: newSubject._id } },
						{ useFindAndModify: false, new: true }
					);
				}
				continue;
			}
			await newTutor.save();

			res.status(200).json({
				status: true,
				message: "Tutor saved",
				newTutor,
			});
		} catch (error) {
			res.status(500).send(error);
		}
	}

	static async getAllTutor_Subject(req, res, next) {
		/**
		 * only tutor can access it
		 * check if tutor exist from collection else errror
		 * if exist find by name and select subject;
		 */

		try {
			const exist = await Tutor.findOne({ name: req.user.name });
			if (!exist)
				return res.status(423).send("You have not registed to take a class");

			const allSubjects = await Tutor.findOne({ name: req.user.name }).select(
				"subject"
			);

			res.status(200).json({
				status: true,
				message: "All registered Subjects",
				allSubjects,
			});
		} catch (error) {
			console.log(error);
		}
	}

	static async getTutorById(req, res, next) {
		/**
		 * -get the tutor ID from req.params
		 * - query Tutor collection to findById
		 */
		const tutorId = req.params.id;

		const docs = await Tutor.findById(tutorId);
		if (!docs) return res.status(400).send("No tutor with provided ID");

		res.status(200).send(docs);
	}

	static async deleteTutorById(req, res, next) {
		/**
		 * -get the tutor ID from req.params
		 * - query Tutor collection to findById
		 */
		const tutorId = req.params.id;
		try {
			const docs = await Tutor.findByIdAndDelete(tutorId);
			if (!docs) return res.status(400).send("No tutor with provided ID");

			console.log("deleted", docs);

			const updatedUser = await User.findOneAndUpdate(
				{ _id: req.user._id },
				{ $pullAll: { subjects: docs.subject } },
				{ useFindAndModify: false, new: true }
			);
			console.log("user sub deleted", updatedUser);

			const updatedCat = await Category.findOneAndUpdate(
				{ category: "student" },
				{ $pull: { tutors: docs._id } },
				{ useFindAndModify: false, new: true }
			);
			console.log("deleted tut in cat");

			res.status(200).json({
				status: true,
				message: `${docs.name} deleted`,
			});
		} catch (error) {
			res.status(500).send(error);
		}
	}
	static async getAllTutors(req, res, next) {
		/**
		 * - query Tutor collection to find({}) all documents
		 */
		const docs = await Tutor.find({}).select("name");
		if (!docs) return res.status(400).send("empty field no tutors");

		res.status(200).send(docs);
	}
}

module.exports = tutorController;
