const { validationResult } = require("express-validator");
const { User } = require("../models/model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const ApiError = require("../error/ApiError");

const generateJWT = (uid, email, nickname) => {
    return jwt.sign(
        {uid, email, nickname},
        process.env.SECRET_KEY,
        {expiresIn: '30m'}
    )
}

class AuthController {
    async singin(req, res) {
        const {email, password, nickname} = req.body
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json(errors)
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email: email, password: hashPassword, nickname: nickname})
        const token = generateJWT(user.uid, user.email, user.nickname)
    
        res.status(200).json({token, 'expire': '1800'});
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }

        let compaerPassword = bcrypt.compareSync(password, user.password)
        if (!compaerPassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }

        const token = generateJWT(user.uid, user.email, user.nickname)
        return res.status(200).json({token,  'expire': '1800'})
    }
    
    async logout(req, res) {
        res.cookie('jwt', ' ', {maxAge: 1})
        return res.status(200)
    }
}

module.exports = new AuthController()