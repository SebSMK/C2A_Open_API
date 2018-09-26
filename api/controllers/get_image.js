'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var rp = require('request-promise'),
    fs = require('fs'),
    config = require('./config/config'),
    table = require('c2a_table'),
    logger = require('c2a_utils').logging,
    iipproxy = require('./connectors/iip');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  getimgbyrefnum: getimgbyrefnum
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */

function getimgbyrefnum(req, res) {
  
  var query = {
        invnumber: req.swagger.params.refnum.value        
    };  
  var imgsize = config.iip.IIPImageSize[req.swagger.params.size.value] !== undefined ? config.iip.IIPImageSize[req.swagger.params.size.value] : config.iip.IIPImageSize["thumb"];
  var data = new table.mongoclient(config.mongo.path);  
  var collection = process.env.NODE_ENV == 'production' ? config.hi_res.collection.prod : process.env.NODE_ENV == 'test' ? config.hi_res.collection.test : config.hi_res.collection.dev;
 
   data.connect()
   .then(function (db_res) {
      logger.info("Connected to table."); 
      return data.retrieve(collection, query);  
   })
   .then(function (data_retrieved) {
      logger.info("Data retrieved: " + JSON.stringify(data_retrieved));
      res.json(data_retrieved);  
   })
  .catch(function (error) {        
    console.log(error);                          
    res.status(error.statusCode).json(error);        
  });
  
  /*
  
  solrconnector.handler(query, true) 
      .then(function(solrResponse){
        if (solrResponse.response.numFound > 0) {
          console.log("getimgbyrefnum - solr says:", solrResponse);                    
          // get pyr image
          var pyrfilePath = solrResponse.response.docs[0].value;                                
          var iip = new iipproxy(config.IIPHost, config.IIPPath, imgsize);                
          
          return iip.getImageByFilePath(pyrfilePath)
          .then(function(imgstream) {
            imgstream.pipe(res); // RETURN STREAM (image diplayed in browser)
          });
                                                         
        } else {
          console.log("getimgbyrefnum - image not found :", query.q);
          var error = {error: "getimgbyrefnum - image not found : " + query.q, status: 404};
          //return res.status(404).json(error);
          throw error;
        }        
      })
      .catch(function (error) {        
        console.log(error);
        res.status(error.status).json(error);        
      });  
      
      */
  
}
