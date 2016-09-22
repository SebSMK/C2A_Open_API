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
var util = require('util'), 
  Q = require('q'),
  rp = require('request-promise');

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
  getzoom: getzoom
};

function getzoom(req, res) {

  var config = {
    IIP:{
      Server: "http://demoapi.smk.dk",
      Port: "80",
      Path: "zoom/osd"
    }      
  }
  
  var id = req.swagger.params.refnum.value;
  
  var uri = util.format('%s:%s/%s/%s', config.IIP.Server, config.IIP.Port, config.IIP.Path, id);
  
  rp(uri)
    .then(function (htmlString) {
        console.log(htmlString);
        res.send(htmlString);
    })
    .catch(function (error) {
        console.log(error);
        res.status(500).json({error:error});
    });   
}


