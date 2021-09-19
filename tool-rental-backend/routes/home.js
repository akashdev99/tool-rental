const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();

//models
const Tools  = require("../models/tools");

router.post("/upload", upload.single("file"), async (req, res) => {
    if (req.file === undefined) return res.send("you must select a file.");
    const imgUrl = process.env.FILE_UPLOAD_URL+req.file.filename;
    const {name , description , owner , booked } = req.body.data
    const body = JSON.parse(req.body.data)
    let newTools = 
         {image:imgUrl,...body}
     
    console.log(newTools)
    Tools.create(newTools, function(err){
       if(err){
        res.status(200).json({
            success:false,
            message:err
        })
       } else {
          console.log("success");
          res.status(200).json({
              success:true,
              message:"Tool added"
          })
       }
    });
    
});

module.exports = router;