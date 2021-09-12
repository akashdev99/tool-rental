const express     = require("express");
const app         = express();
const  bodyParser  = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config();

//models
const Tools  = require("./models/tools");
const users  = require("./models/users");

//routes
const home = require("./routes/home");
const connection = require("./db"); 

//middleware

const auth = require("./middleware/auth")

//routing
app.use("/file", home);

//db instatiate
let gfs;
connection();
const conn = mongoose.connection;
conn.once("open", ()=> {
    gfs = new mongoose.mongo.GridFSBucket(conn.db,{
        bucketName:"photos"
    });
});


app.use(bodyParser.json())

// https://www.freecodecamp.org/news/gridfs-making-file-uploading-to-mongodb/

// https://dev.to/jahangeer/how-to-upload-and-store-images-in-mongodb-database-c3f

app.get("/file/:filename", (req, res) => {
    // try {
        const file = req.params.filename
        
        const files = gfs.find({filename:file}).toArray((err,files)=>{
            console.log(files)
            if(!files[0] || files.length===0){
                return res.status(200).json(
                    {
                        success:false,
                        message: 'No files available'
                    }
                )
            }
            if(files[0].contentType==="image/jpeg"||
            files[0].contentType==="image/png"||
            files[0].contentType==="image/svg+xml"){
                gfs.openDownloadStreamByName(file).pipe(res);
            }else{
                res.status(404).json({
                    err:'NOt an image'
                })
            }
        })

});



//INDEX - show all campgrounds
app.get("/upload/tools",auth, function(req, res){
    // Get all campgrounds from DB
    let newTools = {
        name: "Hammer",
        image: "https://media.istockphoto.com/photos/photo-of-a-hammer-on-a-blank-white-background-picture-id182223857",
        description: "Gotta say , its a good hammmer BOyyy",
        booked: false,
        
     }
    Tools.create(newTools, function(err){
       if(err){
           console.log(err);
       } else {
          console.log("success");
          res.status(200).json({
              success:'true'
          })
       }
    });
});


app.get("/list/tools", function(req, res){
    // Get all campgrounds from DB

    Tools.find({}, function(err,tools){
       if(err){
           console.log(err);
       } else {
          res.json({data:tools})
       }
    });
});

app.post("/register",function(req,res)
    {
        const user = {
            username:req.body.username,
            password:req.body.password,
            address:req.body.address,
            number:req.body.number
        } 
        users.find({username:req.body.username}).then((data)=>{
            if(data.length!=0){

                res.status(200).json({
                    success:false,
                    message:"User Already exists"
                })
            }else{
                users.create(user).then((data)=>{
                    res.status(200).json({
                        success:true,
                        message:"You are registered :))"
                    })
                }).catch((err)=>{
                    res.status(500).json({
                        success:false,
                        message:"Something went wring :(("
                    })
                })
            }
        })
        
    });

    app.post("/login",function(req,res)
    {
        const user = {
            username:req.body.username,
            password:req.body.password,
        } 
        
        users.find({username:req.body.username}).then((data)=>{
            if(data.length!=0){
                if(data[0].password==req.body.password){
                    
                    const token = jwt.sign(
                        { user_id: data[0].username, email:data[0].email },
                        process.env.TOKEN,
                        {
                          expiresIn: "2h",
                        }
                      );

                    res.status(200).json(
                        {
                            success:true,
                            message:"Login Successful",
                            token:token
                        }
                    )
                }
                else{
                    res.status(401).json(
                        {
                            success:false,
                            message:"Wrong password"
                        }
                    )
                }
                
            }else{
                res.status(401).json(
                    {
                        success:false,
                        message:"Username does not exist , please register"
                    }
                )
            }
        })
        
    });


app.listen(process.env.API_PORT, ()=>{
    
   console.log("The server has started on ");
});
