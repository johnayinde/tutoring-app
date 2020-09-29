const debug = require('debug')('app:userController');
const Category = require("../models/category");


module.exports = class categoryController {
   static async createCategory(req, res, next) {
      const { category } = req.body;
      debug(category)
      if (!category) return res.status(404).send("name cannot be empty")
      try {

         const exist = await Category.findOne({ category });
         if (exist) return res.status(400).send("category Already Exist")

         const newCategory = new Category({ category });
         await newCategory.save()

         res.status(200).json({
            status: true,
            message: `One new category ${newCategory.category} saved`,
         })
      } catch (error) {
         res.status(500).send(error)
      }
   }

   static async getCategories(req, res, next) {
      try {
         const allCategory = await Category.find({});
         if (!allCategory || allCategory < 1) return res.send("No category")

         res.status(200).json({
            status: true,
            allCategory,
         })
      } catch (error) {
         res.status(500).send(error)
      }

   }

   static async populateCategories(req, res, next) {
      try {
         const models = 'students subjects tutors lesson';
         const populateCat = await Category.find({ category: 'tutor' })
            .populate(models);
         if (!populateCat || populateCat < 1) return res.send("No category")

         res.status(200).json({
            status: true,
            populateCat,
         })
      } catch (error) {
         res.status(500).send(error)
      }

   }


}
