
const mongoose=require("mongoose")

module.exports=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}