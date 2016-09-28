'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

var SolrConnector = require('./connectors/solr');

function getstats(req, res) {
  
  var query = {
        q: req.swagger.params.keyword.value? req.swagger.params.keyword.value : '*:*',
        start: req.swagger.params.start.value ? req.swagger.params.start.value : 0,
        rows: req.swagger.params.rows.value ? req.swagger.params.rows.value : 10,
        sort: req.swagger.params.sort.value ? req.swagger.params.sort.value : "last_update desc"
    };
  
  var config =  {
        id: 'stats',
        //connector: connector_CollectionSpace,
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
            'q': 'q:%1$s OR q:*%1$s OR q:%1$s* OR q:*%1$s*',            
            //'qf': 'id_lower',            
            //'fl': '*, score',
            'fl': 'last_update, q, language, numfound, user, facet', 
            'facet': true,
            'facet.field': ['q', 'facet'],
            'facet.sort': 'count',
            'facet.mincount': 1,
            'facet.limit': 40
          }
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

module.exports = {
  getstats: getstats
};


