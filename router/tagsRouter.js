const Router = require('express')
const authMiddlware = require('../middlware/authMiddlware')
const tagsControlle = require('../controllers/tagsController')
const router = new Router()

router.post('', authMiddlware, tagsControlle.post)
router.get('/:id', authMiddlware, tagsControlle.get_by_id)
router.get('', authMiddlware, tagsControlle.get)
router.put('/:id', authMiddlware, tagsControlle.put)
router.delete('/:id', authMiddlware, tagsControlle.delete)

module.exports = router
