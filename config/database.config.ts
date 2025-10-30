import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    type: process.env.DB_TYPE || '',
    host: process.env.DATABASE_HOSTNAME || '',
    port: process.env.DATABASE_PORT || 3306,
    username: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PWD || '',
    database: process.env.DATABASE_DBNAME || '',
}));