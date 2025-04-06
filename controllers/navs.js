module.exports.home= (req, res) => {
    res.render("nav/home.ejs");
};

module.exports.about = (req, res) => {
    res.render("nav/about.ejs");
};

module.exports.contact = (req, res) => {
    res.render("nav/contact.ejs");
};

module.exports.map = (req, res) => {
    res.render("nav/map.ejs");
};

module.exports.profile= (req, res) => {
    res.render("nav/profile.ejs");
};
