(function() {
  var ObjectId, mediaSchema, mongoose;

  mongoose = require('mongoose');

  ObjectId = mongoose.Schema.Types.ObjectId;

  mediaSchema = mongoose.Schema({
    user_id: {
      type: ObjectId,
      ref: 'User'
    },
    event_id: {
      type: ObjectId,
      ref: 'Event'
    },
    stored_path: {
      type: String,
      "default": ""
    },
    likes: {
      type: Number,
      "default": 0
    }
  });

  module.exports = mongoose.model('Media', mediaSchema);

}).call(this);
