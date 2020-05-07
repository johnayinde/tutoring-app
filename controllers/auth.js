const User = require('../models/user');
const Subject = require('../models/subject');
const Category = require('../models/category');
const Lesson = require('../models/lesson');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


let errorCount = 0;
let Person = {
    person: {
        register: (req, res, next) => {
            //user profile resources
            const firstName = !(req.body.firstName) ? errorCount++ : req.body.firstName;
            const lastName = !(req.body.lastName) ? errorCount++ : req.body.lastName;
            const userName = !(req.body.userName) ? errorCount++ : req.body.userName;
            const email = !(req.body.email) ? errorCount++ : req.body.email;
            const password = !(req.body.password) ? errorCount++ : req.body.password;
            const userCategory = !(req.body.userCategory) ? errorCount++ : req.body.userCategory;
            const subjects = req.body.subjects;
            const admin = 'false';
            const schoolCategory = req.body.schoolCategory;
            const assignedSubjects = req.body.assignedSubjects;


            //check for errors
            console.log(errorCount, 'counts');
            //show error status if error
            if (errorCount > 0) {
                res.status(400).send({
                    status: false,
                    message: "All fields are required"
                });
                errorCount = 0;
                return;

            }
            //save the user profile
            User.findOne({ userName })
                .then(user => {
                    if (user) {
                        return res.status(423)
                            .send({
                                status: false,
                                message: 'This username already exists.'
                            });
                    } else {

                        //hashes the password before saving
                        bcrypt.hash(password, 12)
                            .then(password => {
                                let user = new User({ firstName, lastName, userName, email, password, userCategory, admin, schoolCategory, subjects, assignedSubjects });
                                return user.save();
                            })
                            .then(() => res.status(200)
                                .send({
                                    status: true,
                                    message: userName + ' registered successfully.',
                                })
                            )
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(400)
                        .send({
                            status: false,
                            message: '' + err
                        });
                });
        },

        login: (req, res, next) => {
            const userName = !(req.body.userName) ? errorCount++ : req.body.userName;
            const password = !(req.body.password) ? errorCount++ : req.body.password;

            //check for errors
            console.log(errorCount, 'counts');
            //show error status if error
            if (errorCount > 0) {
                res.status(400).send({
                    status: false,
                    message: "All fields are required"
                });
                errorCount = 0;
                return;

            }

            //check for user in the database
            User.findOne({ userName })
                .then(user => {
                    if (!user) {
                        return res.status(404)
                            .send('User not found,check for errors or register.');
                    }
                    //check if the password is correct
                    bcrypt.compare(password, user.password)
                        .then(valid => {
                            if (!valid) {
                                return res.status(403)
                                    .send('Incorrect username or password');
                            }
                            //create token for further authorized actions
                            const token = jwt.sign({ _id: user._id }, "secretkey");
                            res.status(200)
                                .send({
                                    _id: user._id,
                                    fullname: user.firstName + ' ' + user.lastName,
                                    username: user.userName,
                                    Category: user.userCategory,
                                    SchoolLevel: user.schoolCategory,
                                    token: token
                                });
                        });
                }).catch(err => {
                    console.log(err);
                    res.status(400)
                        .send({
                            status: false,
                            message: '' + err
                        });
                });
        },
    },
    subject: {
        getAll: (req, res) => {
            const sort = req.body.sort;
            switch (sort) {
                case "name:1":
                    Subject.find({}).sort({ 'name': 1 })
                        .then(subject => {
                            res.status(200)
                                .send({
                                    message: 'Subjects sorted by name alphabetically in ascending order.',
                                    subject
                                });
                        })

                    break;

                case "name:-1":
                    Subject.find({}).sort({ 'name': 1 })
                        .then(subject => {
                            res.status(200)
                                .send({
                                    message: 'Subjects sorted by name alphabetically in descending order.',
                                    subject
                                });
                        })
                    break;

                case "category:1":
                    Subject.find({}).sort({ 'schoolCategory': 1 })
                        .then(subject => {
                            res.status(200)
                                .send({
                                    message: 'Subjects sorted by category alphabetically.',
                                    subject
                                });
                        })
                    break;


                default: Subject.find({})
                    .then(subject => {
                        res.status(200)
                            .json(subject);
                    })
                    break;
            };
        },
        get: async (req, res, next) => {
            const category = req.params.category;
            const _id = req.params.subject_id;
            try {
                let subject = await Subject.findById(_id)
                if (!subject) {
                    console.log(1, 'hi');
                    throw new Error()
                } else {
                    if (subject.schoolCategory !== category) {

                        throw new Error()
                    } else {
                        res.status(200)
                            .send({
                                message: subject.name + ' in ' + category + ' category.',
                                subject
                            })
                    }
                }





            } catch (error) {
                res.status(400).send({ error: 'Something went wrong, check the manual' })
            }
        }


    },
    category: {
        getAll: async (req, res, next) => {
            try {
                let category = await Category.find()
                if (!category) { throw new Error() }

                res.status(200)
                    .send({
                        message: 'All categories',
                        category
                    })
            } catch (error) {
                res.status(401).send({ error: 'Something went wrong. Check the manual' })
            }

        }
    },
    tutor: {
        getAll: (req, res) => {
            const sort = req.body.sort;
            switch (sort) {
                case "name:1":
                    User.find({ 'userCategory': 'tutor' }).sort({ 'name': 1 })
                        .then(user => {
                            res.status(200)
                                .send({
                                    message: 'User sorted by name alphabetically in ascending order.',
                                    user
                                });
                        })

                    break;

                default: User.find({ 'userCategory': 'tutor' })
                    .then(user => {
                        res.status(200)
                            .json(user);
                    })
                    break;
            };
        },
    },

}


module.exports = Person;

