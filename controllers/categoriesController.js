const asyncHandler=require('express-async-handler')
const { category,validateCreateCategory}=require('../models/Category')

/**
 * @desc Create New Category
 * route /api/categories
 * method POST
 * access Private (Onlu Adim)
 */

module.exports.createCategoryCtrl=asyncHandler(async(req,res)=>{
    const { error }=validateCreateCategory(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message})
    }
    const newCategory=await category.create({
        title:req.body.title,
        user:req.user.id
    })
    res.status(201).json(newCategory)
})

/**
 * @desc Get All Category
 * route /api/categories
 * method GET
 * access Public
 */

module.exports.getAllCategoriesCtrl=asyncHandler(async(req,res)=>{
    const categories=await category.find()

    res.status(200).json(categories)
})

/**
 * @desc Delete Category
 * route /api/categories/:id
 * method DELETE
 * access Private(Only Admin)
 */

module.exports.deleteCategoryCtrl=asyncHandler(async(req,res)=>{
    const delCategory=await category.findById(req.params.id)
    if(!delCategory){
        return res.status(404).json({message:"category not found"})
    }
    await category.findByIdAndDelete(req.params.id)

    res.status(200).json({
        message:"category has been deleted successfully!",
        categoryId: delCategory._id
})
})