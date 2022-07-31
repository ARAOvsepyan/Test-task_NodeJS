const { User_Tag, Tag } = require("../models/model")
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken')


class userTagController {

    async post(req, res) {
        const {tags} = req.body
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        
        for (let i = 0; i < tags.length; i++) {
            try {
                await User_Tag.create({userUid: decoded.uid, tagId: tags[i]})
            } catch {
                return res.json(`Тега с id: ${tags[i]} не существует`)
            }
        }
        const tag = await Tag.findAll({where: {id: tags}, attributes: ['id', 'name', 'sortOrder']})
        return res.json({'tags': tag})
    }

    async delete(req, res) {
        const {id} = req.params

        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        await User_Tag.destroy({
            where: {
                [Op.and] : [
                    {tagId: id},
                    {userUid: decoded.uid}
                ]
            }
        })

        return res.status(200).json('Ok')
    }

    async get(req, res) {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        const tags = await User_Tag.findAll({where: {userUid: decoded.uid}})
        let arr = []
        for (let i = 0; i < tags.length; i++) {
            arr.push(tags[i].tagId)
        }

        const user_tag = await Tag.findAll({where: {id: arr}, attributes: ['id', 'name', 'sortOrder']})
        return res.json({'tags': user_tag})
    }
}

module.exports = new userTagController()