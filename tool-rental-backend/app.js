var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    Tools  = require("./models/tools");
const mongoose = require("mongoose");
const home = require("./routes/home");
const connection = require("./db");
const Grid = require("gridfs-stream");    
app.use("/file", home);



let gfs;
connection();

const conn = mongoose.connection;
conn.once("open", ()=> {
    gfs = new mongoose.mongo.GridFSBucket(conn.db,{
        bucketName:"photos"
    });
});

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

    // } catch (error) {
    //     res.send("not found");
    // }
});


// app.get("/", function(req, res){
//     res.render("landing");
// });

//INDEX - show all campgrounds
app.get("/upload/tools", function(req, res){
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


//CREATE - add new campground to DB
// app.post("/campgrounds", function(req, res){
//     // get data from form and add to campgrounds array
//     var name = req.body.name;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var newCampground = {name: name, image: image, description: desc}
//     // Create a new campground and save to DB
//     Campground.create(newCampground, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             //redirect back to campgrounds page
//             res.redirect("/campgrounds");
//         }
//     });
// });

// //NEW - show form to create new campground
// app.get("/campgrounds/new", function(req, res){
//    res.render("campgrounds/new"); 
// });

// // SHOW - shows more info about one campground
// app.get("/campgrounds/:id", function(req, res){
//     //find the campground with provided ID
//     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(foundCampground)
//             //render show template with that campground
//             res.render("campgrounds/show", {campground: foundCampground});
//         }
//     });
// });


// // ====================
// // COMMENTS ROUTES
// // ====================

// app.get("/campgrounds/:id/comments/new", isLoggedIn  ,function(req, res){
//     // find campground by id
//     Campground.findById(req.params.id, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//              res.render("comments/new", {campground: campground});
//         }
//     })
// });

// app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
//    //lookup campground using ID
//    Campground.findById(req.params.id, function(err, campground){
//        if(err){
//            console.log(err);
//            res.redirect("/campgrounds");
//        } else {
//         Comment.create(req.body.comment, function(err, comment){
//            if(err){
//                console.log(err);
//            } else {
//                campground.comments.push(comment);
//                campground.save();
//                res.redirect('/campgrounds/' + campground._id);
//            }
//         });
//        }
//    });
//    //create new comment
//    //connect new comment to campground
//    //redirect campground show page
// });


// //AUTH ROUTES
// app.get("/register",function(req,res)
//     {
//          res.render("register");
//     });
// app.post("/register",function(req,res)
//     {
//        user.register(new user({
//             username:req.body.username
//             }),req.body.password,function(err,User)
//             {
//                 if(err)
//                    {
//                        res.redirect("/register")
                       
//                    }
//                 passport.authenticate("local")(req,res,function()
//                    {
//                      res.redirect("/campgrounds");   
//                    });
//             });
       
//     });
    
// //login
// app.get("/login",function(req,res)
//     {
//        res.render("login");  
//     });
// app.post("/login",passport.authenticate("local",{
//                              successRedirect:"/campgrounds",
//                              failureRedircet:"/login"
                             
//                   }),function(req,res)
//     { 
         
       
//     });
    
// //logout

// app.get("/logout",function(req,res)
//    { 
//       req.logout(); 
//       res.redirect("/campgrounds");
//    });
   
   
// function isLoggedIn(req,res,next)
//          {
//               if(req.isAuthenticated())
//                  { 
//                      return next();
//                  }
//               res.redirect("/login");
//          };



app.listen(2000 , ()=>{
    
   console.log("The server has started on ");
});
