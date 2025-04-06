const express = require('express');
const router = express.Router();
const navController = require('../controllers/navs');


router.route("/home")
    .get(navController.home);

router.route("/about")
    .get(navController.about);

router.route("/contact")
    .get(navController.contact);

router.route("/map")
    .get(navController.map);

router.route("/profile")
    .get(navController.profile);

module.exports = router;

