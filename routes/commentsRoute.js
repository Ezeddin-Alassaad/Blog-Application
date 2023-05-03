const { createCommentCtrl, getAllCommentsCtrl, deleteCommentCtrl, updateCommentCtrl } = require('../controllers/commentsController')
const validateObjectId = require('../middlewares/validateObjectId')
const { verifyToken, verifyTokenAndAdmin } = require('../middlewares/verifyToken')

const router=require('express').Router()



router.route("/").post(verifyToken,createCommentCtrl)
router.route("/").get(verifyTokenAndAdmin,getAllCommentsCtrl)
router.route("/:id")
.delete(validateObjectId,verifyToken,deleteCommentCtrl)
.put(validateObjectId,verifyToken,updateCommentCtrl)



module.exports=router