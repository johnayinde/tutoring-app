const User = require('../models/user');
const Subject = require('../models/subject');
const Category = require('../models/category');
const Lesson = require('../models/lesson');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//error display function
let errorCount = 0;
const error = (res) => {
	//check for errors
	console.log(errorCount, 'counts');
	if (errorCount > 0) {
		res.status(400).send({
			status: false,
			message: "Something is wrong: check manual and fill all form fields."
		});
		errorCount = 0;
		return;

	}
};

let admin = {
	subject: {
		create: (req, res, next) => {


			//taking parameters
			const name = (!req.body.name) ? errorCount++ : req.body.name;
			const schoolCategory = (!req.body.category) ? errorCount++ : req.body.category;
			const paramsCategory = req.params.category;

			{
				//check if the category exists
				Category.findOne({ name: schoolCategory }).then(category => {
					if (!category) {
						return res.status(400)
							.send({
								status: false,
								message: 'This category does not exist'
							});
					} else {




						//check if the new subject already exist
						Subject.findOne({ name })
							.then(subject => {
								if (subject) {

									if (subject.schoolCategory = schoolCategory) {
										return res.status(423)
											.send({
												status: false,
												message: name + ' already exists in ' + schoolCategory + '.'
											});
									} else {
										// save the subject
										let subject = new Subject({ name, schoolCategory });
										return subject.save()
											.then(() => res.status(200).send({
												status: true,
												message: name + ' created successfully in ' + schoolCategory
											})
											).catch(err => {
												console.log(err);
												res.status(400)
													.send({
														status: false,
														message: '' + err
													});
											});
									};
								}

							})
					}
				})
			}
		},
		update: async (req, res, next) => {
			//taking parameters
			const _id = req.params.subject_id;
			const name = req.body.name;
			const schoolCategory = req.body.category;
			const paramsCategory = req.params.category;
			try {
				//check if subject exists then read
				let subject = await Subject.findById(_id)

				if (!subject) {
					res.status(400)
						.send({
							status: false,
							message: _id + ' does not exist in the database. '
						})
				}
				{
					//receive update parameters
					subject.name = (name == '' || !name) ? subject.name : name;
					subject.schoolCategory = (schoolCategory == '' || !schoolCategory) ? subject.schoolCategory : schoolCategory;

					//save the update
					await subject.save()
					// if(error) {
					//     console.log(2);
					//     throw new Error()
					// } 
					res.status(200)
						.send({
							status: true,
							message: 'Update successful',
							subject
						})
				}
			} catch (error) {
				res.status(400)
					.send({
						status: false,
						message: 'Something went wrong, check the manual.'
					})
			}


		},

		delete: async (req, res, next) => {
			//taking parameters
			const _id = req.params.subject_id;
			const paramsCategory = req.params.category;
			try {
				//check if subject exists then read
				let subject = await Subject.findById(_id)
				if (!subject) {
					res.status(400)
						.send({
							status: false,
							message: _id + ' does not exist in the database. '
						})
				}
				{
					//delete subject
					await Subject.deleteOne({ _id: subject._id })
					// if(error){
					//     throw new Error()
					res.status(200)
						.send({
							status: true,
							message: subject.name + ' in ' + subject.schoolCategory +
								' category has been deleted successfully.'
						})
				}
			} catch (error) {
				res.status(400)
					.send({
						status: false,
						message: 'Something went wrong, check the manual.'
					})
			}
		},

	},

	category: {
		create: (req, res) => {
			//input variables
			const name = !(req.body.name) ? errorCount++ : req.body.name;

			//show error, if error
			error(res);

			Category.findOne({ name })
				.then(category => {
					if (category) {
						return res.status(423)
							.send({
								status: false,
								message: 'This category already exist.'
							});
					} else {
						let category = new Category({ name });
						return category.save()
							.then(res.status(200).send({
								status: true,
								message: name + ' category created successfuly.'
							}));
					}
				}).catch(err => {
					if (err) {
						console.log(err);
						res.status(400).send({
							status: false,
							message: '' + err
						});
					}
				});
		},
		update: async (req, res, next) => {
			//taking parameters
			const name = req.body.name;
			const _id = req.params.category_id;

			try {
				//check if category exists then read
				let category = await Category.findById(_id)

				if (!category) {
					res.status(400)
						.send({
							status: false,
							message: _id + ' does not exist in the database. '
						})
				}
				{
					//receive update parameters
					category.name = (name == '' || !name) ? category.name : name;


					//save the update
					await category.save()
					// if(error) {
					//     console.log(2);
					//     throw new Error()
					// } 
					res.status(200)
						.send({
							status: true,
							message: 'Update successful',
							category
						})
				}
			} catch (error) {
				res.status(400)
					.send({
						status: false,
						message: 'Something went wrong, check the manual.'
					})
			}
		},
		delete: async (req, res, next) => {
			//taking parameters
			const _id = req.params.category_id;
			const paramsCategory = req.params.category;
			try {
				//check if subject exists then read
				let category = await Category.findById(_id)
				if (!category) {
					res.status(400)
						.send({
							status: false,
							message: _id + ' does not exist in the database. '
						})
				}
				{
					//delete subject
					await Category.deleteOne({ _id: category._id })
					// if(error){
					//     throw new Error()
					res.status(200)
						.send({
							status: true,
							message: category.name + ' category has been deleted successfully.'
						})
				}
			} catch (error) {
				res.status(400)
					.send({
						status: false,
						message: 'Something went wrong, check the manual.'
					})
			}
		}
	},

	lesson: {
		create: async (req, res, next) => {

		},
		update: async (req, res, next) => {

		},
		delete: async (req, res, next) => {

		},
		get: async (req, res, next) => {

		},
		getAll: async (req, res, next) => {

		},
	},
	tutor: {
		update: async (req, res, next) => {

		},
		get: async (req, res, next) => {

		},
		getAll: async (req, res, next) => {

		},
	}
}



module.exports = admin;