const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	console.log("auth");
   if(req.headers.authorization && req.headers.authorization!==""){
        var bearerHeader = req.headers.authorization;
        if(typeof bearerHeader !== "undefined" ){
            var bearer = bearerHeader.split(" ");
            if(bearer.length>1){
                bearerHeader = bearer[1];
            }
        }  
        var authorization = bearerHeader;
        jwt.verify(authorization,"secret", function(err, decoded){
          if(decoded){
               req.authenticate_id = decoded.user_id;
			   console.log(req.authenticate_id);
               next();
          }else{
                 	return res.status(401).json({'msg' : 'You are not authorized Send Valid Token', 'result': "0"});
                 } 
              	});
          } else{
               return res.status(401).json({'msg' : 'You are not authorized Send Valid Token', 'result': "0"});
          }
   
   
   
   
};