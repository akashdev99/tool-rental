const express = require("express");

const router = express.Router();

//models
const Tools  = require("../models/tools");

router.get("/:id",(req,res)=>{
    let id = req.params.id;
    Tools.find({_id:id}).then((data)=>{
        res.status(200).json({
            success:true,
            data:data[0]
        })
    }).catch((err)=>{
        console.log(err)
            res.status(400).json({
                success:false,  
            }) 
    })
    

})


module.exports = router;