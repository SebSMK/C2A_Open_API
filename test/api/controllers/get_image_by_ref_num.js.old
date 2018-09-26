var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('get_image', function() {

    describe('GET /api/get_image', function() {              
      
      it('should accept a reference parameter', function(done) {

        request(server)
          .get('/api/get_image')
          .query({ refnum: 'kms1'})
          .set('Accept', 'application/json')
          .expect('Content-Type', 'image/jpeg')
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            done();
          });
      });
      
    });

  });

});
