import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  port: process.env.MYSQL_PORT,
  host: process.env.MYSQL_HOST,
  name: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  synchronize: process.env.MYSQL_SYNCHRONIZE,
}));
