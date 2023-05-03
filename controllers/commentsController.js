const asyncHandler=require('express-async-handler')
const path=require('path')
const fs=require('fs')
const bcrypt=require('bcryptjs')
const { validateCreateComment,comment,validateUpdateComment } = require('../models/Comment')
const { User } = require('../models/User')


/**
 * @desc Creat New Comment
 * route /api/comments
 * method POST
 * access Private(Only logged in user)
 */

module.exports.createCommentCtrl=asyncHandler(async(req,res)=>{
    const { error }=validateCreateComment(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    const profile=await User.findById(req.user.id)

    const newComment=await comment.create({
        postId:req.body.postId,
        text:req.body.text,
        user:req.user.id,
        username:profile.username
    })
    res.status(201).json(newComment)
})

/**
 * @desc Get All Comments
 * route /api/comments
 * method GET
 * access Private(Only Admin)
 */

module.exports.getAllCommentsCtrl=asyncHandler(async(req,res)=>{
const comments=await comment.find().populate('user')
res.status(200).json(comments)
})


/**
 * @desc Delete Comment
 * route /api/comments
 * method DELETE
 * access Private(Only Admin Or Owner of the comment)
 */

module.exports.deleteCommentCtrl=asyncHandler(async(req,res)=>{
    const delComment=await comment.findById(req.params.id)
    if(!delComment){
        return res.status(400).json({message:"Comment Not Found"})
    } 
    if(req.user.isAdmin|| req.user.id===delcomment.user.toString()){
        await comment.findByIdAndDelete(req.params.id)
            res.status(200).json({message:"Comment has been deleted"})
    }
    else{
        res.status(403).json({message:"Access denied,Not allowed"})

    }
})


/**
 * @desc Update Comment
 * route /api/comments/:id
 * method PUT
 * access Private(Only logged in user)
 */

module.exports.updateCommentCtrl=asyncHandler(async(req,res)=>{
    const { error }=validateUpdateComment(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    const commentFind=await comment.findById(req.params.id)
    if(!commentFind){
        return res.status(404).json({message:"Comment not found"})
    } 

    if(req.user.id!==commentFind.user.toString())
    {
        return res.status(403).json({message:"Access denied,Only user himself can edit his comment"})
    }
    const updateComment=await comment.findByIdAndUpdate(req.params.id,{
        $set:{
            text:req.body.text
        }
    },{new:true})
    res.status(200).json(updateComment)
})
