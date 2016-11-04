'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

var rp = require('request-promise'),
atob = require('atob');


function post2OCR(req, res) {
//!!!!! see also: https://github.com/felixrieseberg/project-oxford !!!!!!!!!!
//!!!! a complete npm package to MS Cognitive Systems !!!!!!!!
  
  var params = req.body;

  //var imgB64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAACOklEQVRYw+3VT0gUYRzG8ccNNliIQhT00NJhD+7BwOjPLeZaGFEIEaa4hRQd4gWhU2RghyAQCaKlqxhECy0RgoomBhFFRJdAoj9CYSnEmEpLbX47vDM77+xeO3SY5/a+O++H953f752VkiRJkiTJP8/eW282+bV0v7tJUpcJ0i4pHQ7ydrpL2m0nstHydJEwM62SCQdnJHWFgwE7baSbAKxkImCCKM9TEXBDUqEBSK8AcCVa7+HmdAQ8ljTWAPQAsNEcAXcAuNTZV7GrasAnSfMNwDQAY84bnAJYknQPYNUCbwF2SD7w3gWyWwBV5xVqDmBtuzTs+77/3QKP1oFD2gN8mXeBEQDG3RqOA/DsSDoYG4DyAjCo40DJBYY+A9DpAheCU/540L8zAkaBMQ0Dl11gFoDJWBdlPtRKsHk77INyLzCnh8BhF9gCwIv3Ye5VVMVvBwKgA1jRR6hmXMCmu66Tt52a/RP+9nWXBVLrQA54LRdYtO3WeBta+ksVKwxZQAvANaAYA65uNJ7B8zzP2y+1lAAoB8Ao8A4YiAHmrr0zLvAzbKR2AJ4GQG9wpnwc2GdnDzrAIkC1TWoFYCoAOuyTflMc0Au7Twew9+Vl34knAFwPgNQ6ANOqAwrhxmrJ/3ZvYyUbAFoAYKQeyPgATDhbcCvMOYWA3dnReiCYr+Yc4exauHz5pGpAHwAtDUDePlp0C9E8NLMKy5ODmfCbeExqM8aY85J64t9EFYwxxlxM/kqSJEmS5H/LXw/tL7IM9UBNAAAAAElFTkSuQmCC';
  var blob = makeblob(req.body);
  
  var options = {
    method: 'POST',
    uri: 'https://api.projectoxford.ai/vision/v1.0/ocr?language=unk&detectOrientation=true',
    
    headers: {
        'User-Agent': 'Request-Promise',
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': 'fcf82305ae3f44fa81f14a1de95d0ef4',        
    },
    'body': blob       
  };
    
  
  rp(options)  
  .then(function (parsedBody) {
      console.log(parsedBody);
      var qsolr = extractMSOCRResult(JSON.parse(parsedBody));
      //res.json(JSON.parse('{"res":"' + qsolr.join() + '"}'));      
      
      
      var smkOptions = {
        method: 'POST',
        uri: 'http://172.20.1.203:10011/api/solr',
        
        headers: {            
            'Content-Type': 'application/json',                    
        },
        'body': '{"q":"' + qsolr.join(" ") + '","start":0,"rows":1,"fl":"id, title_first","defType":"edismax","qf":"collectorExact1^150 collectorExact2^30 collectorExact3^20 collector1^20 collector2^15 collector3^10 collector4^5"}'       
      };
      
      return rp(smkOptions);
         
  })
  .then(function (parsedBody) {
      console.log(parsedBody);
      res.json(JSON.parse(parsedBody));     
   })  
  .catch(function (error) {        
    console.log(error);
    res.status(error.status).json(error);        
  });         
}

  /***
 *  PRIVATE FUNCTIONS
 **/

function extractMSOCRResult(ocroutput){
  var result = [];
  if(ocroutput.hasOwnProperty('regions')){
    var regions = ocroutput.regions; 
    regions.forEach(function(item, index){        
      if(regions[index].hasOwnProperty('lines')) {
        var lines = regions[index].lines;
        lines.forEach(function(item, index){
          if(lines[index].hasOwnProperty('words')) {
            var words = lines[index].words;
            words.forEach(function(item, index){
              var word = words[index];
              if(word.hasOwnProperty('text'))
                result.push(word.text);
            })                       
          }  
        })         
      }          
    })
  }
    
  return result;      
}



function makeblob (dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        //return new Blob([raw], { type: contentType });
        return new Buffer(raw);
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    //return new Blob([uInt8Array], { type: contentType });
    return new Buffer(uInt8Array);
}

module.exports = {
  post2OCR: post2OCR
};


