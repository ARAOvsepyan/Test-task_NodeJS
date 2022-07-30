const Router = require('express')
const userTagController = require('../controllers/userTagController')
const router = new Router()

router.post('', userTagController.post)
router.delete('/:id', userTagController.delete)
router.get('/my', userTagController.get)

module.exports = router