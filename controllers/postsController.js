const fs=require('fs')
const path=require('path')
const asyncHandler=require('express-async-handler')
const { validateCreatePost, Post, validateUpdatePost}=require('../models/Post')
const { cloudinaryUploadImage,cloudinaryRemoveImage}=require('../utils/cloudinary')
const { comment }=require('../models/Comment')

/**
 * @desc Create New Post
 * route /api/posts
 * method POST
 * access Private (Only Logged in user)
 */
module.exports.createPostCtrl=asyncHandler(async(req,res)=>{
    if(!req.file){
        return res.status(404).json({message:"No image provided"})
    }
    const { error }=validateCreatePost(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    const imagePath=path.join(__dirname,`../images/${req.file.filename}`)
    const result=await cloudinaryUploadImage(imagePath)
    const post=await Post.create({
        title:req.body.title,
        description:req.body.description,
        category:req.body.category,
        user:req.user.id,
        image:{
            url:result.secure_url,
            publicId:result.public_id
        }
    })
    res.status(200).json(post)
    fs.unlinkSync(imagePath)
})


/**
 * @desc Get All Post
 * route /api/posts
 * method POST
 * access Private (Only Logged in user)
 */
module.exports.GetAllPostsCtrl=asyncHandler(async(req,res)=>{
    const POST_PER_PAGE=3
    const{ pageNumber,category }=req.query
    let posts
    if(pageNumber){
        posts=await Post.find()
        .skip((pageNumber-1)*POST_PER_PAGE)
        .limit(POST_PER_PAGE)
    }
    else if(category){
        posts=await Post.find({category})
    }
    else{
        posts=await Post.find().sort({createdAt:-1}) 
        // .populate("user",["-password"])
    }
    res.status(200).json(posts)
})
/**
 * Get Single Post
 */
module.exports.GetSinglePostsCtrl=asyncHandler(async(req,res)=>{
    const post=await Post.findById(req.params.id)
    .populate('user',["-password"])
    .populate('comments')
    if(!post){
        return res.status(404).json({message:'Post not found'})
    }
    res.status(200).json(post)
})
/**
 * Get Posts Count
 */
module.exports.GetPostsCountCtrl=asyncHandler(async(req,res)=>{
    const count=await Post.count()
    res.status(200).json(count)
})

/**
 * Delete Post
 */
module.exports.deletePostCtrl=asyncHandler(async(req,res)=>{
    const post=await Post.findById(req.params.id)
    if(!post){
        return res.status(404).json({message:'Post not found'})
    }

    // @TODO - Delete all comments that belong to this post
    await comment.deleteMany({ postId:post._id })
    
    if(req.user.isAdmin||req.user.id===post.user.toString()){
        await Post.findByIdAndDelete(req.params.id)
        await cloudinaryRemoveImage(post.image.publicId)
        res.status(200).json({message:"post has been deleted successfully",postId:post._id})
    }
    else{
        res.status(403).json({message:"access denied,forbidden"})
    }
})
/**
 * Get Posts Count
 */
module.exports.GetPostsCountCtrl=asyncHandler(async(req,res)=>{
    const count=await Post.count()
    res.status(200).json(count)
})
/**
 * @desc Update Post
 * @route /api/posts/:id
 * @methode PUT
 * @access private(Only owner of the post)
 */
module.exports.updatePostCtrl=asyncHandler(async(req,res)=>{
    // 1.Validation
    const { error }=validateUpdatePost(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message })
    }
    // 2.Get the post from the dataBase
    const post=await Post.findById(req.params.id)
    if(!post){
        return res.status(404).json({message:"post not found"})
    }
    // 3.Check if this post belong to logged in user
    if(req.user.id!== post.user.toString()){
        return res.status(403).json({message:'access denied, you are not allowed'})
    }
    // 4.Update Post
    const updatedPost=await Post.findByIdAndUpdate(req.params.id,{
        $set:{
            title:req.body.title,
            description:req.body.description,
            category:req.body.category
        }
    },{new: true}).populate('user',["-password"])
    // 5.Send response to the client
    res.status(200).json(updatedPost)
})

/**
 * @desc Update Post Image
 * @route /api/posts/upload-image/:id
 * @methode PUT
 * @access private(Only owner of the post)
 */
module.exports.updatePostImageCtrl=asyncHandler(async(req,res)=>{
    // 1.Validation
    if(!req.file){
        return res.status(400).json({message: "no image provided" })
    }
    // 2.Get the post from the dataBase
    const post=await Post.findById(req.params.id)
    if(!post){
        return res.status(404).json({message:"post not found"})
    }
    // 3.Check if this post belong to logged in user
    if(req.user.id!== post.user.toString()){
        return res.status(403).json({message:'access denied, you are not allowed'})
    }
    // 4.Update Post
    await cloudinaryRemoveImage(post.image.publicId)
    const imagePath=path.join(__dirname,`../images/${req.file.filename}`)
    const result=await cloudinaryUploadImage(imagePath)
    const updatedPost=await Post.findByIdAndUpdate(req.params.id,{
        $set:{
          image:{
            url:result.secure_url,
            publicId:result.public_id
          }
        }
    },{new: true})
    // 5.Send response to the client
    res.status(200).json(updatedPost)
    fs.unlinkSync(imagePath)
})

/**
 * @desc Toggle Like
 * @route /api/posts/like/:id
 * @methode PUT
 * @access private(Only logged in user)
 */
module.exports.toggleLikeCtrl=asyncHandler(async(req,res)=>{
    const loggedInUser=req.user.id
    const { id:postId}=req.params

    let post=await Post.findById(postId)
    if(!post){
        return res.status(404).json({message:"post not found"})
    }
    const isPostAleardyLiked=post.likes.find(
        (user) => user.toString() === loggedInUser)

    if(isPostAleardyLiked){
        post=await Post.findByIdAndUpdate(postId,{
            $pull:{
                likes:loggedInUser
            }
        },{new:true})
    }    
    
    else{
        post=await Post.findByIdAndUpdate(postId,{
            $push:{
                likes:loggedInUser
            }
        },{new:true})
    }    
    res.status(200).json(post)
})