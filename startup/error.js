
module.exports = function (app) {

    app.use((req, res, next) => {
        const error = new Error('Route Not Found');
        error.status = 404;
        next(error);
    })

    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.json({
            error: {
                message: error.message,
            }
        })
    })
}