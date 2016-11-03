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
var SolrConnector = require('./connectors/solr'),  
  proxy = require('./connectors/proxy');

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
  postnoticesolrsearch: postnoticesolrsearch
};

//*** Search the collection throug a solr request
function postnoticesolrsearch(req, res) {
  
  var params = req.body;
  //var params = extractSolrParams(query);
  //var query = url.parse(req.swagger.params.solr_string.value, true).query; 
  
  var config =  {
        id: 'CollectionSpace',        
        host: 'csdev-seb-02',
        port: 8983,
        core: '/solr/dev_DAM_SAFO',
        query:{
          def: {                                   
            'wt': 'json',
            'indent': true,
            'json.nl': 'map'            
          },
          fixed: {
            //'q': '%1$s',            
            //'qf': 'collectorExact1^150 collectorExact2^30 collectorExact3^20 collector1^20 collector2^15 collector3^10 collector4^5',            
            //'fl': '*, score',
            //'fl': 'id, artist*, title*, obj*, mat*, score', 
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
              //'solr-example/dev_SAFO/select': connector_CollectionSpace
            }    
        }
    };
   
  if (proxy.validateRequest(params, config)){
    console.log('ACCESS ALLOWED: ' + JSON.stringify(params));
    
    var solrconnector = new SolrConnector(config);
  
    solrconnector.handler(params, true) 
      .then(function(result){                
        console.log(result);
        res.json(result);       
      })
      .catch(function (error) {
        console.log(error);
        res.status(error.error.code).json(error);        
      });            
  }else{
    var err = 'ACCESS DENIED: ' + JSON.stringify(params);
    console.log(err);
    res.status(403).json(err); 
  }      
}


