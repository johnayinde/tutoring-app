const User = require("../models/user");
const jwt = require("jsonwebtoken");

const admin = async (req, res, next) => {
   try {
      if (req.user.isAdmin === true) {
         next()

      } else {
         return res.status(401).send("Not Authorised");
      }

   } catch (error) {
      console.log(error);
   }
};

module.exports = admin;