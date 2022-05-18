const userRoute = require("../api/routes/users"),
	categoryRoute = require("../api/routes/category"),
	subjectRoute = require("../api/routes/subject"),
	lessonRoute = require("../api/routes/lesson"),
	tutorRoute = require("../api/routes/tutor");

module.exports = function (app) {
	app.use("/api/v1/", userRoute);
	app.use("/api/v1/category", categoryRoute);
	app.use("/api/v1/subject", subjectRoute);
	app.use("/api/v1/lesson", lessonRoute);
	app.use("/api/v1/tutor", tutorRoute);

	app.get("/", (req, res, next) => {
		res.send("Wellcome to my online tutoring App");
	});
};
