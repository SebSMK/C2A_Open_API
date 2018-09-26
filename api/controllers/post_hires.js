'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

module.exports = {
  hires_insert: hires_insert,
  test_converter: test_converter
};

var rp = require('request-promise'),
    fs = require('fs'),
    config = require('./config/config'),
    table = require('c2a_table'),
    logger = require('c2a_utils').logging,
    convert = require ('pyr_converter');

function hires_insert(req, res) {  
  if (req.body.path == undefined ) 
    res.status("500").json('{"error":"path not defined"}');
  if (req.body.invnumber == undefined ) 
    res.status("500").json('{"error":"invnumber not defined"}');
  if (req.body.institution == undefined ) 
    res.status("500").json('{"error":"institution not defined"}');
  
  var params = {};
  params['link'] = req.body.path;
  params['invnumber'] = req.body.invnumber;
  params['institution'] = req.body.institution;
  params['storage'] = process.env.NODE_ENV == 'production' ? config.hi_res.storage.prod : process.env.NODE_ENV == 'test' ? config.hi_res.storage.test : config.hi_res.storage.dev;
  var collection = process.env.NODE_ENV == 'production' ? config.hi_res.collection.prod : process.env.NODE_ENV == 'test' ? config.hi_res.collection.test : config.hi_res.collection.dev;
 
  var data = new table.mongoclient(config.mongo.path);
  
  var collection = "test";
  
  convert.insert(params)
  .then(function (convert_res) {
      logger.info("Conversion succeeded: " + convert_res); 
      return data.connect();   
   })
   .then(function (db_res) {
      logger.info("Connected to table."); 
      return data.create(collection, params);   
   })
   .then(function (data_insert) {
      logger.info("Data created: " + JSON.stringify(data_insert));
      res.json(params);  
   })
  .catch(function (error) {        
    logger.info("Insertion failed: " + error);                           
    res.status(error.statusCode).json(error);        
  });   
}

function hires_insert_old(req, res) {  
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
 
 function test_converter(req, res) {  
  if (req.body.path == undefined ) 
    res.status("500").json('{"error":"path not defined"}');
  if (req.body.invnumber == undefined ) 
    res.status("500").json('{"error":"invnumber not defined"}');
  if (req.body.institution == undefined ) 
    res.status("500").json('{"error":"institution not defined"}');
  
  /***/
  var params = {};
  params['link'] = req.body.path;
  params['invnumber'] = req.body.invnumber;
  params['institution'] = req.body.institution;
  params['storage'] = process.env.NODE_ENV == 'production' ? config.hi_res_storage.prod : process.env.NODE_ENV == 'test' ? config.hi_res_storage.test : config.hi_res_storage.dev;
  
  var data = new table.mongoclient(config.mongo.path);
  
  var collection = "test";
  
  convert.insert(params)
  .then(function (convert_res) {
      logger.info("Conversion succeeded: " + convert_res); 
      return data.connect();   
   })
   .then(function (db_res) {
      logger.info("Connected to table."); 
      return data.create(collection, params);   
   })
   .then(function (data_insert) {
      logger.info("Data saved: " + JSON.stringify(data_insert));
      var key = {'invnumber': params['invnumber']};
      var value = {$set:{'institution':'Seb'}};
      return data.update(collection, key, value);   
   })
   .then(function (data_updated) {
      logger.info("Data updated: " + JSON.stringify(data_updated));
      var request = {'institution':'Seb'};
      return data.retrieve(collection, request);     
   })
   .then(function (data_retrieved) {
      logger.info("Data retrieved: " + JSON.stringify(data_retrieved));
      var request = {'institution':'Seb'};
      return data.delete(collection, request);     
   })
   .then(function (data_deleted) {
      logger.info("Data deleted: " + JSON.stringify(data_deleted));
      res.json(params);     
   })        
  .catch(function (error) {        
    console.log(error);                          
    res.status(error.statusCode).json(error);        
  });   
}




