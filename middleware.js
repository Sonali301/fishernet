const Listing = require("./models/listing");

// requiring expresserror
const ExpressError = require("./utils/expressError.js");

// requiring schema for server validation
const {listingSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;  // redirect to original url
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// to prevent from making changes to other users
module.exports.isOwner = async(req,res,next) =>{
    let {id} =req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// validate listing method
module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);  // error for the individual field
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
