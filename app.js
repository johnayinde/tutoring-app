const express = require("express");
const app = express();

require("dotenv").config();
require("./startup/db");

require("./startup/middleware")(app);
require("./startup/routes")(app);
require("./startup/error")(app);

app.listen(2000);