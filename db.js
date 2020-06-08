const mongoose = require("mongoose");

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
     useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("Database connected");
    // app.listen(3000);
  })
  .catch((err) => console.log(err));
