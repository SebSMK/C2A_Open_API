var Q = require('q'),
    solr = require('solr-client'),
    sprintf = require('sprintf-js').sprintf;

var connector_users_tags = {

    config: {
        id: 'users_tags',
        connector: connector_users_tags,
         host: 'csdev-seb-02',
        port: 8983,
        path: '/solr/dev_TAGS_PIC',        
    },
    
    queryhandler: function(params, use_def_query){
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
    },
    
    handler: function(params, use_def_query) {
        var deferred = Q.defer();
        var client = this.client(this.config);
        var res = {},
            query = {};
        var self = this;
        
        query = self.queryhandler(params, use_def_query);

        client.get('select', query, function(err, obj) {

            if (err) {
                //res[self.config.id] = err;
                deferred.reject(err);

            } else {
                //res[self.config.id] = obj;
                deferred.resolve(obj);
            }
        });
        return deferred.promise;
    },
       
    client: function(config) {
        return solr.createClient(config.host, config.port, '', config.path);
    },
    
    setconfig: function(config) {
        this.config = config || this.config;
    },
    
    getconfig: function(){
        return this.config;
    }
}

module.exports = connector_users_tags;