'use strict';

var SolrConnector = require('./connectors/solr');

module.exports = {
  gethireslist: gethireslist
};

//*** Get list of all artworks with a high resolution picture
function gethireslist(req, res) {
  
  var query = {
        q: "value:[* TO *] AND (invnumber:kk* OR invnumber:km*)",
        start: req.swagger.params.start.value ? req.swagger.params.start.value : 0,
        rows: req.swagger.params.rows.value ? req.swagger.params.rows.value : 10,
        sort: req.swagger.params.sort.value ? req.swagger.params.sort.value : "created desc"
    };
    
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
            'fl': 'id, invnumber'
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
};


