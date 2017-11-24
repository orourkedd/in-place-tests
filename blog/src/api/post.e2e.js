const { send } = require("effects-as-data-server");
const cmds = require("../cmds");
const utils = require("../test-utils");
const assert = require("assert");

const { test } = utils;

const listE2E = test("[GET] /api/posts should get a list of posts", function*({
  testId
}) {
  const content = yield cmds.guid();
  const post = { content, test: testId };
  yield utils.post("/api/posts", post);
  const list = yield utils.get(`/api/posts?testId=${testId}`);
  assert(list.some(p => p.content === content), "Did not find post");
});

const createE2E = test("[POST] /api/posts should create a post", function*({
  testId
}) {
  const content = yield cmds.guid();
  const post = { content, test: testId };
  const { _id } = yield utils.post("/api/posts", post);
  const createdPost = yield utils.get(`/api/posts/${_id}`);
  assert.equal(createdPost._id, _id);
  assert.equal(createdPost.content, content);
});

const readE2E = test("[GET] /api/posts/:id should get a post", function*({
  testId
}) {
  const content = yield cmds.guid();
  const post = { content, test: testId };
  const { _id } = yield utils.post("/api/posts", post);
  const createdPost = yield utils.get(`/api/posts/${_id}`);
  assert.equal(createdPost._id, _id);
  assert.equal(createdPost.content, content);
});

const updateE2E = test("[PUT] /api/posts/:id should update a post", function*({
  testId
}) {
  const content = yield cmds.guid();
  const post = { content, test: testId };
  const { _id } = yield utils.post("/api/posts", post);
  const createdPost = yield utils.get(`/api/posts/${_id}`);
  assert.equal(_id, createdPost._id);
  assert.equal(createdPost.content, content);
  const updatedContent = `${content}-updated`;
  yield utils.put(`/api/posts/${_id}`, { content: updatedContent });
  const updatedPost = yield utils.get(`/api/posts/${_id}`);
  assert.equal(updatedPost.content, updatedContent);
});

const removeE2E = test("[DELETE] /api/posts/:id should remove a post", function*({
  testId
}) {
  const content = yield cmds.guid();
  const post = { content, test: testId };
  const { _id } = yield utils.post("/api/posts", post);
  const createdPost = yield utils.get(`/api/posts/${_id}`);
  assert.equal(createdPost._id, _id);
  yield utils.remove(`/api/posts/${_id}`);
  try {
    yield utils.get(`/api/posts/${_id}`);
  } catch (e) {
    assert.equal(e.message, "Not Found");
    return;
  }
  assert.fail(`/api/posts/${_id} should have resulted in a 404`);
});

module.exports = {
  listE2E,
  createE2E,
  readE2E,
  updateE2E,
  removeE2E
};
