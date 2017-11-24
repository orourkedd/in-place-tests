const { join } = require("path");

module.exports = {
  apps: [
    {
      name: "Blog",
      script: "src/index.js",
      cwd: join(__dirname, "blog"),
      watch: true,
      ignore_watch: [/node_modules/],
      env: {
        PORT: 3100,
        NODE_ENV: "development",
        MONGO: "mongodb://localhost:27017/ipt_blog"
      }
    }
  ]
};
