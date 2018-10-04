/*
*Helper functions for all the tasks
*/

//dependecncies
var crypto = require('crypto');
var config = require('./config.js');
// Container for all the helpers
var helpers = {};


//Create SHA256 Hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length >0){
    var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
    return hash;
  }else{
    return false;
  }
};

//Parse a JSON string to an object
helpers.parseJsonToObject = function(str){
    try{
      var obj = JSON.parse(str);
      return obj;
    }catch(e){
      return {};
    }
};

//export helpers

module.exports = helpers;
