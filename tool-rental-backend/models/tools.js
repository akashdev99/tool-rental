var mongoose = require("mongoose");

var toolScheme = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   booked: Boolean,

});

module.exports = mongoose.model("Tools", toolScheme);