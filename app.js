if(process.env.NODE_ENV != "production"){
    
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require ("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const navRouter = require("./routes/nav");


const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");


const ExpressError = require("./utils/expressError.js");


const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");


const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));


const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);


app.use(express.static(path.join(__dirname,"/public")));


const methodOverride=require("method-override");
const user = require("./models/user.js");
app.use(methodOverride("_method"));

const dbUrl = process.env.ATLASDB_URL;
main ()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto :{
        secret: process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})


const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 *24 *60 * 60 * 1000,
        maxAge: 7 *24 *60 * 60 * 1000,
        httpOnly : true,
    },
};

app.use(session (sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.msgSuccess = req.flash("success");
    res.locals.msgError = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/", require('./routes/nav'));
app.use("/listings",listingRouter);  
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})


app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
 
})


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
    
});

