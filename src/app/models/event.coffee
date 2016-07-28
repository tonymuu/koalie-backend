mongoose = require 'mongoose'

eventSchema = mongoose.Schema(
  event:
    name: String,
    size: Number,
    date_create: Date,
    date_end: Date,
    member_ids: [Schema.Types.ObjectId],
    media_ids: [Schema.Types.ObjectId],
    )
