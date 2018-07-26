var express = require('express');
var router = express.Router();
const checkAuth = require("./../middleware/check-auth");
var api= require("./../controller/api");
//const checkAuth = require('./../middleware/check-auth');
//const checkAuth = require('./../middleware/check-auth');



//DIRECTING TO API FUNCTIONS
router.post("/signUp", api.signUp);
router.post("/login", api.login);
/* router.post("/edit_personal", checkAuth, function(req, res){
 api.edit_personal
}); */
router.post("/edit_personal", checkAuth, api.edit_personal );
router.post("/get_personal", checkAuth, api.get_personal );
router.post("/blocklist", checkAuth, api.blocklist );
router.post("/show_blocklist", checkAuth, api.show_blocklist );
router.post("/friendlist", checkAuth, api.friendlist );
router.post("/show_friendlist", checkAuth, api.show_friendlist );
router.post("/check_username", api.check_username );
router.post("/findmyface_relationship", checkAuth, api.findmyface_relationship);
router.post("/application_setting", checkAuth, api.application_setting);





//export app
module.exports=router;