const { model, Schema } = require("mongoose");

const User = require("./Users");

const roomSchema = new Schema({
  users: [String],
  url: String,
  playing: Boolean,
  vidTime: String,
  volume: String
});

module.exports = model("Room", roomSchema);
