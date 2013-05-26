var global = global || window;
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var should = chai.should();
var _ = require('underscore');
var LocalFileSystem = require('../../main/javascript/LocalFileSystem.js');

var testInBrowserOnly = function(context) {
  return function(testFn) {
    if (window.navigator.userAgent.indexOf('PhantomJS') < 0) {
      testFn.call(context);
    } else {
      return;
    }
  };
}

describe('LocalFileSystem', function() {
  it('should exist', function(done) {
    expect(LocalFileSystem).to.exist
    done();
  });
  it('should be a function', function(done) {
    LocalFileSystem.should.be.an.instanceof(Function);
    done();
  });
  describe('LocalFileSystem("name")', function(){
    beforeEach(function(done){
      this.name = "abcd";
      this.fs = LocalFileSystem(this.name);
      done();
    });
    afterEach(function(done){
      this.name = this.fs = null;
      done();
    });
    it('should return an object with keys name, requestTemporaryFileSystem(), and requestPersistentFileSystem() and Nothing', function(done){
      _.keys(this.fs).should.satisfy(function(arrOfKeys){
        var partialContains = (function(keys){
          return function(str) {
            return _.contains(keys, str);
          };
        }(arrOfKeys));
        return (partialContains("name") && partialContains("requestTemporaryFileSystem") && partialContains("requestPersistentFileSystem"));
      });
      done();
    });
    it('should return an object with name set to the passed value', function(done){
      this.fs.name.should.equal(this.name);
      done();
    });
    describe('.requestTemporaryFileSystem(sizeInMB)', function(){
      it('should be a Function', function(done){
        this.fs.requestTemporaryFileSystem.should.be.an.instanceof(Function);
        done();
      });
      testInBrowserOnly(this)(function(){
        it('should return a promise', function(done) {
          expect(this.fs.requestTemporaryFileSystem(5).then).to.exist
          done();
        });
        it('should resolve to success in a chrome browser', function(done){
          var spy, promiseOfFilesystem, testSpyCall;
          spy = sinon.spy();
          testSpyCall = function() {
            spy.should.have.been.called;
            done();
          };
          promiseOfFilesystem = this.fs.requestTemporaryFileSystem(5);

          promiseOfFilesystem.then(
            function(fsys){spy(); testSpyCall();},
            function(){testSpyCall();}
          );
        });
      });
    });
    describe('.requestPersistentFileSystem(sizeInMB)', function(){
      it('should be a function', function(done){
        this.fs.requestPersistentFileSystem.should.be.an.instanceof(Function);
        done();
      });
      testInBrowserOnly(this)(function(){
        it('should return a promise of a file system', function(done){
          expect(this.fs.requestPersistentFileSystem(5).then).to.exist
          done();
        });
        it('should resolve to success in a chrome browser', function(done){
          var promiseOfFilesystem, spy, testSpyCall;
          spy = sinon.spy();
          testSpyCall = function(){
            spy.should.have.been.called;
            done();
          };
          promiseOfFilesystem = this.fs.requestPersistentFileSystem(5);

          promiseOfFilesystem.then(
            function(){spy(); testSpyCall();},
            function(){ testSpyCall();}
          );
        });
      });
    });
  });
});
