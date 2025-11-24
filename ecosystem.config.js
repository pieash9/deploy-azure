module.exports = {
  apps: [
    {
      name: 'nextjs-azure',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        PORT: process.env.PORT || 8080,
        NODE_ENV: 'production'
      }
    }
  ]
};
