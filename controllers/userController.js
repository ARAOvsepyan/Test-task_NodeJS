const jwt = require('jsonwebtoken')
const ApiError = require("../error/ApiError");
const { User, Tag } = require('../models/model')
const bcrypt = require('bcrypt')


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

    async put(req, res, next) {
        const info = req.body
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        let new_user_data = {}

        if (info.email) {
            const user = await User.findAll({
                where: {email: info.email}
            })
            if (user.length > 0) {
                return next(ApiError.forbidden('Пользователь с таким email уже существует'))
            }

            new_user_data['email'] = info.email
        }

        if (info.password) {
            const password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/

            if (info.password.match(password)) {
                new_user_data['password'] = await bcrypt.hash(info.password, 5)
            } else {
                return next(ApiError.forbidden('Пароль должен быть больше 8 символов и содержать как минимум одну заглавную букву, одну строчную букву и одну цифру.'))
            }
        } 

        if (info.nickname) {
            const user = await User.findAll({
                where: {nickname: info.nickname}
            })
            if (user.length > 0) {
                return next(ApiError.forbidden('Пользователь с таким ником уже существует'))
            }

            new_user_data['nickname'] = info.nickname
        }
        
        await User.update({
            email: new_user_data.email,
            password: new_user_data.password,
            nickname: new_user_data.nickname
        },{
            where: {uid: decoded.uid}
        })

        return res.status(200).json({'success': true})
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