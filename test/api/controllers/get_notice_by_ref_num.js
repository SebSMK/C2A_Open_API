var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('get_notice', function() {

    describe('GET /api/get_notice', function() {
      
      it('should return a default string', function(done) {

        request(server)
          .get('/api/get_notice')          
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            done();
          });
      });   
      
      it('should accept a name parameter', function(done) {

        request(server)
          .get('/api/get_notice')
          .query({ refnum: 'kms1'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            done();
          });
      });
      
    });

  });

});
