/*
Request handlers
*/

//Dependencies
var _data = require('./data');
var helpers = require('./helpers')

var handlers = {};

//users
handlers.users = function(data,callback){
  var acceptablemethods = ['post','get','put','delete'];
  if(acceptablemethods.indexOf(data.method) > -1){
    handlers._users[data.method](data,callback);
  }else{
    callback(405);
  }
};

// container for user submethods
// requiredData : firstname, lastname, phone, password, tosAgreement
//opttional data: None

handlers._users  = {};

//USers post
handlers._users.post = function(data,callback){

//check all the fields are filled
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
  if(firstName && lastName && phone && password && tosAgreement){
    _data.read('users',phone,function(err,data){
      if(err){
        //hash password
        var hashedPassword = helpers.hash(password);

        if(hashedPassword){
          //Create User object
          var userObject = {
            'firstName' : firstName,
            'lastName' : lastName,
            'phone' : phone,
            'hashedPassword' : hashedPassword,
            'tosAgreement' : true
          }
          //Store users
          _data.create('users',phone,userObject,function(err){
            if(!err){
              callback(200);
            }else{
              callback(500,{'Error':'Could not create user.'});
            }

          });

        }else{
          callback(500,{'Error':'Could not hash users password'});
        }

      }else{
        callback(400,{'Error':'A User with the phone Number already exists'});
      }
    });
  }else{
    callback(400,{'Error':'Missibng required fields'});
  }

};

//USers get
// Required data - phone
handlers._users.get = function(data,callback){
  var phone = typeof(data.queryString.phone) == 'string' && data.queryString.phone.trim().length == 10 ? data.queryString.phone.trim() : false;
  if(phone){
    _data.read('users',phone,function(err,data){
      if(!err && data){
        //remove hashed password from user object before svar hashedPassword = helpers.hash(password);ending it
        delete data.hashedPassword;
        callback(200,data);
      }else{
        callback(404,{'Error':'User does not exist.'})
      }
    });
  }else{
    callback(400,{'Error':'Missing field required'});
  }
};
//USers put
// container for user submethods
// requiredData : firstname, lastname, phone, password, tosAgreement
//opttional data: None
handlers._users.put = function(data,callback){
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  // check for optional fields
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // Error if phone is invalid
  if(phone){
    if(firstName || lastName || password){
      //lookup user
      _data.read('users',phone,function(err,data){
        if(!err && data){
          //update fields necessary
          if(firstName){
            data.firstName = firstName;
          }

          if(lastName){
            data.lastName = lastName;
          }

          if(password){
            data.hashedPassword = helpers.hash(password);
          }

          //store update
          _data.update('users',phone,data,function(err){
            if(!err){
              callback(200);
            }else{
              console.log(err);
              callback(500,{'Error':'Could not update user.'})
            }
          });
        }else {
          callback(400,{'Error':'Specified user doesnot exist'});
        }
      });
    }else {
        callback(400,{'Error':'Required fields missing.'});
    }

  }else {
    callback(400,{'Error':'Required fields missing.'});
  }
};
//USers delete
handlers._users.delete = function(data,callback){
  // check phone number is valid
  var phone = typeof(data.queryString.phone) == 'string' && data.queryString.phone.trim().length == 10 ? data.queryString.phone.trim() : false;
  if(phone){
    _data.read('users',phone,function(err,data){
      if(!err && data){
        _data.delete('users',phone,function(err){
          if(!err){
            callback(200);
          }else {
            callback(500,{'Error':'Could not delte the spedcified user.'});
          }
        });
      }else{
        callback(404,{'Error':'Could not find user.'})
      }
    });
  }else{
    callback(400,{'Error':'Missing field required'});
  }
};

//tokens

handlers.tokens = function(data,callback){
  var acceptablemethods = ['post','get','put','delete'];
  if(acceptablemethods.indexOf(data.method) > -1){
    handlers._tokens[data.method](data,callback);
  }else{
    callback(405);
  }
};

//Container for all the tokens submethods
handlers._tokens = {};

//Tokerns - post
//Required data - Phone, password
//optional - none
handlers._tokens.post = function(data,callback){
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if(phone && password){
    // lookup user with matching phone number
    _data.read('users',phone,function(err,userData){
      if(!err && userData){
        //check if the hashed password is same as stored password
        var hashedPassword = helpers.hash(password);
      }else {
        callback(400,{'Error':'Could not find user'});
      }
    });
  }else{
    callback(400,'Error':'Missing required fields');
  }
};

//Tokerns - get
handlers._tokens.get = function(data,callback){

};

//Tokerns - put
handlers._tokens.put = function(data,callback){

};

//Tokerns - delete
handlers._tokens.delete = function(data,callback){

};

//sample handlers

handlers.sample = function(data,callback){
  callback(406,{'name' : 'sample handler'});
};

//ping handler
handlers.ping = function(data,callback){
  callback(200);
};

//notfound handler
handlers.notfound = function(data,callback){
  callback(404);
};

//hello handler
handlers.hello = function(data,callback){
  callback(200,{'message' : 'Hello World!'});
};

module.exports = handlers;
