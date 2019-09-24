var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  pic: { type: String, default: "" },
  nickName: { type: String, default: "" },
  nickName: { type: String, default: ""  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);