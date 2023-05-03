const { createPostCtrl, GetAllPostsCtrl, GetSinglePostsCtrl, GetPostsCountCtrl, deletePostCtrl, updatePostCtrl, updatePostImageCtrl, toggleLikeCtrl } = require('../controllers/postsController')
const photoUpload = require('../middlewares/photoUpload')
const validateObjectId = require('../middlewares/validateObjectId')
const { verifyToken } = require('../middlewares/verifyToken')

const router=require('express').Router()

router.route('/').post(verifyToken,photoUpload.single('image'),createPostCtrl)
.get(GetAllPostsCtrl)

router.route('/count').get(GetPostsCountCtrl)

router.route('/:id').get(validateObjectId,GetSinglePostsCtrl)
.delete(validateObjectId,verifyToken,deletePostCtrl)
.put(validateObjectId,verifyToken,updatePostCtrl)

router.route('/upload-image/:id')
.put(validateObjectId,verifyToken,photoUpload.single('image'),updatePostImageCtrl)

// /api/posts/like/:id
router.route('/like/:id')
.put(validateObjectId,verifyToken,toggleLikeCtrl)
module.exports=router