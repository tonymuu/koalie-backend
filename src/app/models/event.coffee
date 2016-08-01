mongoose = require 'mongoose'
ObjectId = mongoose.Schema.Types.ObjectId


eventSchema = mongoose.Schema(
  event:
    name: String
    size: Number
    date_create:
      type: Date
      defalt: Date.now
    date_end: Date
    member_ids: [
      type: ObjectId
      ref: 'User']
    media_ids: [
      type: ObjectId
      ref: 'Media']
    )
