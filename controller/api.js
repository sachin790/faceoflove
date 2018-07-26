const mongoose = require("mongoose");
const User = require("./../models/user.js");
const block = require("./../models/blocklist.js");
const rating = require("./../models/rating.js");
const description = require("./../models/description.js");
const friend = require("./../models/friendlist.js");
var base64 = require('base-64');
var utf8 = require('utf8');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const message = require("./../models/message.js");

//------Functions Exporting
exports.chat = chat;

//----------

//----SignUp Api
exports.signUp = (req, res, next) => {
	//console.log(req.body);
 validations.checkParameter(req.body.name, "name")
.then(function (data) {
            return validations.checkParameter(req.body.email, "email");
        })
.then(function (data) {
            return validations.checkParameter(req.body.password, "Password");
        })
		.then(function (data) {
			
           if (!req.files)
      //return res.status(400).send('No files were uploaded.');
    res.json(jsonResponses.response(0,"No files were Uploaded ",null));
 
        })
		
.then(data => {
	    //------
		User.find({name:req.body.name})
          .exec()
          .then(user =>{
            if(user.length>=1){
				
              res.json(jsonResponses.response(0,"Username already exist",null));
			 
             
           }
		
		  })
		  .catch(err => {
     // console.log(err);
       res.json(jsonResponses.response(0,"Error Occured ",err.message));
    });
		  
		
		
		//---------
	
	 User.find({email:req.body.email})
          .exec()
          .then(user =>{
            if(user.length>=1){
            res.json(jsonResponses.response(0," Email Already Exist",null));
           }
else{
	//upload image
            var ImageFile = req.files.image;
            var ImageName =  Date.now() + 'pic_' + ImageFile.name;
            ImageFile.mv("./public/uploads/images/" + ImageName, function (err) {
                //upload file
                if (err)
                    throw err;
            });
	
	
	var text = req.body.password ;
var bytes = utf8.encode(text);
var encoded = base64.encode(bytes);
	
	
	const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: encoded,
	profile_pic:ImageName,
	device_id: req.body.device_id, 
	notification_id: req.body.notification_id, 
	platform: req.body.platform
  });
  const token = jwt.sign({
				
				 email:user.email,
                 user_id:user._id
			},  "secret" ,
			{
				expiresIn:"1h"
				
			}
			);
  user
    .save()
	.then(result => {
		var data = {};
		data._id=user._id;
		data.name=user.name;
		data.email=user.email;
		data.password=user.password;
		data.image = user.profile_pic;
		data.device_id = user.device_id;
		data.notification_id = user.notification_id;
		data.platform = user.platform;
		data.token=token;
		//console.log(token);
     res.json(jsonResponses.response(1,"User Created Successfully",data));
	 
    })
	.catch(err =>{
  console.log(err);
  res.status(500).json({
  error:err,
  status:'0'
});
})  ;

}
})
.catch(err =>{
  console.log(err);
  res.status(500).json({
  error:err,
  status:'0'
});
})  ;
}) .catch(err => {
     
       res.json(jsonResponses.response(0,"Error",err.message));
    });
};
//--login api 
exports.login = (req, res, next) => {
	
validations.checkParameter(req.body.name, "name")
	.then(function (data) {
            return validations.checkParameter(req.body.password, "Password");
        }).then(function (data){
			  User.find({ name:req.body.name})
          .exec()
          .then(user => {
              if(user.length<1){
                  res.json(jsonResponses.response(0,"Username does not exist ",null));
                }
				var encoded = user[0].password;
              var bytes = base64.decode(encoded);
       var text = utf8.decode(bytes);
          if(text===req.body.password)
		  {
			 const token = jwt.sign(
                     {
                       email:user[0].email,
                       user_id:user[0]._id
                      },
                      "secret"
                  );
			  var data = {};
		data._id=user[0]._id;
		data.name=user[0].name;
		data.email=user[0].email;
		data.password=user[0].password;
		data.image = user[0].profile_pic;
		data.device_id = req.body.device_id;
		data.notification_id = req.body.notification_id;
		data.platform = req.body.platform;
		data.token=token;
		//console.log(token);
     res.json(jsonResponses.response(1,"Login  Successfully",data));
			  
		  }
		  else{
			     res.json(jsonResponses.response(0,"Password is Wrong ",null));
		  }
		  
		  
           })
          .catch(err =>{
 
  res.json(jsonResponses.response(0,"Error",err.message));
})
			
		
		}).catch(err =>{
  
  res.json(jsonResponses.response(0,"Error",err.message));
})
		
		
}
//-- edit personal setting api
exports.edit_personal = (req, res) => {
	
	 validations.checkParameter(req.body.name, "name")
        .then(function (data) {
            return validations.checkParameter(req.body.email, "email");
        }).then(function (data) {
            return validations.checkParameter(req.body.gender, "gender");
        }).then(function (data) {
            return validations.checkParameter(req.body.phone, "Phone Number");
        }).then(function (data) {
            return validations.checkParameter(req.body.age, "Age");
        }).then(data => {
			//----------Checking if email id already exist . 
			User.find({$and :[{email : req.body.email }, { _id: {$ne:req.authenticate_id}}]})
          .exec()
          .then(user =>{
            if(user.length>=1){
            res.json(jsonResponses.response(0,"Email already Exist ",null));
           }
		
		  })
		  .catch(err => {
     
       res.json(jsonResponses.response(0,"Error",err.message));
    });
	
	//----- checking if user name already exist .
		User.find({$and :[{name : req.body.name }, { _id: {$ne:req.authenticate_id}}]})
          .exec()
          .then(user =>{
            if(user.length>=1){
            res.json(jsonResponses.response(0,"username already exist ",null));
           }
		
		  })
		  .catch(err => {
      
      res.json(jsonResponses.response(0,"Error",err.message));
    });
	
	
	//---------- uploading the image
	 
	  if (req.files)
	  {
		    var ImageFile = req.files.image;
            var ImageName =  Date.now() + 'pic_' + ImageFile.name;
            ImageFile.mv("./public/uploads/images/" + ImageName, function (err) {
                //upload file
                if (err)
                    throw err;
            });
		  var data  = { name : req.body.name, email : req.body.email,  gender:req.body.gender , age: req.body.age , contact:req.body.phone , profile_pic:ImageName};
		  
	  }
        else{
			
			 var data  = { name : req.body.name, email : req.body.email,  gender:req.body.gender , age: req.body.age , contact:req.body.phone};
			
		}  
            return User.findOneAndUpdate({ _id:req.authenticate_id},{ $set: data },{new:true, })
	   }).then(data => {
            if (data == null) {
                return res.json({ status: 0, message: "User Does Not Found", data: null });
            }
            return res.json({ status: 1, message: "User Updated Successfuly", data: null });
        }).catch(err => {
            return res.json({ status: 0, message: "Failure", data: err });
        });	
}

//------- get personal details
exports.get_personal= (req, res) => {
	
			  User.find({ _id:req.authenticate_id})
          .exec()
          .then(user => {
			  
		
        
		  var data = {};
		data._id=user[0]._id;
		data.name=user[0].name;
		data.email=user[0].email;
		data.image = user[0].profile_pic;
		data.gender = user[0].gender;
		data.age = user[0].age;
		data.contact = user[0].contact;
		//console.log(token);
     res.json(jsonResponses.response(1,"Personal Information Fetched Successfully",data));
		
		
		  
		  
           })
          .catch(err =>{
  
  res.json(jsonResponses.response(0,"Error",err.message));
})
	
	
}

// --- add to blocklist api 
exports.blocklist = (req, res) => {  

validations.checkParameter(req.body.userid, "user id ")
.then(function (data)

{
	
	block.findOneAndUpdate(
    {_id: req.authenticate_id}, // find a document with that filter
		{$push: { blocklist: req.body.userid }}, // document to insert when nothing was found
    {upsert: true, new: true, runValidators: true}, // options
    function (err, doc) { // callback
        if (err) {
           res.json(jsonResponses.response(0,"Error",err.message));
        } else {
    res.json(jsonResponses.response(1,"Blocked  Successfully",null));
        }
    }
);	
}) .catch(err =>{
    res.json(jsonResponses.response(0,"Error",err.message));
})                  
 
   
}

//---------show block list
exports.show_blocklist = (req, res) => { 

  block.find({ _id:req.authenticate_id})
  .populate('blocklist')
          .exec()
          .then(data => {
			  
		  res.json(jsonResponses.response(1,"Block List Fetched Successfully",data[0].blocklist));
		
		
		  
           })
          .catch(err =>{
   res.json(jsonResponses.response(0,"Error",err.message));
});
			
		
		}

//----add friend 
 
exports.friendlist = (req, res) => { 

validations.checkParameter(req.body.userid, "user id ")
.then(function (data)

{
	
	friend.findOneAndUpdate(
    {_id: req.authenticate_id}, // find a document with that filter
		{$push: { friendlist: req.body.userid }}, // document to insert when nothing was found
    {upsert: true, new: true, runValidators: true}, // options
    function (err, doc) { // callback
        if (err) {
     res.json(jsonResponses.response(0,"Error",err.message));
        } else {
    res.json(jsonResponses.response(1,"Friend added successfully",null));
        }
    }
);	
}) .catch(err =>{
   res.json(jsonResponses.response(0,"Error",err.message));
})                  
 




}

//-----show friendlist
exports.show_friendlist = (req, res) => { 

  friend.find({ _id:req.authenticate_id})
   .populate('friendlist')
          .exec()
          .then(data => {
			
			  
		  res.json(jsonResponses.response(1,"Friend List Fetched Successfully",data[0].friendlist));
		
		
		  
           })
          .catch(err =>{
  console.log(err);
  res.status(200).json({
  error:err,
  status:'0'
});
});
		

}

//-------- check username exist
exports.check_username = (req, res) => { 

User.find({name:req.body.name})
          .exec()
          .then(user =>{
            if(user.length>=1){
              res.json(jsonResponses.response(0,"Username already exist",null));
           }
		   else{
			    res.json(jsonResponses.response(1,"Username is Available",null));
			   
		   }
		
		  })
		  .catch(err => {
			  
          res.json(jsonResponses.response(0,"Error",err.message));
    });





}


//---- find my face relationship 
exports.findmyface_relationship = (req, res) => { 


 const faceid = req.body.faceid;
 const result = {};
validations.checkParameter(req.body.faceid, "faceid")
.then(function (data) {
           
		  
User.find({ _id:req.authenticate_id})
          .exec()
          .then(user => {
			  
			  	  
			  rating.find({ rating_id:user[0].face_id})
          .exec()
          .then(data => {
			  
			  result.rating = data[0][faceid];
			
           })
          .catch(err =>{
   res.json(jsonResponses.response(1,"Error",err));
});
			  
			  
			  
			  ///////------------
			  	  description.find({desc_id:user[0].face_id})
          .exec()
          .then(data => {
			  
			result.description = data[0][faceid];
			  res.json(jsonResponses.response(1,"Operation Performed  Successfully",result));
			  // res.json(jsonResponses.response(1,"Operation Performed  Successfully",data[0][faceid]));
		
			 
           })
          .catch(err =>{
        res.json(jsonResponses.response(0,"Error",err.message));
});
			  
			  
			  ///-------------
		
			  
			  
			  
			
           })
          .catch(err =>{
     res.json(jsonResponses.response(0,"Error",err.message));
  
});
		   
		   
		   
        })
        .catch(err =>{
     res.json(jsonResponses.response(0,"Error",err.message));
});
}


//----- application setting api 

exports.application_setting = (req, res) => { 

User.find({ _id:req.authenticate_id})
          .exec()
          .then(user =>{
          var data = {};
		  data.notification = user[0].notification;
		  data.privacy_policy = user[0].privacy_policy;
		  
		  
		    res.json(jsonResponses.response(1,"Operation Performed  Successfully",data));
		  }
		  )
		  .catch(err => {
        res.json(jsonResponses.response(0,"Error",err.message));
    });


}

//CHAT STARTS HERE

function chat(req, responseObj, callback) {
    if (req.from_user === undefined || req.from_user == "" || req.to_user === undefined || req.to_user == "" || req.message === undefined || req.message == "") {
        return callback("from_user/ to_user/ message / type Param Missing", null);
    }
	const Message = new message({
    _id: new mongoose.Types.ObjectId(),
    from_user: req.from_user,
    to_user: req.to_user,
    message: req.message
  });
	
	Message
    .save()
	.then(result => {
		
		  if (result) {
			  console.log(result);
			  callback(null, result);
			   responseObj['result'] = 1;
			
			  responseObj['message'] = result;
                    io.sockets.in(req.to_user).emit('responseFromServer', responseObj);
			  
			  // responseObj['message'] = result;
			  console.log("Message Saved Successfully");
		  }
		else
		{
			  console.log("Message Send Nhi hua ");
		}
	 
    })
	.catch(err =>{
  console.log(err);
 
})  ;
}



