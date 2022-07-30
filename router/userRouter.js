const Router = require('express')
const validationMiddlware = require('../middlware/validationMiddlware')
const { checkSchema } = require('express-validator')
const userController = require('../controllers/userController')
const authMiddlware = require('../middlware/authMiddlware')
const router = new Router()

router.get('', authMiddlware, userController.get)
router.put('', authMiddlware, checkSchema(validationMiddlware), userController.put)
router.delete('', authMiddlware, userController.delete)

module.exports = router