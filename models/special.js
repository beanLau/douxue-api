var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpecialSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Special', SpecialSchema);