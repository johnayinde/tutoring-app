const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {

    const token = await req.header('x-auth-token');
    if (!token) return res.status(401).send("Access denied. No token provided");

    const data = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById({ _id: data._id });

    if (!user) {
      return res.status(401).send("invalid token");
    } else {
      req.user = data;
      next();
    }

  } catch (error) {
    console.log(error);
  }
};

module.exports = auth