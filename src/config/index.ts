import { SequelizeModuleOptions } from '@nestjs/sequelize';

// 数据库配置
export const database: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: process.env.DB_IP || '127.0.0.1',
  port: 3306,
  username: process.env.DB_USER_NAME || 'root',
  password: process.env.DB_PASSWORD || '123456789',
  database: process.env.DB_NAME || 'db_im_web',
  synchronize: true,
  define: {
    timestamps: true,
    underscored: true,
  },
};

// cos 配置
export const cosConfig = {
  SecretId: process.env.SECRET_ID || '',
  SecretKey: process.env.SECRET_KEY || '',
};

// cos 桶配置
export const cosBucketConfig = {
  Bucket: process.env.COS_BUCKET || '',
  Region: process.env.COS_REGION || '',
};
export const saltRounds = 8;
