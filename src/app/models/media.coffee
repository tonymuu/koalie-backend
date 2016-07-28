# load the libs
mongoose = require 'mongoose'

# define Schema
mediaSchema = mongoose.Schema(
  media:
    user_id:
      type: String
      ref: 'User.facebook'
    location: String
    likes: Number)

module.exports = mongoose.model('Media', mediaSchema)
