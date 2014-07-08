var apiServer = require('../server.js');
var http = require('http');
var fs = require('fs');
var should = require('should');
var assert = require('assert');
var request = require('supertest');  
var winston = require('winston');
 
describe('api', function() {
  var url = 'http://localhost:9000';
  describe('content', function() {
 	    it('should return an 404 for /html/pussinboots/book', function(done){
  			request(url)
  				.get('/api/content/html/pussinboots/book')
          .expect('Content-Type', /text\/html/)
  				.expect(404, 'Error occurred: Error: ENOENT, open \'/ebooks/book.html\'') //Status code
  				.end(function(err,res) {
  					if (err) throw err;
  					done();
  				});
	    });
      it('should return an 200 for /pdf/pussinboots/book', function(done){
        request(url)
          .get('/api/content/pdf/pussinboots/book')
          .expect('Content-Type', /application\/pdf/)
          .expect(200) //Status code
          .end(function(err,res) {
            if (err) throw err;
            done();
          });
      });
      it('should return an 404 for /epub/pussinboots/book', function(done){
        request(url)
          .get('/api/content/epub/pussinboots/book')
          .expect('Content-Type', /application\/epub/)
          .expect(404, 'Error occurred: Error: ENOENT, open \'/ebooks/book.epub\'') //Status code
          .end(function(err,res) {
            if (err) throw err;
            done();
          });
      });
      it('should return an 404 for /mobi/pussinboots/book', function(done){
        request(url)
          .get('/api/content/mobi/pussinboots/book')
          .expect('Content-Type', /application\/mobi/)
          .expect(404, 'Error occurred: Error: ENOENT, open \'/ebooks/book.mobi\'') //Status code
          .end(function(err,res) {
            if (err) throw err;
            done();
          });
      });

	});
});
