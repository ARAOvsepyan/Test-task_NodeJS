const jwt = require('jsonwebtoken')
const { validationResult } = require("express-validator");
const ApiError = require("../error/ApiError");
const { User, Tag } = require('../models/model')

class UserController {
    async get(req, res) {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        const users = await User.findByPk(
            decoded.uid,
            {attributes: ['email', 'nickname']},
            {
                include:
                [{
                    model: Tag
                }]
            })
        return res.json(users)
    }

    async put(req, res) {
        const data = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json(errors)
        }

        return res.json(data)
    }

    async delete(req, res) {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        await User.destroy({where: {uid: decoded.uid}})
        res.cookie('jwt', ' ', {maxAge: 1})

        return res.status(200)
    }
}

module.exports = new UserController()