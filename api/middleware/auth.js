const User = require("../models/user");
const jwt = require("jsonwebtoken");
const debug = require('debug')('app:auth');

const auth = async (req, res, next) => {
  try {

    const token = await req.header('x-auth-token');
    debug("token", token)
    if (!token) return res.status(401).send("Access denied. No token provided");


    const data = jwt.verify(token, process.env.JWT_KEY);
    debug("data", data)


    const user = await User.findById({ _id: data._id });
    debug("user", user)

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