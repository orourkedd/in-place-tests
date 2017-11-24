const { send } = require("effects-as-data-server");
const cmds = require("./cmds");

function* getLocal(url) {
  const { PORT } = yield cmds.env();
  return yield cmds.httpGet(`http://localhost:${PORT}${url}`);
}

function get(path) {
  return cmds.call(getLocal, path);
}

function* postLocal(path, body) {
  const { PORT } = yield cmds.env();
  return yield cmds.httpPost(`http://localhost:${PORT}${path}`, body);
}

function post(path, body) {
  return cmds.call(postLocal, path, body);
}

function* putLocal(path, body) {
  const { PORT } = yield cmds.env();
  return yield cmds.httpPut(`http://localhost:${PORT}${path}`, body);
}

function put(path, body) {
  return cmds.call(putLocal, path, body);
}

function* removeLocal(path, body) {
  const { PORT } = yield cmds.env();
  return yield cmds.httpDelete(`http://localhost:${PORT}${path}`, body);
}

function remove(path, body) {
  return cmds.call(removeLocal, path, body);
}

function test(message, fn) {
  return function*() {
    const testId = yield cmds.guid();
    try {
      yield cmds.call(fn, { testId });
      return send({ success: true, testId, message });
    } catch (e) {
      return send({
        success: false,
        testId,
        message,
        error: {
          message: e.message,
          stack: e.stack,
          name: e.name
        }
      });
    }
  };
}

module.exports = {
  getLocal,
  get,
  postLocal,
  post,
  putLocal,
  put,
  removeLocal,
  remove,
  test
};
