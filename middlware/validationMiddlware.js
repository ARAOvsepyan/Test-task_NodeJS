const { User } = require('../models/model');

const registrationSchema = {
    nickname: {
        custom: {
            options: async value => {
                const user = await User.findAll({
                    where: {nickname: value}
                });
                if (user.length > 0) {
                    return Promise.reject('Nickname already in use');
                }
            }
        }
    },
    password: {
        isStrongPassword: {
            minLength: 8,
            maxLength: 20,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        },
        errorMessage: "Пароль должен быть больше 8 символов и содержать как минимум одну заглавную букву, одну строчную букву и одну цифру.",
    },
    email: {
        normalizeEmail: true,
        custom: {
            options: async value => {
                const user = await User.findAll({
                    where: {email: value}
                });
                if (user.length > 0) {
                    return Promise.reject('Email address already taken');
                }
            }
        }
    }
}

module.exports = registrationSchema