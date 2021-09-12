var mongoose = require("mongoose");

var userScheme = new mongoose.Schema({
   username: String,
   password: String,
   address: String,
   number: Number,

});

module.exports = mongoose.model("Users", userScheme);