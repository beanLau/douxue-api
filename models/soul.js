var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SoulSchema = new Schema({
  content: { type: String, required: true },
  isTop: {type :Boolean,default: false},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Soul', SoulSchema);