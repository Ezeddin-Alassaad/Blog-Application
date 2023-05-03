const bcrypt=require('bcryptjs')
const asyncHandler=require('express-async-handler')

const jwt=require('jsonwebtoken')
const { User, validationRegisterUser, validationLoginUser }=require('../models/User')
/**-----------------------------------------------------------
 * @desc Register New User
 * @route /api/auth/register
 * method POST
 * access public
----------------------------------------------------------------*/
module.exports.registerUserCtrl=asyncHandler(async(req,res)=>{
    const {error}=validationRegisterUser(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    let user=await User.findOne({email:req.body.email})
    if(user){
        return res.status(409).send('User already exists')
    }
    const salt=await bcrypt.genSalt(10)
    const hashPassword=await bcrypt.hash(req.body.password,salt)
    user=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashPassword
    })
    await user.save()
    res.status(201).json({message:"You registered successfully, please log in"})
})

/**-----------------------------------------------------------
 * @desc Login User
 * @route /api/auth/login
 * method post
 * access public
----------------------------------------------------------------*/

module.exports.loginUserCtrl=asyncHandler(async(req,res)=>{
    const {error}=validationLoginUser(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    const user=await User.findOne({email:req.body.email})
    if(!user){ 
        return res.status(404).json({message:'User not found'})
    }
    const isPasswordCorrect=await bcrypt.compare(req.body.password,user.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message:'Invalid Credentials'})
    }
    const token=user.generateAuthToken()
    res.status(200).json({
        _id:user._id,
        isAdmin:user.isAdmin,
        profilePhoto:user.profilePhoto,
        token
    })
})