var should = require('should');
var request = require('supertest');
var server = require('../../../app');

process.env.NODE_ENV = 'dummy';

describe('controllers', function() {

  describe('post_hires', function() {

    describe('POST /api/proto/hires/insert', function() {              
      
      it('should return something', function(done) {
        
        request(server)
          .post('/api/proto/hires/insert')
          //.field('path', '/tmp/hires/nils_morten.jpg')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(function(res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toUpperCase();
          })
          .end(function (err, res) { done(); });
      });
      
    });

  });

});
