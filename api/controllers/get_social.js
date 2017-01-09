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
  rp = require('request-promise'),
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
module.exports = {
  getsocial: getsocial
};

function getsocial(req, res) {

 var iiiflink = decodeURI(req.swagger.params.refnum.value);
 var url = req.url;
 var host = req.headers.host;
 var image = 'http%3A%2F%2Fiip.smk.dk%2Fiiif%2F%252Fmnt%252Fdamapistorage%252Fdev%252Fkms1_564af3627fab5_pyr.tif%2F3112%2C1788%2C1838%2C1544%2F400%2C%2F0%2Fdefault.jpg';  
 image = (iiiflink);
 var socialhtmlTemplate = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">  <html>    <head>       <title>%1$s</title>              <meta content="utf-8">       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">       <meta name="google" content="notranslate">             <meta property="og:image" content="%1$s">       <meta property="og:url" content="http://%3$s%4$s">                    <meta property="og:title" content="%1$s">                   <meta property="og:site_name" content="SMK">       <link rel="shortcut icon" href="http://demoapi.smk.dk/images/smk-favicon.png">       <link rel="apple-touch-icon" href="http://demoapi.smk.dk/images/smk.png">       <style type="text/css">body{          width:100%%;          height:100%%;          margin:0;          padding:0;           font-family: Verdana, Geneva, sans-serif;          }       </style>    </head>    <body>       <div id="map">%1$s</div>       <div id="viewer"><img src="%2$s"/></div>    </body> </html> ';
  
 var socialhtml = sprintf(socialhtmlTemplate, iiiflink, image, host, url);
  
 res.send(socialhtml);
  /*
  var config = {
    IIP:{
      Server: "http://demoapi.smk.dk",
      Port: "80",
      Path: "zoom/osd"
    }      
  }
  
  var id = req.swagger.params.refnum.value;
  
  var uri = util.format('%s:%s/%s/%s', config.IIP.Server, config.IIP.Port, config.IIP.Path, id);
  
  rp(uri)
    .then(function (htmlString) {
        console.log(htmlString);
        res.send(htmlString);
    })
    .catch(function (error) {
        console.log(error);
        res.status(500).json({error:error});
    });*/   
}


