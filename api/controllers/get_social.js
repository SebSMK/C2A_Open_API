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
  rp = require('request-promise');

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

  var socialhtml = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"> <html>    <head>       <title>kms1</title>       <meta content="utf-8">       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">       <meta name="google" content="notranslate">       <meta property="og:type" content="article"> <meta property="og:url" content="https://www.mediapart.fr/journal/international/201216/issa-amro-israel-sombre-dans-la-folie"> <meta property="og:title" content="Issa Amro: «Israël sombre dans la folie»"> <meta property="og:description" content="Poursuivi en justice par l’armée israélienne, l’activiste palestinien non violent Issa Amro dénonce la droitisation du gouvernement Netanyahou et la dégradation des conditions de vie pour les Palestiniens à Hébron. Il déplore également l’inertie d’un Mahmoud Abbas et d’un Fatah vieillissants."> <meta property="og:image" content="https://static.mediapart.fr/files/2016/12/18/amro-mondo-b.jpg"> <meta property="og:locale" content="fr_FR"> <meta property="og:site_name" content="Mediapart">          <link rel="shortcut icon" href="http://demoapi.smk.dk/images/smk-favicon.png">       <link rel="apple-touch-icon" href="http://demoapi.smk.dk/images/smk.png">       <style type="text/css">body{          width:100%;          height:100%;          margin:0;          padding:0;           font-family: Verdana, Geneva, sans-serif;          }       </style>    </head>    <body>       <div id="map">KMS1</div>       <div id="viewer"><img src="http://iip.smk.dk/iiif/%2Fmnt%2Fdamapistorage%2Fdev%2Fkms1_564af3627fab5_pyr.tif/3112,1788,1838,1544/full/0/default.jpg"/></div>         </body> </html>'
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


