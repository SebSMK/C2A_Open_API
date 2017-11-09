'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

module.exports = {
  videntifier_recogn: videntifier_recogn,
  videntifier_insert: videntifier_insert
};

var rp = require('request-promise');
var fs = require('fs');
var config = require('./config/config');

function videntifier_recogn(req, res) {
  if (req.body.path == undefined) 
    res.status("500").json('{"error":"path not defined"}');
    
  var filepath = req.body.path;
  //params = '/tmp/hires/iipsrv.jpg';
  
  var options = {
    method: 'POST',
    uri: config.videntifier.uri.recognition, //'https://api.videntifier.com/api/v1/query?include_locations=true',
    
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': config.videntifier.authorization        
    },
    
    formData: {
      file: fs.createReadStream(filepath)
    }  
  };
  
  rp(options)  
  .then(function (parsedBody) {
      console.log(parsedBody);
      res.json(parsedBody);     
   })  
  .catch(function (error) {        
    console.log(error);
    res.status(error.statusCode).json(error);        
  });         
}


function videntifier_insert(req, res) {  
  if (req.body.path == undefined && req.body.url == undefined ) 
    res.status("500").json('{"error":"path/url not defined"}');
  
  var formData = {};  
  if (req.body.path !== undefined){
    formData['file'] =  fs.createReadStream(req.body.path);
  }else{
    formData['download_url'] = req.body.url; 
  }
    
  if (req.body.metadata !== undefined)
    formData['metadata'] = JSON.stringify(req.body.metadata); //req.body.metadata; 
  
  
  var options = {
    method: 'POST',
    uri: config.videntifier.uri.insert,
    
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': config.videntifier.authorization        
    },
    
    formData: formData
  };
  
  rp(options)  
  .then(function (parsedBody) {
      console.log(parsedBody);
      res.json(parsedBody);     
   })  
  .catch(function (error) {        
    console.log(error);                          
    res.status(error.statusCode).json(error);        
  });         
}

  /***
 *  PRIVATE FUNCTIONS
 **/




