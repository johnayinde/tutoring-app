const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {

    const token = await req.headers.authorization.split(" ")[1] || await req.headers['x-access-token'];

    if (req.headers.authorization || req.headers["x-access-token"]) {

      const data = jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findOne({ token: token });

      if (!user) {
        throw new Error("no user object");

      } else {
        req.user = user;
        req.token = token;
        next()
      }
    }
  } catch (error) {
    console.log(error);
  }
};
