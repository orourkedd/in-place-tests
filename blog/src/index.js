const { init, router } = require("effects-as-data-server");
const post = require("./api/post");
const postE2E = require("./api/post.e2e");
const e2e = require("./api/e2e");
const handlers = require("./handlers");
const fetch = require("isomorphic-fetch");

const routes = [
  // Post API
  router.get("/api/posts", post.list),
  router.post("/api/posts", post.create),
  router.get("/api/posts/:id", post.read),
  router.put("/api/posts/:id", post.update),
  router.delete("/api/posts/:id", post.remove),

  // Post E2E Tests
  router.get("/api/e2e/posts/list", postE2E.listE2E),
  router.get("/api/e2e/posts/create", postE2E.createE2E),
  router.get("/api/e2e/posts/read", postE2E.readE2E),
  router.get("/api/e2e/posts/update", postE2E.updateE2E),
  router.get("/api/e2e/posts/remove", postE2E.removeE2E),

  // Run all E2E tests
  router.get("/api/e2e", e2e.all),

  // Run all E2E tests, report and panic on failure.  This endpoint is used
  // for always on tests.  See the validateService() function below.
  router.get("/api/validate", e2e.validate)
];

const { start, stop } = init({
  port: process.env.PORT,
  routes,
  handlers
});

// Start the server
start().catch(console.error);

// Poll the validate service endpoint to continuously validate the service.  Ideally,
// this is code is run in another process or on another server.
function validateService() {
  fetch(`http://localhost:${process.env.PORT}/api/validate`);
}

// Wait 3 seconds for the service to initialize, then run tests.
setTimeout(validateService, 3000);

// Run tests every 1 minute
setInterval(validateService, 60 * 1000);
