
const {Router} = require('express')
const pfpMulter = require('../middlewares/profileMulter')
const { register, sendOtp, verifyOtp, viewProfile, updateProfile, deleteProfile, admin_viewAllUsers } = require('../controllers/userController')
const { authenticate, authorize } = require('../middlewares/auths')
const userRoutes = Router()


userRoutes.route('/register').post(pfpMulter.single('pfp'),register)
userRoutes.route('/sendOtp').post(sendOtp)
userRoutes.route('/verifyOtp').post(verifyOtp)
userRoutes.route('/viewProfile/:uid')
                .get(authenticate,viewProfile)
                .put(authenticate,pfpMulter.single('pfp'),updateProfile)
                .delete(authenticate,deleteProfile)
userRoutes.route('/viewUsers').get(authenticate,authorize('admin'),admin_viewAllUsers)

module.exports = userRoutes