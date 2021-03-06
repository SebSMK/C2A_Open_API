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
  SolrConnector = require('./connectors/solr'),
  //connector_CollectionSpace = require('./connectors/connector_CollectionSpace'),
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
  getnoticebyrefnum: getnoticebyrefnum,
  getnoticebysolr: getnoticebysolr
};

//*** Search the collection throug a solr request
function getnoticebysolr(req, res) {
  
  var query = req.swagger.params.solr_string.value.split("&");
  var params = extractSolrParams(query);
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
            'fl': 'id, artist*, title*, obj*, mat*, score', 
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

//*** Search the collection throug a simplified and formated request
function getnoticebyrefnum(req, res) {
  
  var query = {
        q: req.swagger.params.refnum.value ? util.format('id:%s', req.swagger.params.refnum.value.toUpperCase()) : '*:*',
        start: req.swagger.params.start.value ? req.swagger.params.start.value : 0,
        rows: req.swagger.params.rows.value ? req.swagger.params.rows.value : 10,
        fq: [req.swagger.params.production_date_to.value ? util.format('object_production_date_earliest:[* TO %s-01-01T00:00:00.001Z]', req.swagger.params.production_date_to.value) : "", req.swagger.params.production_date_from.value ? util.format('object_production_date_latest:[%s-01-01T00:00:00.001Z TO *]', req.swagger.params.production_date_from.value) : ""],
        sort: req.swagger.params.sort.value ? req.swagger.params.sort.value : "object_production_date_earliest desc"
    };
  var config =  {
        id: 'CollectionSpace',
        //connector: connector_CollectionSpace,
        host: 'csdev-seb-02',
        port: 8983,
        core: '/solr/dev_DAM_SAFO',
        query:{
          def: {                                   
            'wt': 'json',
            'indent': true,
            'json.nl': 'map'            
          },
          fixed: {}
          //exclude: ['fq']
        }
    };
   
  var solrconnector = new SolrConnector(config);
  
    solrconnector.handler(query, true) 
      .then(function(result){                
        console.log(result);
        res.json(result);       
      })
      .catch(function (error) {
        console.log(error);
        res.status(error.error.code).json(error);        
      });            
}

function extractSolrParams(request) {    
      var solrQ = {};
      request.forEach(function(item, index){
        var param = item.split('=')[0];
        var value = item.split('=').length > 0 ? item.split('=')[1] : undefined;
        if (solrQ[param] == undefined){
          solrQ[param] = value;
        }else{
          if ( typeof(solrQ[param]) === 'string' ){
            solrQ[param] = [solrQ[param], value];            
          }else{            
            solrQ[param] = [solrQ[param]].concat([value]);          
          }                    
        }                       
      })
      //return mock;
      return solrQ;               
};   


