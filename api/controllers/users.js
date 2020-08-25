const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const debug = require('debug')('app:userController');
const chalk = require("chalk");


class userController {
  static async signup(req, res, next) {
    let { name, password, email, category } = req.body;
    // category = category.toUpperCase();
    try {
      if (!name || !password || !email) {
        return res.status(400).send("All fields are required");
      }
      const exist = await User.findOne({ email });
      if (exist) {
        return res.status(400).send(`Email: ${email} is already registered`);
      }
      const user = new User(req.body)

      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;

      user.category = user.category.toLowerCase();

      const token = await user.generateToken();
      user.token = token;
      await user.save();

      debug(chalk.blue(user))

      res.status(200).send({
        status: "success",
        data: {
          message: `${email} registered successfully`,
          _id: user._id,
          name: user.name,
          category: user.category,
          isAdmin: user.isAdmin,
          subjects: user.subjects,
          lessons: user.lessons
        },
      });
    } catch (error) {
      debug(chalk.red(error))

      return res.status(500).json(error);
    }
  }

  static async signin(req, res, next) {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).send("All fields are required");
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).send(`user with email ${email} not found `);
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res.status(401).send("invalid Password, please try again");
      }

      const token = await user.generateToken();
      user.token = token;

      res.header("x-auth-token", token).status(200).send({
        message: "User successfully logedIn",
        token: token,
      });

      debug(chalk.blue(token))

    } catch (error) {
      debug(chalk.red(error))

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
      if (!req.user) return res.status(401).send("Error!! you need to Login");

      if (req.user.category === "tutor") {
        debug("req.user ID", req.user._id)
        const user = await User.findByIdAndUpdate(req.user._id, { $set: { isAdmin: true } }, { useFindAndModify: false, new: true });

        debug("updated user", user)

        res.status(200).send({
          message: `congrats ${user.email} now an admin`,
          isAdmin: user.isAdmin,
        })
        debug("isAdmin", user.isAdmin)
      } else {
        res.status(401).send("Access Denied, you have to become a tutor first");
      }
    } catch (error) {
      console.log(error);
    }
  }

}

module.exports = userController;
