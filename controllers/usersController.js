const asyncHandler=require('express-async-handler')
const path=require('path')
const fs=require('fs')
const bcrypt=require('bcryptjs')
const {cloudinaryRemoveImage, cloudinaryUploadImage, cloudinaryRemoveMultipleImage}=require('../utils/cloudinary')
const { User, validationUpdateUser } = require('../models/User')
const { comment }=require('../models/Comment')
const { post}=require('../models/Post')
// access Private Only admin
module.exports.getAllUsers=asyncHandler(async(req,res)=>{
    
    const users=await User.find().select('-password')
    res.status(200).json(users)
})
/**
 * @desc Get User By Id
 * route /api/users/profile/:id
 * method GET
 * access Private
 */
module.exports.getUserById=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id).select('-password').populate("posts")
    if(!user){
        res.status(403).json({message:"User not found"})
    }
    res.status(200).json(user)
})

/**
 * @desc Update User By Id
 * route /api/users/profile/:id
 * method PUT
 * access Private (Only User Hiself)
 */
module.exports.updateUserProfileCtrl=asyncHandler(async(req,res)=>{
    const {error}=validationUpdateUser(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    if(req.body.password){
        const salt=await bcrypt.genSalt(10)
        req.body.password=await bcrypt.hash(req.body.password,salt)
    }
    const updatedUser=await User.findByIdAndUpdate(req.params.id,{
        $set:{
            username:req.body.username,
            password:req.body.password,
            bio:req.body.bio
        },new:true
    }).select('-password')
    res.status(200).json(updatedUser)
})

module.exports.getUsersCount=asyncHandler(async(req,res)=>{
    const users=await User.count()
    res.status(200).json(users)
})

/**
 * @desc Get User By Id
 * route /api/users/profile/:id
 * method GET
 * access Private
 */
module.exports.profilePhotoUploadCtrl=asyncHandler(async(req,res)=>{
    //console.log(req.file);
    if(!req.file){
        return res.status(400).json({message:"No file provided"})
    }
    const imagePath=path.join(__dirname,`../images/${req.file.filename}`)
    const result=await cloudinaryUploadImage(imagePath)
    console.log(result);

    const user=await User.findById(req.user.id)
    if(user.profilePhoto.publicId!==null){
        await cloudinaryRemoveImage(user.profilePhoto.publicId)
    }
    user.profilePhoto={
        url: result.secure_url,
        publicId: result.public_id
    }
    await user.save()


    res.status(200).json({message:"Your profile photo uploaded",
    profilePhoto:{  url: result.secure_url,
        publicId: result.public_id
    }
})
fs.unlinkSync(imagePath)
})


/**
 * @desc Delete User Profile (Account)
 * route /api/users/profile/:id
 * method DELETE
 * access Private (Admin or Only User Hiself)
 */

module.exports.deleteUserProfileCtrl=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id)
    if(!user){
        return res.status(403).json({message:"user not found"})
    }
    // get all posts from DB
    const posts=await post.find({ user:user._id }) 
    // get the public ids from the posts
    const publicIds=posts?.map((post)=>post.image)

    if(publicIds?.length>0){
        await cloudinaryRemoveMultipleImage(publicIds)
    }


    await cloudinaryRemoveImage(user.profilePhoto.publicId)
    await post.deleteMany({user:user._id})
    await comment.deleteMany({user:user._id})

    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({message:"Your Profile has been deleted"})
})
