import { DataSource } from 'typeorm';
import config from './db.config';

export const dataSourceOptions = config;

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
