import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: '192.168.1.149',
    port: 3306,
    username: 'root',
    password: 'P@ssw0rd',
    database: 'walashee',

    synchronize: true,
    logging: true,

    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/**/*{.ts,.js}'],
    migrationsTableName: "walashee_migrations"
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
