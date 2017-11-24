const { cmds: universal } = require("effects-as-data-server");

function buildPostCmd(collection, operation) {
  return function(payload = {}) {
    return { type: "database", collection, operation, payload };
  };
}

function env() {
  return {
    type: "env"
  };
}

module.exports = {
  ...universal,
  listPosts: buildPostCmd("posts", "list"),
  createPost: buildPostCmd("posts", "create"),
  getPost: buildPostCmd("posts", "get"),
  updatePost: buildPostCmd("posts", "update"),
  removePost: buildPostCmd("posts", "remove"),
  cleanupTestPosts: buildPostCmd("posts", "cleanup"),
  env
};
