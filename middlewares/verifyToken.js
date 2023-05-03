const jwt  = require("jsonwebtoken");

function verifyToken(req,res,next){
    const authToken=req.headers.authorization

    if(authToken){
        const token=authToken.split(' ')[1]
        try {
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            req.user=decoded
            next()
        } catch (error) {
            return res.status(401).json({message:"Invalid token, access denied"})
        }
    }
    else{
    return res.status(401).json({message:"No token provided, access denied"})
    }
}
// Verify Token & Admin
function verifyTokenAndAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(!req.user.isAdmin){
            return res.status(403).json({message:"Not allowed, Only admin"})
        }
        else{ next() }    
    })
}

// Verify Token & Only User himself
function verifyTokenAndOnlyUser(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id){ next() }
        else{
            return res.status(403).json({message:"Not allowed, Only user himself"})
        }
    })
}

// Verify Token & Authorization
function verifyTokenAndAuthorization(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id||req.user.isAdmin){ next() }
        else{
            return res.status(403).json({message:"Not allowed,Admin Or Only user himself"})
        }
    })
}
module.exports={
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyToken,
    verifyTokenAndAuthorization
}

