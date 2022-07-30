const Router = require('express')
const { checkSchema } = require('express-validator')
const registrationSchema = require('../middlware/validationMiddlware')
const authController = require('../controllers/authController')
const authMiddlware = require('../middlware/authMiddlware')
const router = new Router()

router.post('/singin',checkSchema(registrationSchema) ,authController.singin)
router.post('/login', authController.login)
router.post('/logout',authMiddlware ,authController.logout)


module.exports = router