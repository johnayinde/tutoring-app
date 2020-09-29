const bodyParser = require("body-parser"),
    morgan = require("morgan");

module.exports = function (app) {
    app.use(morgan("dev"));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // handle any CORS error

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers',
            'Origin,X-Requested-With, Content-Type, Accept,Authorization');
        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Headers',
                'PUT, DELETE,POST,GET,PATCH')
            return res.status(200).json({})
        }
        next()
    })
}