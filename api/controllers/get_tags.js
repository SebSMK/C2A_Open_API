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
    sprintf = require('sprintf-js').sprintf;

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */


function gettags(req, res) {
  
  var query = {
        q: req.swagger.params.keyword.value ? req.swagger.params.keyword.value : '*:*'        
    };
  
  var config =  {
        id: 'tags',
        //connector: connector_users_tags,
        host: 'csdev-seb-02',
        port: 8983,
        core: '/solr/dev_TAGS_PIC',        
        query:{
          def: {                                                
            'wt': 'json',
            'indent': true,
            'json.nl': 'map'            
          },
          fixed: {
            'q': '*:*',
            'fq': '{!join from=invnumber to=invnumber}prev_q:(%1$s) OR prev_q:(%1$s*) OR prev_q:(*%1$s) OR prev_q:(*%1$s*) OR invnumber:%1$s',
            'facet': true,
            'facet.field': ['prev_q', 'prev_facet', 'invnumber'],
            'facet.sort': 'count',
            'facet.mincount': 1,
            'facet.limit': 40,
            'rows': '0'
          }          
        }
    };
    
    var queryhandler = function(params, use_def_query){
       var query = {};
       if (use_def_query) {                   
            
            // set variables elements of the query
            query = JSON.parse(JSON.stringify(this.config.query.def)); // cloning JSON            
            for (var p in params){
              switch(p) {
                case 'wt':
                case 'indent':
                case 'json.nl':
                  query[p] = params[p];
                  break;                                                              
              }                                                                                                         
            }  
            
            // set fixed elements of the query            
            for (var f in this.config.query.fixed){              
              switch(f) {
                case 'q':
                  var q2fq = params['q'].toString() == '*:*' ? '*' : params['q'].toString(); 
                  query['q'] = this.config.query.fixed['q'];
                  
                  if(params.hasOwnProperty('q'))
                    query['fq'] = sprintf(this.config.query.fixed['fq'], q2fq);
                                     
                  break;
                case 'fq':
                  break;
                default:
                  query[f] = this.config.query.fixed[f];                                                  
              }                                                           
            }
            
            // if fq on id:, copy value
            if(params.hasOwnProperty('fq')){
              for(var i in params['fq']){
                if(params['fq'][i].indexOf('id:') > -1){
                  var fqparam = params['fq'][i].split(':').pop().toLowerCase(); 
                  query['fq'] = sprintf(this.config.query.fixed['fq'], fqparam);
                }
                                                                      
              }            
            }   
                                     
        } else {
            query = params;
        }            
        return query;
    };
    
  var solrconnector = new SolrConnector(config);    
    
  solrconnector.handler(query, true, queryhandler)
      .then(function(result){                
        console.log(result);
        res.json(result);       
      })
      .catch(function (error) {
        console.log(error);
        res.status(error.error.code).json(error);        
      });    
};

module.exports = {
  gettags: gettags
};