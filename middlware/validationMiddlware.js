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
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        },
        errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number",
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