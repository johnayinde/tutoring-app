const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class userController {
  static async signup(req, res, next) {
    const { firstname, lastname, password, email } = req.body;

    try {
      const user = new User(req.body);

      if (!firstname || !lastname || !password || !email) {
        res.status(400).send("All fields are required");
      }

      const uniqueUser = await User.findOne({ email });
      if (uniqueUser) {
        res.status(400).send(`Email: ${email} is already registered`);
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      user.password = hashedPassword;

      const accessToken = jwt.sign(
        { email, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "48hr" }
      );
      user.token = accessToken;

      await user.save();

      res.status(200).send({
        status: "success",
        data: {
          message: `${email} registered successfully`,
          user,
        },
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async signin(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).send(`user with email ${email} not found `);
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        res.status(401).send("invalid Password, please try again");
      }

      const accessToken = await jwt.sign({
        email,
        id: user._id,
        role: user.role,
      });

      const result = await User.findByIdAndUpdate(
        { _id: user._id },
        { token: accessToken },
        { useFindAndModify: false, new: true }
      );

      return res.headers("x-auth-token", accessToken).status(201).send({
        message: "User successfully logedIn",
        _id: result._id,
        token: result.token,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static async becomeAdmin(req, res, next) {
    /**
     * check if req.user is false - you need to login
     * check if req.req.user.role is tutor - find by id and chang role to admin
     * else if already admiin -  already admin
     * else access deniedb
     */

    try {

      if (!req.user) {
        res.status(401).send("Error!! you need to Login");
      }

      if (req.user.role == "tutor") {
        const user = User.findByIdAndUpdate(req.user._id, { role: req.user.role }, { useFindAndModify: false, new: true });

        res.status(200).send({
          message: `congrats ${user.email} now an admin`,
          role: user.role,
        });

      } else if (req.user.role == "admin") {
        res.status(401).send("Error!! you are an Admin already");

      } else {
        res.status(401).send("Access Denied, you have to become a tutor first");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = userController;
