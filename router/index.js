const Router = require('express')
const router = new Router()
const authRouter = require('./authRouter')
const userRouter = require('./userRouter')
const tagsRouter = require('./tagsRouter')
const userTagsRouter = require('./userTagsRoute')

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/tag', tagsRouter)
router.use('/user/tag', userTagsRouter)

module.exports = router