'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  
  /** WARNING !!!!
   * see: http://stackoverflow.com/questions/34234666/swagger-generated-nodejs-error-request-entity-too-large/39290729#39290729
   * We've hacked:
   * /node_modules\swagger-express-mw\node_modules\swagger-node-runner\node_modules\swagger-tools\middleware\swagger-metadata.js
   * 
   *   limit:'10mb'
   *   was added to
   *   var textBodyParserOptions   
  **/
   
  // Add swagger-ui (This must be before swaggerExpress.register)
  app.use(SwaggerUi(swaggerExpress.runner.swagger));
  
 
  
          
  // install middleware
  swaggerExpress.register(app);
  
      

  var port = process.env.NODE_ENV != "production" ? 10011 : process.env.PORT || 10010;
  console.log('OpenAPI started in ' + process.env.NODE_ENV + ' mode on port ' + port)
  app.listen(port);  
});
