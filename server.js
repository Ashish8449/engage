const express = require("express");

const { client } = require("./database-config/database");
const multer = require("multer");
const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage;
//const upload = multer({dest: __dirname + '/uploads'});
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const { PythonShell } = require("python-shell");
const app = express();
const fs = require("fs");
const path = require("path");
//let pyshell = new PythonShell("face.py", { mode: "json"});


let pyshell = new PythonShell("face.py", { mode: "json",pythonPath: process.env.PYTHON_PATH});

const initializePassport = require("./passport-config");
const req = require("express/lib/request");
const { range } = require("express/lib/request");
const { sql_helper } = require("./sql-helpers/sql-helper");
const { image } = require("./components/image");
const { user } = require("./components/user");
const { offender } = require("./components/offender");
const { victim } = require("./components/victim");
const { location } = require("./components/location");
const { offence } = require("./components/offence");
const { categories } = require("./components/category");
const { type } = require("express/lib/response");
const { charts } = require("./charts/charts");
pyshell.on("error", function (error) {
  console.log(error);
});
pyshell.on("stderr", function (stderr) {
  console.log(stderr);
});
pyshell.on("pythonError", function (pythonError) {
  console.log(pythonError);
});

const PORT = process.env.PORT || 3000;
//setting path for uploaded temporary files
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/uploads/temp");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});
const upload = multer({ storage: storage });
//setting path for temporary files uploaded to search
let storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/uploads/search");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});
const searchupload = multer({ storage: storage1 });



// const resolveBlobName = (req, file) => {
//   return new Promise((resolve, reject) => {
//       const blobName = yourCustomLogic(req, file);
//       resolve(blobName);
//   });
// };

// const resolveMetadata = (req, file) => {
//   return new Promise((resolve, reject) => {
//       const metadata = yourCustomLogic(req, file);
//       resolve(metadata);
//   });
// };

// const resolveContentSettings = (req, file) => {
//   return new Promise((resolve, reject)=> {
//       const contentSettings = yourCustomLogic(req, file);
//       resolve(contentSettings);
//   });
// };

const azureStorage = new MulterAzureStorage({
  connectionString: process.env.CONNECTION_STRING,
  accessKey: process.env.ACCESS_KEY,
  accountName: 'offace',
  containerName: 'uploads',
  //blobName: resolveBlobName,
  //metadata: resolveMetadata,
  //contentSettings: resolveContentSettings,
  containerAccessLevel: 'container',
  urlExpirationTime: 9999
});

const azureupload = multer({
  storage: azureStorage
});
//initializing Passport Authentication Middleware
initializePassport(passport);
client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
//setting paths to serve static files
app.use(express.static("views"));
app.use(express.static(path.join(__dirname, "/uploads/permanent")));
app.use(express.static(path.join(__dirname, "/uploads/temp")));
app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false,
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());
app.get("/", (req, res) => {
  return res.render("index.ejs");
});
app.get("/users/register", checkAuthenticated, (req, res) => {
  return res.render("register.ejs");
});
//showstats path and all the calculations required
app.get("/show_stats", checkNotAuthenticated, (req, res) => {
  charts.region_wise_offence_count(function (err,x1,y1) {
    
    if (err == undefined) {
     
      charts.victim_gender_wise_offence_count(function (err,x2,y2) {
      
        if (err == undefined) {
         
          charts.offender_gender_wise_offence_count(function (err,x3,y3) {
           
            if (err == undefined) {
              charts.victim_age_wise_offence_count(function (err,x4,y4) {
               
                if (err == undefined) {
                  charts.victim_gender_vs_offence_categories(function (err,x6,y6female,y6male,y6other) {
                    
                    if (err == undefined) {
                      charts.offender_gender_vs_offence_categories(function (err,x7,y7female,y7male,y7other) {
                       
                        if (err == undefined) {
                          charts.offender_age_wise_offence_category(function (err,x8,y18,y28,y38) {
                            if (err == undefined) {
                              charts.victim_age_wise_offence_category(function (err,x9,y19,y29,y39) {
                                if (err == undefined) {
                                  charts.offender_age_wise_offence_count(function (err,x5,y5) {
                                    if (err == undefined) {
                                
                                      return res.render("show_stats.ejs", { type: req.user.type,x1,y1,x2,y2,x3,y3,x4,y4,x6,y6female,y6male,y6other,x7,y7female,y7male,y7other,x8,y18,y28,y38,x9,y19,y29,y39,x5,y5});
                                    }
                                  });

                                }
                              });
                            }
                          });
                         
                          
                        }
                       
                      });
                      
                    }
                  });
            
                 
                }
              });
        
             
            }
          });
    
          
        }
      });


    }
  });


    

});
app.get("/users/super", checkAuthenticated, (req, res) => {
  return res.render("super.ejs");
});
app.get("/search", checkNotAuthenticated, (req, res) => {
  return res.render("search.ejs", { type: req.user.type });
});
//accept requests
app.get("/accept/:type/:uid", checkNotAuthenticated, (req, res) => {
  if (
    req.params.type == "user" ||
    req.params.type == "admin" ||
    req.params.type == "super"
  ) {
    sql_helper.accept_user(req.params.uid, function() {
      if (req.params.type == "user") {
        return res.redirect("/users/requests/user");
      } else if (req.params.type == "admin") {
        return res.redirect("/users/requests/admin");
      }
    });
   
  } else if (req.params.type == "offence") {
   
    sql_helper.accept_offence(req.params.uid, function() {
     
      return res.redirect("/offence_requests");
    });
   
    
  }
});
//reject requests
app.get("/reject/:type/:uid", checkNotAuthenticated, (req, res) => {
  if (
    req.params.type == "user" ||
    req.params.type == "admin" ||
    req.params.type == "super"
  ) {
    sql_helper.reject_user(req.params.uid, function() {
      if (req.params.type == "user") {
        return res.redirect("/users/requests/user");
      } else if (req.params.type == "admin") {
        return res.redirect("/users/requests/admin");
      }
    });
   
  } else if (req.params.type == "offence") {
    sql_helper.reject_offence(req.params.uid, function() {
     
      return res.redirect("/offence_requests");
    });
    
  }
});
//show user requests
app.get("/users/requests/:type", checkNotAuthenticated, (req, res) => {
  if (
    (req.params.type == "user" && req.user.type == "admin") ||
    req.user.type == "super"
  ) {
    sql_helper.user_requests(req.params.type, function (err, results) {
      console.log(err);
      if (err == undefined) {
        requests = Array.from(results.rows);
        if (requests.length == 0) {
          req.flash("error_msg", "No Requests to show.");
          return res.redirect("/users/dashboard");
        } else {
          return res.render("requests.ejs", { requests, type: req.user.type });
        }
      }
    });
  }
});
//show offence requests
app.get("/offence_requests", checkNotAuthenticated, (req, res) => {
 
  if (
    req.user.type == "user" ||
    req.user.type == "admin" ||
    req.user.type == "super"
  ) {
    
    
    sql_helper.get_offence_requests(function (err, offences) {
     
      
      if (err == undefined) {
      
        if (offences.length == 0) {
          req.flash("error_msg", "No Requests to show.");
          return res.redirect("/users/dashboard");
        } else {
          return res.render("offence_requests.ejs", {
            offences,
            type: req.user.type,
          });
        }
      }
    });
  } else {
    req.flash("error_msg", "Not Authorized.");
    return res.redirect("/users/dashboard");
  }
});
app.get("/users/login", checkAuthenticated, (req, res) => {
  return res.render("login.ejs");
});
//rendering dashboard and all required computations
app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
 
  charts.region_wise_offence_count(function (err,x1,y1) {
    
    if (err == undefined) {
     
      charts.victim_gender_wise_offence_count(function (err,x2,y2) {
      
        if (err == undefined) {
         
          charts.offender_gender_wise_offence_count(function (err,x3,y3) {
           
            if (err == undefined) {
              charts.victim_age_wise_offence_count(function (err,x4,y4) {
               
                if (err == undefined) {
                  return res.render("dashboard.ejs", { type: req.user.type,x1,y1,x2,y2,x3,y3,x4,y4 });
            
                 
                }
              });
        
             
            }
          });
    
          
        }
      });


    }
  });
  
});
//rendering report offence page
app.get("/add_offence", checkNotAuthenticated, (req, res) => {
  sql_helper.get_offence_categories(function (err, results) {
    if (err == undefined) {
      var category = Array.from(results.rows);
      sql_helper.get_locations(function (err, results) {
        if (err == undefined) {
          var locations = Array.from(results.rows);

          return res.render("add_offence.ejs", {
            locations,
            category,
            type: req.user.type,
          });
        }
      });
    }
  });
});
//deleting offence
app.get("/delete_offence/:offender_id/:offence_id", (req, res) => {
  sql_helper.delete_offence(req.params.offender_id,req.params.offence_id,function (err, results) {
    if (err == undefined) {
      if(results=='deleted'){
        req.flash("success_msg","Offence and Offender deleted");
        return res.redirect("/users/dashboard");
      }
     
    }
  });
});
app.get("/users/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out successfully");
  return res.render("index.ejs");
});

//taking user information and passing to sql-helper to save it in  database
app.post("/users/register", async (req, res) => {
  let { type, name, email, desg, password, password2 } = req.body;

  let errors = [];
  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }
  if (errors.length > 0) {
    return res.render("register.ejs", {
      errors,
      type,
      name,
      email,
      desg,
      password,
      password2,
    });
  } else {
   
    hashedPassword = await bcrypt.hash(password, 10);
   
    sql_helper.get_users_and_requests(email, function (err, results, results1) {

      if (err == undefined) {
        var requests = Array.from(results.rows);
        var requests1 = Array.from(results1.rows);
        if (requests.length > 0 || requests1.length > 0) {
          req.flash("error_msg", "Email already registered");
          res.redirect("/users/register");
        } else {
          let User = new user(type, name, email, desg, hashedPassword);
         
          sql_helper.add_user(User, function (err, results) {
            if (err == undefined) {
              var status = results;
              if (status == "success") {
                req.flash(
                  "success_msg",
                  "You are now registered. Please wait for admin approval. Check in 24 hours"
                );
                res.redirect("/users/register");
              }
            }
          });
        }
      }
    });
  }
});
//uses passport to validates and log in the user
app.post(
  "/users/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  (req, res) => {
    
    return res.redirect("/users/dashboard");
  }
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/login");
}
app.post("/users/super", async (req, res) => {
  let { type, id, name, email, desg, password, password2 } = req.body;
  let errors = [];
  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }
  if (errors.length > 0) {
  
    return res.render("super.ejs", {
      errors,
      type,
      id,
      name,
      email,
      desg,
      password,
      password2,
    });
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
   
    client.query(
      `INSERT INTO users (type,user_id,user_name, email,user_designation, password)
                VALUES ($1, $2, $3, $4,$5,$6)`,
      [type, id, name, email, desg, hashedPassword],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        req.flash("success_msg", "You are now registered. Please log in");
        return res.redirect("/users/login");
      }
    );
  }
});
//searches an offender in database and returns result
app.post("/search", searchupload.single("photo"), (req, res) => {
 
  sql_helper.get_images(function (err, results) {
 
    if (err == undefined) {
      var images = results;
    
      
      pyshell.send(
        {
       
        type: "face_recog",
        path: req.file.path,
        rows: images
      });
   
      pyshell.once("message", function (message) {
        
        
        if (message["type"] == "face_recog") {
          var image_id = message["image_id"];
          if (image_id == -1) {
            req.flash(
              "error_msg",
              "No offender found. To report offence, click on 'Report Offence' above."
            );
            return res.redirect("/users/dashboard");
          } else {
            sql_helper.get_profile_from_image_id(
              image_id,
              function (err, results) {
                if (err == undefined) {
                  
                  return res.render("offender_profile.ejs", {
                    type: req.user.type,
                    profile: results,
                  });
                }
              }
            );
          }
        }
      });
      
     
    
    }
  });
});




//adds information about an offence in database
app.post("/add_offence", upload.single("photo"), (req, res, next) => {
  date = new Date().toDateString();
  let {
    name,
    age,
    gender,
    date_committed,
    category,
    othercategory,
    region,
    victim_age,
    victim_gender,
  } = req.body;
  let Offender = new offender(req.user.user_id, age, gender, date, name);
  let Location = new location(region);
  let Offence = new offence();
  Offence.date_committed = date_committed;

  Offence.user_id = req.user.user_id;
  let Image = new image();
  //replaces backward slashes with forward slash to make the path suitable for all platforms
  var new_image_path =  req.file.path.replace(/\\/g,'/')
  Image.path=new_image_path
 
  let Victim = new victim();
  Victim.age = victim_age;
  Victim.gender = victim_gender;
  if (category == "OtherCategory") {
    let Category = new categories(othercategory);
    sql_helper.add_new_category(Category, function (err, results) {
      if (err == undefined) {
        Offence.category_id = results;
      }
    });
  } else if (category != "OtherCategory") {
    let Category = new categories(category);
    sql_helper.get_category_id(Category, function (err, results) {
      if (err == undefined) {
        Offence.category_id = results;
      }
    });
  }
  sql_helper.get_loc_id(Location, function (err, results) {
    if (err == undefined) {
      Offence.loc_id = results;
    }
  });
  sql_helper.add_offender_image(Image, function (err, results) {
    if (err == undefined) {
      Offence.image_id = results;
      Offender.image_id = results;
      sql_helper.add_offender(Offender, function (err, results) {
        if (err == undefined) {
          Offence.offender_id = results;
        }
        sql_helper.add_victim(Victim, function (err, results) {
          console.log(err);
          if (err == undefined) {
            Offence.victim_id = results;
            sql_helper.add_offence_details(Offence);
            req.flash("success_msg", "Offence Details Added");
            return res.redirect("/users/dashboard");
          }
        });
      });
    }
  });
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${PORT}`);
});
