var Q = require('q'), 
    util = require('util'),   
    request = require('request');

IIPProxy = (function(){

     /**
     * Constructor
     **/
    function IIPProxy (host, path, imgsize) {        
        console.log("IIPProxy Constructor:", host + path);
        console.log("IIPProxy Constructor - image size:", imgsize);
        this.host = host;      
        this.path = path;
        this.imgsize = imgsize;
    }
  
    
    IIPProxy.prototype.getImageByFilePath = function(filepath) {

        console.log(util.format("start IIP req %s -%s -%s", this.imgsize, wid, filepath));
        
        var wid = this.imgsize !== undefined ? util.format('&WID=%s', this.imgsize) : '';

        var req = util.format('FIF=%s%s&CVT=jpeg', filepath, wid);
        var uri = util.format('http://%s%s?%s', this.host, this.path, req);
        var deferred = Q.defer();

        console.log("IIPProxy requested uri", uri);
        
        request.get(uri, function (error, response, body) {
              
              if (!error && response.statusCode == 200) {                  
                  console.log('IIPProxy response OK - content-type:', response.headers['content-type']);                                    
                  deferred.resolve(request(uri));                                    
              }else{
                console.log("IIPProxy error", error);
                deferred.reject(util.format('IIPProxy error: %s - %s', response.statusCode, error));
              }
        });        
        
        return deferred.promise;       
    } 
    
    return IIPProxy;
})();

module.exports = IIPProxy;



