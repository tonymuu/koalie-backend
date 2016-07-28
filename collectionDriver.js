// (function() {
//   var ObjectID;
//
//   ObjectID = require('mongodb').ObjectID;
//
//   module.exports = this.CollectionDriver = (function() {
//     var getCollection;
//
//     function CollectionDriver(db) {
//       CollectionDriver.db = db;
//     }
//
//     getCollection = function(collectionName, callback) {
//       return CollectionDriver.db.collection(collectionName, function(error, the_collection) {
//         if (error != null) {
//           return callback(error);
//         } else {
//           return callback(null, the_collection);
//         }
//       });
//     };
//
//     CollectionDriver.prototype.findAll = function(collectionName, callback) {
//       return getCollection(collectionName, function(error, the_collection) {
//         if (error) {
//           return callback(error);
//         } else {
//           return the_collection.find().toArray(function(error, results) {
//             if (error) {
//               return callback(error);
//             } else {
//               return callback(null, results);
//             }
//           });
//         }
//       });
//     };
//
//     CollectionDriver.prototype.get = function(collectionName, id, callback) {
//       return getCollection(collectionName, function(error, the_collection) {
//         var checkForHexRegExp;
//         if (error) {
//           return callback(error);
//         } else {
//           checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
//           if (!checkForHexRegExp.test(id)) {
//             return callback({
//               error: "invalid id"
//             });
//           } else {
//             return the_collection.findOne({
//               '_id': ObjectID(id)
//             }, function(error, doc) {
//               if (error) {
//                 return callback(error);
//               } else {
//                 return callback(null, doc);
//               }
//             });
//           }
//         }
//       });
//     };
//
//     CollectionDriver.prototype.save = function(collectionName, obj, callback) {
//       return getCollection(collectionName, function(error, the_collection) {
//         if (error) {
//           return callback(error);
//         } else {
//           obj.created_at = new Date();
//           return the_collection.insert(obj, function() {
//             return callback(null, obj);
//           });
//         }
//       });
//     };
//
//     CollectionDriver.prototype.update = function(collectionName, obj, id, callback) {
//       return getCollection(collectionName, function(error, the_collection) {
//         if (error != null) {
//           return callback(error);
//         } else {
//           obj._id = ObjectID(id);
//           obj.updated_at = new Date();
//           return the_collection.save(obj, function(error, doc) {
//             if (error != null) {
//               return callback(error);
//             } else {
//               return callback(null, obj);
//             }
//           });
//         }
//       });
//     };
//
//     CollectionDriver.prototype["delete"] = function(collectionName, id, callback) {
//       return getCollection(collectionName, function(error, the_collection) {
//         if (error != null) {
//           return callback(error);
//         } else {
//           return the_collection.remove({
//             '_id': ObjectID(id)
//           }, function(error, doc) {
//             if (typeof error === "function" ? error(callback(error)) : void 0) {
//
//             } else {
//               return callback(null, doc);
//             }
//           });
//         }
//       });
//     };
//
//     return CollectionDriver;
//
//   })();
//
// }).call(this);
