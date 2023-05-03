const joi= require('joi')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:true,
        minlength:2,
        maxlength:100
    },
    email:{
        type:String,
        trim:true,
        required:true,
        minlength:5,
        maxlength:100
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:8,
        maxlength: 70
    },
    profilePhoto:{
        type:Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
            publicId:null
        }
    },
    bio:{ type:String },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isAcountVerified:{
        type:Boolean,
        default:false
    }
},
    { timestamps:true,
      toJSON:{ virtuals:true },
      toObject:{virtuals:true}
    }
)
userSchema.virtual("posts",{
    ref:"Post",
    foreignField:"user",
    localField: "_id"
})

userSchema.methods.generateAuthToken=function(){
    return jwt.sign({isAdmin:this.isAdmin,id:this._id},process.env.JWT_SECRET,{expiresIn:'1h' } )
}
const User=mongoose.model("User",userSchema)

function validationRegisterUser(obj){
    const schema=joi.object({
        username: joi.string().trim().min(2).max(100).required(),
        email: joi.string().trim().min(5).max(100).required().email(),
        password:joi.string().trim().min(8).required(),
        // confirmPassword: joi.string().trim().valid(joi.ref('password')).required()
    })
    return schema.validate(obj)
}

function validationLoginUser(obj){
    const schema=joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
        password:joi.string().trim().min(8).required(),
        // confirmPassword: joi.string().trim().valid(joi.ref('password')).required()
    })
    return schema.validate(obj)
}

function validationUpdateUser(obj){
    const schema=joi.object({
        username:joi.string().min(2).max(100),
        password:joi.string().trim().min(8),
        bio:joi.string()
        // confirmPassword: joi.string().trim().valid(joi.ref('password')).required()
    })
    return schema.validate(obj)
}
module.exports={
    User,
    validationRegisterUser,
    validationLoginUser,
    validationUpdateUser
}