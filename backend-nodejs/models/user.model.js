const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    unique: true,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  interests: {
    type: String,
  },
});

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
