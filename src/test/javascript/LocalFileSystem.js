if (window.navigator.userAgent.indexOf('PhantomJS') < 0) {
  var global = global || window;
  var chai = require('chai');
  var sinon = require('sinon');
  var sinonChai = require('sinon-chai');
  chai.use(sinonChai);
  var expect = chai.expect;
  var should = chai.should();
  var LocalFileSystem = require('../../main/javascript/LocalFileSystem.js');

  describe('LocalFileSystem', function() {
    it('should exist', function(done) {
      expect(LocalFileSystem).to.exist
      done();
    });
    it('should be a function', function(done) {
      LocalFileSystem.should.be.an.instanceof(Function);
      done();
    });
    it('should return a promise', function(done) {
      var fs = new LocalFileSystem();
      expect(fs.requestTemporaryFileSystem(5).then).to.exist
      done();
    });
    it('should resolve to success in a chrome browser', function(done){
      var fs = new LocalFileSystem("name");
      var spy = sinon.spy();
      try{
        fs.requestTemporaryFileSystem(5).then(function(){spy();}, function(){ spy();});
      }catch(e) {
        console.log('heel no');
      }
      spy.should.have.been.called
      done();
    });
  });
}
