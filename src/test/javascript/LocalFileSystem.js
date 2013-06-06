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
    describe('.getPathAndFilenameFromFilename(filename)', function(){
      beforeEach(function(done){
        this.expectedFilename = "path.ext"
        this.inputFilenameAndPath = ["", "test", "me", "for", this.expectedFilename].join("/");
        this.pathAndFilename = this.fs.getPathAndFilenameFromFilename(this.inputFilenameAndPath);
        this.expectedPathSegments = ["test", "me", "for"];
        done();
      });
      afterEach(function(done){
        this.pathAndFilename = this.pathAndFilename = this.expectedPathSegments = {};
        done();
      });
      it('this.inputFilenameAndPath should be "/test/me/for/path.ext"', function(done){
        this.inputFilenameAndPath.should.equal("/test/me/for/path.ext");
        done();
      });
      it('should exist', function(done){
        expect(this.fs.getPathAndFilenameFromFilename).to.exist;
        done();
      });
      it('should be a function', function(done){
        this.fs.getPathAndFilenameFromFilename.should.be.an.instanceof(Function);
        done();
      });
      it('should return an array', function(done){
        this.pathAndFilename.should.be.an.instanceof(Array);
        done();
      });
      it('should return an array of length 2', function(done){
        this.pathAndFilename.length.should.equal(2);
        done();
      });
      describe('[0]', function(){
        it('should be an array', function(done){
          this.pathAndFilename[0].should.be.an.instanceof(Array);
          done();
        });
        it('should be an array of strings', function(done){
          _.every(this.pathAndFilename[0], function(pathSegment){
            return _.isString(pathSegment);
          }).should.be.true;
          done();
        });
        it('should match the expected array', function(done){
          this.pathAndFilename[0].should.deep.equal(this.expectedPathSegments);
          done();
        });
      });
      describe('[1]', function(done){
        it('shoud be a string', function(done){
          _.isString(this.pathAndFilename[1]).should.be.true;
          done();
        });
        it('should equal the expected filename', function(done){
          this.pathAndFilename[1].should.equal(this.expectedFilename);
          done();
        });
      });
    });
  });
});
