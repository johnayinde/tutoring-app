const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

require("dotenv").config();
require("./startup/db");

require("./startup/middleware")(app);
require("./startup/routes")(app);
require("./startup/error")(app);

app.listen(PORT);
