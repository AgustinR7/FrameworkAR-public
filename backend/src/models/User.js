const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	role: {
		type: DataTypes.ENUM('user', 'admin'),
		defaultValue: 'user',
		allowNull: false
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		allowNull: false
	}
	}, {
	timestamps: true,
	hooks: {
		// Before creating the user, encrypt the password
		beforeCreate: async (user) => {
			if (user.password) {
				const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT) || 10);
				user.password = await bcrypt.hash(user.password, salt);
			}
		},
		// Before updating, if the password has changed, re-encrypt it
		beforeUpdate: async (user) => {
			if (user.changed('password')) {
				const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT) || 10);
				user.password = await bcrypt.hash(user.password, salt);
			}
		}
	}
});

module.exports = User;