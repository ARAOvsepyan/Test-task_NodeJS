const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError')
const { Tag, User_Tag, User } = require('../models/model')

class TagsController {
    async post(req, res, next) {
        try {
            const info = req.body
            
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
    
            const tag = await Tag.create({creatorUid: decoded.uid, name: info.name, sortOrder: info.sortOrder})

            return res.json({id: tag.id, name: tag.name, sortOrder: tag.sortOrder})
        } catch (error) {
            return next(ApiError.badRequest('This name is not unique'))
        }
    }

    async get_by_id(req, res, next) {
        try {
            const {id} = req.params

            const tag = await Tag.findOne({
                include: [{
                    model: User,
                    attributes: ['uid', 'nickname'],
                    as: 'creator'
                }],
                attributes: ['name', 'sortOrder'],
                where: {id: id}
            })

            return res.json(tag)
        } catch (error) {
            return next(ApiError.badRequest('Can not find tag'))
        }
    }

    async get(req, res) {
        // const token = req.headers.authorization.split(' ')[1]
        // const decoded = jwt.verify(token, process.env.SECRET_KEY)

        const data = req.query

        const page = data.page || 1
        const pageSize = data.pageSize || 10
        const offset = page * pageSize - pageSize

        if('sortByOrder' in data)
        {
            const tags = await Tag.findAndCountAll({ 
                attributes: ['name', 'sortOrder'],
                include: [{
                    model: User,
                    attributes: ['uid', 'nickname'],
                    as: 'creator'
                }],
                // where: {creator: decoded.uid},
                order: ['sortOrder'],
                limit: pageSize,
                offset: offset
            })


            return res.json({'data': tags.rows, 'meta': {page, pageSize, 'quantity': tags.count}})
        }
        
        if('sortByName' in data)
        {
            const tags = await Tag.findAndCountAll({ 
                attributes: ['name', 'sortOrder'],
                    include: [{
                        model: User,
                        attributes: ['nickname', 'uid'],
                    }],
                // where: {creator: decoded.uid},
                order: ['name'],
                limit: pageSize,
                offset: offset
            })

            return res.json({'data': tags.rows, 'meta': {page, pageSize, 'quantity': tags.count}})
        }

        if ('sortByOrder' in data && 'sortByName' in data) 
        {
            const tags = await Tag.findAndCountAll({ 
                attributes: ['name', 'sortOrder'],
                    include: [{
                        model: User,
                        attributes: ['nickname', 'uid'],
                        through: {
                            attributes: []
                        },
                    }],
                // where: {creator: decoded.uid},
                order: ['name'],
                order: ['sortOrder'],
                limit: pageSize,
                offset: offset
            })

            return res.json({'data': tags.rows, 'meta': {page, pageSize, 'quantity': tags.count}})
        }

        const tags = await Tag.findAndCountAll({ 
            attributes: ['name', 'sortOrder'],
                include: [{
                    model: User,
                    attributes: ['nickname', 'uid'],
                    through: {
                        attributes: []
                    },
                }],
            // where: {creator: decoded.uid},
            limit: pageSize,
            offset: offset
        })

        return res.json({'data': tags.rows, 'meta': {page, pageSize, 'quantity': tags.count}})
    }

    async put(req, res, next) {
        const {id} = req.params
        const data = req.body

        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        const tag = await Tag.findOne({where: {id}})

        if(tag.creatorUid === decoded.uid)
        {
            await Tag.update({name: data.name, sortOrder: data.sortOrder},{where: {id}})

            const updated_tag = await Tag.findOne({
                attributes: ['name', 'sortOrder'],
                include: [{
                    model: User,
                    attributes: ['uid', 'nickname'],
                    as: 'creator'
                }],
                where: {id: id}
            })

            return res.json(updated_tag)
        } else {
            return next(ApiError.unauthorized('Ошибка доступа'))
        }

        
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            const tag = await Tag.findOne({where: {id}})

            if(tag.creator === decoded.uid)
            {
                await Tag.destroy({where: {id}})

                return res.status(200).json()
            } else {
                return next(ApiError.unauthorized('Ошибка доступа'))
            }
        } catch (error) {
            return next(ApiError.badRequest('Такого тега не существует'))
        }
        
    }
}

module.exports = new TagsController()