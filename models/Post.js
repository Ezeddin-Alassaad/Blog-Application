const mongoose=require('mongoose')
const Joi=require('joi')

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        minlength:2,
        maxlength:200
    },
    description:{
        type:String,
        trim:true,
        required:true,
        minlength:2,
        maxlength:200
    },
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:Object,
        default:{
            url:"",
            publicId:null
        }
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},
{timestamps:true,
toJSON:{ virtuals:true },
toObject:{ virtuals:true }
}
)
// populate comment for this post
postSchema.virtual("comments",{
    ref:"comment",
    foreignField:"postId",
    localField:"_id"
})
const Post=mongoose.model('Post',postSchema)

function validateCreatePost(obj){
    const schema=Joi.object({
        title: Joi.string().trim().min(2).max(200).required(),
        description: Joi.string().trim().min(2).required(),
        category: Joi.string().trim().required(),
    })
    return schema.validate(obj)
}

function validateUpdatePost(obj){
    const schema=Joi.object({
        title: Joi.string().trim().min(2).max(200),
        description: Joi.string().trim().min(2),
        category: Joi.string().trim(),
    })
    return schema.validate(obj)
}

module.exports={
    Post,
    validateCreatePost,
    validateUpdatePost
}