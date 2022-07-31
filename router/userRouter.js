const Router = require('express')
const userController = require('../controllers/userController')
const authMiddlware = require('../middlware/authMiddlware')
const router = new Router()

router.get('', authMiddlware, userController.get)
router.put('', authMiddlware ,userController.put)
router.delete('', authMiddlware, userController.delete)

module.exports = router