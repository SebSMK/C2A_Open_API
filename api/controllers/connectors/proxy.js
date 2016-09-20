var proxy = {

  validateRequest: function(params, config){            
      /*
      if( Object.prototype.toString.call( params ) !== '[object Array]' ||
          params.length == 0)
        return false;                
      */
      for (var p in params){
         var paramPrefix = p.split('.')[0]; // invalidate not just "stream", but "stream.*"
         if (config.proxy.options.invalidParams.indexOf(paramPrefix) > -1)
          return false;
       }
      
      return true;        
      
  }
}  

module.exports = proxy;	