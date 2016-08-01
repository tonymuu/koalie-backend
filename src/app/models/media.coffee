# load the libs
mongoose = require 'mongoose'
ObjectId = mongoose.Schema.Types.ObjectId

# define Schema
mediaSchema = mongoose.Schema(
  media:
    user_id: # this will refer to the users model's ObjectId?
      type: ObjectId
      ref: 'User'
    stored_path:
      type: String
      default: ""
    likes:
      type: Number
      default: 0)

module.exports = mongoose.model('Media', mediaSchema)
