var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = new Schema({
  isForceAuthorize: { type: Boolean, default: false } //小程序是否开启强制用户授权
});

module.exports = mongoose.model('Config', ConfigSchema);