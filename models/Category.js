const mongoose=require('mongoose')
const Joi=require('joi')

const categorySchema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    }
},
{timestamps:true }
)

const category =mongoose.model("category",categorySchema)

// Validate Create Category
function validateCreateCategory(obj){
    const schema=Joi.object({
        title: Joi.string().trim().required().label('Title')
    })
    return schema.validate(obj)
}
module.exports={
category,
validateCreateCategory
}