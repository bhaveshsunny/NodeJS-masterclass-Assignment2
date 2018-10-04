// File for storing and editing data

// dependecncies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');
//container to be exported

var lib = {};

//path to data dir
lib.Basedir = path.join(__dirname,'../.data/');

//write data
lib.create = function(dir,file,data,callback){
  //open File
  fs.open(lib.Basedir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
      if(!err && fileDescriptor){
        //convert data to string
        var stringData = JSON.stringify(data);
        //write file and close it
        fs.writeFile(fileDescriptor,stringData,function(err){
          if(!err){
            fs.close(fileDescriptor,function(err){
              if(!err){
                callback(false);
              }else{
                callback('Error closing file');
              }
            });
          }else{
              callback('Error writing to file');
          }
        });
      } else {
        callback(err);
      }
  });
};

// readt data from a file
lib.read = function(dir,file,callback){
 fs.readFile(lib.Basedir+dir+'/'+file+'.json','utf8',function(err,data){
   if(!err && data){
     var parsedData = helpers.parseJsonToObject(data);
     callback(false,parsedData);
   }else{
      callback(err,data);
   }

 })
};

//update existing file
lib.update = function(dir,file,data,callback){
  //open for updating
  fs.open(lib.Basedir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
    if(!err && fileDescriptor){
      //convert data to string
      var stringData = JSON.stringify(data);

      //Truncate old contents
      fs.truncate(fileDescriptor,function(err){
        if(!err){
          //write to file and save
          fs.writeFile(fileDescriptor,stringData,function(err){
            if(!err){
              fs.close(fileDescriptor,function(err){
                if(!err){
                  callback(false);
                }else {
                  callback('Error closing the file');
                }

              });
            }else{
              callback('Error writing to existing file');
            }
          });
        }else{
          callback('error truncating file');
        }
      });

    }else {
      callback(err);
    }
  });
};

//Delete a file
lib.delete = function(dir,file,callback){
  fs.unlink(lib.Basedir+dir+'/'+file+'.json',function(err){
    if(!err){
      callback(false);
    }else{
      callback('Error deleting file'+err);
    }
  });
}


//export the lib
module.exports = lib;
