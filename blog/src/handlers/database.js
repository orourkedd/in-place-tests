const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

const url = process.env.MONGO;

const connection = new Promise((resolve, reject) => {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      reject(err);
    } else {
      resolve(db);
    }
  });
});

module.exports = function databaseHandler(cmd) {
  return connection.then(db => {
    switch (cmd.operation) {
      case "list":
        return db
          .collection(cmd.collection)
          .find(cmd.payload || {})
          .toArray();

      case "create":
        return db
          .collection(cmd.collection)
          .insertOne(cmd.payload)
          .then(({ insertedId }) => {
            return { ...cmd.payload, _id: insertedId };
          });

      case "get":
        return db.collection(cmd.collection).findOne(ObjectId(cmd.payload));

      case "update":
        const doc = { ...cmd.payload.doc };
        delete doc._id;
        return db.collection(cmd.collection).updateOne(
          { _id: ObjectId(cmd.payload._id) },
          {
            $set: doc
          }
        );

      case "remove":
        return db
          .collection(cmd.collection)
          .remove({ _id: ObjectId(cmd.payload) });

      case "cleanup":
        return db.collection(cmd.collection).remove({ test: cmd.payload });
    }
  });
};
