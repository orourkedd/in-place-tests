const { send } = require("effects-as-data-server");
const cmds = require("../cmds");
const utils = require("../test-utils");

function* all() {
  const index = [
    "/api/e2e/posts/list",
    "/api/e2e/posts/create",
    "/api/e2e/posts/read",
    "/api/e2e/posts/update",
    "/api/e2e/posts/remove"
  ];

  // Execute tests
  const results = yield index.map(utils.get);
  const testIds = results.map(r => r.testId);

  // Clean up
  yield testIds.map(id => cmds.call(cleanUp, id));

  return send(results);
}

function* cleanUp(testId) {
  yield cmds.cleanupTestPosts(testId);
}

function* validate() {
  console.log("Validating Service");
  const { body: results } = yield cmds.call(all);
  results.forEach(r =>
    console.log(r.success ? "SUCCESS" : "FAIL   ", r.message)
  );
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    // Do better logging in production
    console.error(failures);
    process.exit(1);
  }
  return send(results);
}

module.exports = {
  all,
  validate
};
