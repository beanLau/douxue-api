var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TypeSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Type', TypeSchema);