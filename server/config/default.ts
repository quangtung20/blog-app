import dotEnv from 'dotenv';
dotEnv.config();

export default {
    port: process.env.PORT,
    host: process.env.HOST,
    dbUri: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    dbName: process.env.DB_NAME,
}