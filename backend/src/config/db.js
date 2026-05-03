const { Sequelize } = require('sequelize');

const isTestEnv = process.env.NODE_ENV === 'test';

const sequelize = isTestEnv
  ? new Sequelize('sqlite::memory:', { logging: false })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: 3306,
        logging: false,
        dialectOptions: {
          allowPublicKeyRetrieval: true
        }
      }
    );

module.exports = sequelize;