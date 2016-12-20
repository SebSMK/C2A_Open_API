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
  Q = require('q'),
  sprintf = require('sprintf-js').sprintf,
  iipproxy = require('./connectors/iip'),
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
  getimgbyrefnum: getimgbyrefnum,
  getrandomimg: getrandomimg
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function getrandomimg(req, res) {
  
  var query = {};
    
  var config =  {
        id: 'hirespictures',
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
            q: "value:[* TO *] AND (invnumber:kk* OR invnumber:km*)",
            start: Math.floor((Math.random() * 4000)),
            rows: 1,            
            'fl': 'id, invnumber'
          }
          //exclude: ['fq']
        }
    };
      
  var solrconnector = new SolrConnector(config);
  
  solrconnector.handler(query, true) 
      .then(function(solrResponse){
        if (solrResponse.response.numFound > 0) {
          var req_bounce = {swagger:{params:{refnum:{value:0},size:{value:0}}}};                    
          req_bounce.swagger.params.refnum.value = solrResponse.response.docs[0].id;
          req_bounce.swagger.params.size.value = req.swagger.params.size.value;

          getimgbyrefnum(req_bounce, res); 
                                                         
        } else {
          console.log("getrandomimg - image not found :", query.q);
          var error = {error: "getrandomimg - image not found : " + query.q, status: 404};
          //return res.status(404).json(error);
          throw error;
        }        
      })
      .catch(function (error) {        
        console.log(error);
        res.status(error.status).json(error);        
      });  
  
}

function getimgbyrefnum(req, res) {
  
  var query = {
        q: req.swagger.params.refnum.value ? sprintf('invnumber:%1$s OR id:%1$s', req.swagger.params.refnum.value.toLowerCase()) : '*:*',
        start:0,
        rows:1        
    };
    
  var config = {
        IIPHost : '172.20.1.203',
        IIPPath : '/iipsrv/iipsrv.fcgi',
        IIPImageSize:{
              thumb: 100,
              medium: 200,
              large: 500    
        },
  
        id: 'CollectionSpace',
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
        }
    };
    
    
  var imgsize = config.IIPImageSize[req.swagger.params.size.value] !== undefined ? config.IIPImageSize[req.swagger.params.size.value] : config.IIPImageSize["thumb"];
  
  var solrconnector = new SolrConnector(config);
  
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
  
}
