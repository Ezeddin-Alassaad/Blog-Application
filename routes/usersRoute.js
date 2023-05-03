const router=require('express').Router()

const { getAllUsers, getUserById, updateUserProfileCtrl, getUsersCount, profilePhotoUploadCtrl, deleteUserProfileCtrl } = require('../controllers/usersController')
const photoUpload = require('../middlewares/photoUpload')
const validateObjectId = require('../middlewares/validateObjectId')
const {  verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyToken, verifyTokenAndAuthorization } = require('../middlewares/verifyToken')

// /api/users/profile
router.route('/profile').get(verifyTokenAndAdmin,getAllUsers)
router.route('/count').get(verifyTokenAndAdmin,getUsersCount)
router.route('/profile/:id')
.get(validateObjectId,getUserById)
.put(validateObjectId,verifyTokenAndOnlyUser,updateUserProfileCtrl)
.delete(validateObjectId,verifyTokenAndAuthorization,deleteUserProfileCtrl)

router.route('/profile/profile-photo-upload')
.post(verifyToken,photoUpload.single('image'),profilePhotoUploadCtrl)

module.exports=router