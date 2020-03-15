var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  openId: { type: String, required: true },
  nickName: { type: String, default: ""  },
  gender: { type: String, default: ""  },
  language: { type: String, default: ""  },
  city: { type: String, default: ""  },
  province: { type: String, default: ""  },
  country: { type: String, default: ""  },
  avatarUrl: { type: String, default: ""  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);