const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
    if (req.file === undefined) return res.send("you must select a file.");
    const imgUrl = `http://localhost:2000/file/${req.file.filename}`;
    return res.send(imgUrl);
});



router.get("/test",(req,res)=>{
    console.log("hello here")
})

module.exports = router;