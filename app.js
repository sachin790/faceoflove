var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./routes/routes');
var http = require('http');
const fileUpload = require('express-fileupload');
var api = require('./controller/api');


/*
 * default json pattern 
 */
jsonPattern = require('./common/json/jsonPattern');
/*
 * use this to get common json response for all methods 
 */
jsonResponses = require('./common/json/jsonResponses');
/*
 * validations methods 
 */
validations = require('./common/validations/validations');
/*
 * all global variable in this module like string values.
 */
customConfig = require('./config/custom_config/customConfig');
/**
 * MONGO DB Connection
 */
db = require('./config/database_config/database')
db.connect();
/*
 * @module bluebird
 */
 Promise = require('bluebird');

var app = express();

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({extended: false}));
/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());
//app.use(bodyParser.json({ type: 'application/*+json' }));

//--

app.use(fileUpload());
//-----
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

/*
 * Routes methods call here
 */
app.use("/",routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || customConfig.internalServerErrorCode);
 // res.render('error');
   res.json(jsonResponses.response(err.status || customConfig.internalServerErrorCode,res.locals.message,null));
});

//server 
var httpServer = http.createServer(app).listen(7020, function()  {
    console.log('Express server listening on port.. ' +7020);
  });
  
  //--------------------------Socket Start Here 



io = require('socket.io')(httpServer);
io.on("connection", function (socket) {
	console.log("I am here ");
    socket.on("socketFromClient", function (msg) {
        var userSocketID = msg.from_user;
        socket.join(userSocketID);
        var responseObj = { "result": "0", "message": "Error",  "method": "chat" };
        if (msg.methodName && msg.methodName == "chat") {
            api.chat(msg, responseObj, function (err, response) {
				console.log(err);
				console.log(response);
                if(response) {
                    responseObj['result'] = 1;
                    responseObj['message'] = response;
                  }else if(err){
                    responseObj['message'] = err;
                  }
                  //notify sender about the message has been sent or not
                  io.sockets.in(userSocketID).emit('responseFromServer', responseObj);
            });
        }
        if (msg.methodName && msg.methodName == "readmessage") {
            api.readMessage(msg, function (err, response) {
                if (err)
                    socket.emit("responseFromServer", err);
                else
                    socket.emit("responseFromServer", response);
            });
        }

    });
});








//-------------------------------------------------------Sockets end here 

module.exports = app;
