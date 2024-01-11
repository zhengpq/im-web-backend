module.exports = {
  apps: [
    {
      name: 'im',
      script: './dist/main.js',
      env_production: {
        NODE_ENV: 'production',
        SECRET_ID: process.env.SECRET_ID,
        SECRET_KEY: process.env.SECRET_KEY,
        DB_NAME: process.env.DB_NAME,
        DB_USER_NAME: process.env.DB_USER_NAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        COS_BUCKET: process.env.COS_BUCKET,
        COS_REGION: process.env.COS_REGION,
      },
    },
  ],
};
