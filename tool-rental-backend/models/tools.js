var mongoose = require("mongoose");

var toolScheme = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   booked: Boolean,
   owner:String,
   warranty:String,
   highlights:Object,
   specifications:Array,
   bookingdates:Array
});

module.exports = mongoose.model("Tools", toolScheme);
