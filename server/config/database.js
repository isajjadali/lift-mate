import dotenv from 'dotenv'
dotenv.config();

// const dbLogger = require('../lib/logger').child({
//     type: 'database',
// });

const config = {
    username: process.env.SQL_DATABASE_USERNAME,
    password: process.env.SQL_DATABASE_PASSWORD,
    database: process.env.SQL_DATABASE_DATABASE,
    host: process.env.SQL_DATABASE_HOST,
    dialect: 'mysql',
    define: {
        timestamps: true,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
    },
    migrationStorageTableName: 'sequelize_meta',
    logging: false,
    // logging: (message) => dbLogger.debug(message),
};

export default config;
