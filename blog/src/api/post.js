const { send, notFound } = require("effects-as-data-server");
const cmds = require("../cmds");

function* list({ query }) {
  const posts = yield cmds.listPosts({
    test: query.testId ? query.testId : null
  });
  return send(posts);
}

function* create({ body }) {
  const result = yield cmds.createPost(body);
  return send(result);
}

function* read({ params }) {
  const post = yield cmds.getPost(params.id);
  if (!post) return notFound();
  return send(post);
}

function* update({ body, params }) {
  const result = yield cmds.updatePost({
    _id: params.id,
    doc: body
  });
  return send(result);
}

function* remove({ params }) {
  yield cmds.removePost(params.id);
  return send({ success: true });
}

module.exports = {
  list,
  create,
  read,
  update,
  remove
};
