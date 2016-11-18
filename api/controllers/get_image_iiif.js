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
var solr = require('solr-client'),
  rp = require('request-promise'),
  sprintf = require('sprintf-js').sprintf,  
  SolrConnector = require('./connectors/solr');

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
  getiiifref: getiiifref
};

function getiiifref(req, res) {
  
  var query = {
        q: req.swagger.params.refnum.value ? sprintf('invnumber:%1$s OR id:%1$s', req.swagger.params.refnum.value.toLowerCase()) : '*:*',
        start:0,
        rows:1        
    };
  var iiifid;
    
  var config = {        
        id: 'damlit',
        host: 'csdev-seb-02',
        port: 8983,
        core: '/solr/dev_DAM_PIC',
        query:{
          def: {                                   
            'wt': 'json',
            'indent': true,
            'json.nl': 'map'            
          },
          fixed: {
            'fl': 'value'
          },
          exclude: ['fq']
        },
        iiifserver: "http://iip.smk.dk/iiif/%s"
    };
            
  var solrconnector = new SolrConnector(config);
  
  solrconnector.handler(query, true) 
      .then(function(solrResponse){
        if (solrResponse.response.numFound > 0) {
          console.log("getiiifref - solr says:", solrResponse);                    
          // get pyr image path
          var pyrfilePath = solrResponse.response.docs[0].value; 
          
          return pyrfilePath;          
                                                         
        } else {
          console.log("getimgbyrefnum - image not found :", query.q);
          var error = {error: "getimgbyrefnum - image not found : " + query.q, status: 404};
          //return res.status(404).json(error);
          throw error;
        }        
      })
      
      .then(function(pyrfilePath){
        var getoptions = {
          method: 'GET',
          uri: sprintf(config.iiifserver + '/info.json', encodeURIComponent(pyrfilePath)),          
        };          
        iiifid = sprintf(config.iiifserver, encodeURIComponent(pyrfilePath));
        return rp(getoptions);
      
      })
      .then(function(iiifjson){
        var parsed = JSON.parse(iiifjson);
        parsed["@id"] = iiifid;
        console.log("getiiifref - iiif says:", JSON.stringify(parsed, 4));
        res.json(parsed);       
      })
      .catch(function (error) {        
        console.error(error);
        res.status(error.status).json(error);        
      });  
  
}
