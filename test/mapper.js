var rekuire = require('rekuire');
var expect = rekuire('chai').expect;
var rest = rekuire('src/util/rest');
var mapper = rekuire('src/mapper');

describe("Mappper", function () {   

    it("should map an HTTP GET with a string and headers", function (done) {
        var mappings = {
            '/test': {
                headers: {'test-header': 'test'},
                data: 'Hello world'
            }
        }
        mapper.start(8080, mappings, function() {
            rest.get('http://localhost:8080/test', function(data, response) {
                expect(response.statusCode).to.equal(200);
                expect(response.headers).to.have.property('test-header').and.equal('test');
                expect(data).to.equal('Hello world');
                mapper.stop(done);
            });
        });           
    });

    it("should map an HTTP GET with json and headers", function (done) {
        var mappings = {
            '/test': {
                headers: {'test-header': 'test'},
                data: {
                    test: "test"
                }
            }
        }
        mapper.start(8080, mappings, function() {
            rest.get('http://localhost:8080/test', function(data, response) {
                expect(response.statusCode).to.equal(200);
                expect(response.headers).to.have.property('test-header').and.equal('test');
                expect(response.headers).to.have.property('content-type').and.contain('application/json');
                expect(data).to.have.property('test').and.equal('test');
                mapper.stop(done);
            });
        });           
    });

    it("should map an HTTP GET with wilcards", function (done) {
        var mappings = {
            '/test/:whatever': {
                headers: {'test-header': 'test'},
                data: {
                    test: "test"
                }
            }
        }
        mapper.start(8080, mappings, function() {
            rest.get('http://localhost:8080/test/jkfdjldskfjlk', function(data, response) {
                expect(response.statusCode).to.equal(200);
                expect(response.headers).to.have.property('test-header').and.equal('test');
                expect(response.headers).to.have.property('content-type').and.contain('application/json');
                expect(data).to.have.property('test').and.equal('test');
                mapper.stop(done);
            });
        });           
    });

    it("should return an error for unspecified mappings", function (done) {
        var mappings = {
            '/test': {
                headers: {'test-header': 'test'},
                data: {
                    test: "test"
                }
            }
        }
        mapper.start(8080, mappings, function() {
            rest.get('http://localhost:8080/notest', function(data, response) {
                expect(response.statusCode).to.equal(404);
                expect(data).to.equal('unknown mapping');
                mapper.stop(done);
            });
        });           
    });
});    
