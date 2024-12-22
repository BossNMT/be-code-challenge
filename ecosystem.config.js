// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'nestjs-app',
      script: 'dist/main.js',
      autorestart: true,
    },
  ],
};
