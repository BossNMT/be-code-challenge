// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'be-code-challenge',
      script: 'dist/main.js',
      autorestart: true,
    },
  ],
};
