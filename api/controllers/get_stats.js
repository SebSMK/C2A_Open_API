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
  connector_CollectionSpace = require('./connectors/connector_CollectionSpace');

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
  getstats: getstats
};

function getstats(req, res) {
  
  var query = {
        q: req.swagger.params.keyword.value ? util.format("q:%s", req.swagger.params.keyword.value) : '*:*',
        start: req.swagger.params.start.value ? req.swagger.params.start.value : 0,
        rows: req.swagger.params.rows.value ? req.swagger.params.rows.value : 10,
        sort: req.swagger.params.sort.value ? req.swagger.params.sort.value : "last_update desc"
    };
  
  var config =  {
        id: 'CollectionSpace',
        connector: connector_CollectionSpace,
        host: 'solr-02.smk.dk',
        port: 8080,
        core: '/solr-h4dk/prod_search_dict',
        query:{
          def: {                                   
            'wt': 'json',
            'indent': true,
            'json.nl': 'map'            
          },
          fixed: {
            //'q': '%1$s',            
            //'qf': 'id_lower',            
            //'fl': '*, score',
            'fl': 'last_update, q, language, numfound, user, facet', 
            //'defType': 'edismax'
          }
          //exclude: ['fq']
        },
        // proxy
        proxy:{
      	   options: {
      	      validHttpMethods: ['GET'],
      	      invalidParams: ['qt', 'stream']
      	    },
            mapping:{
              'solr-example/dev_SAFO/select': connector_CollectionSpace
            }    
        }
    };
  
  connector_CollectionSpace.setconfig(config);
    
  connector_CollectionSpace.handler(query, true)
      .then(function(result){                
        console.log(result);
        res.json(result);       
      })
      .catch(function (error) {
        console.log(error);
        res.status(error.error.code).json(error);        
      });    
}


