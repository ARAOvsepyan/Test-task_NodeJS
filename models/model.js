const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('user', {
    uid: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true},
    email: {type: DataTypes.STRING(100), unique: true, allowNull: false},
    password: {type: DataTypes.STRING(100), allowNull: false},
    nickname: {type: DataTypes.STRING(30), unique: true, allowNull: false}
})

const Tag = sequelize.define('tag', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    // creator: {type: DataTypes.UUID},
    name: {type: DataTypes.STRING(40), unique: true, allowNull: false},
    sortOrder: {type: DataTypes.INTEGER, defaultValue: 0}
})

const User_Tag = sequelize.define('user_tag', {}, {timestamps: false})

User.hasMany(User_Tag)
User_Tag.belongsTo(User)

Tag.hasMany(User_Tag)
User_Tag.belongsTo(Tag)

User.hasOne(Tag)
Tag.belongsTo(User, {
    foreignKey: {
        name: 'creatorUid',
        allowNull: false
    },
    as: 'creator'
})

module.exports = {User, Tag, User_Tag}