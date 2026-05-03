const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  birthDate: { type: DataTypes.DATEONLY },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  province: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  profilePictureUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '' 
  }
});

module.exports = Profile;