var global = global || window;
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var should = chai.should();
var _ = require('underscore');
var LocalFileSystem = require('../../main/javascript/LocalFileSystem.js');
var when = require('when');
var callbacks = require('when/callbacks');
var testInBrowserOnly = require('./testInBrowserOnly.js');
describe('LocalFileSystem', function() {
  it('should exist', function(done) {
    expect(LocalFileSystem).to.exist
    done();
  });
  describe('LocalFileSystem("name")', function(){
    beforeEach(function(done){
      this.name = "abcd";
      this.fs = LocalFileSystem;
      done();
    });
    afterEach(function(done){
      this.name = this.fs = null;
      done();
    });
    describe('.createDirectoryFromPath(filesystem)(filepath)', function(){
      it('should exist', function(done){
        expect(this.fs.createDirectoryFromPath).to.exist;
        done();
      });
      describe('.createDirectoryFromPath(this.fs)', function(){
        testInBrowserOnly(this)(function(){
          beforeEach(function(done){
            this.expectedFilename = "path.ext"
            this.inputFilenameAndPath = ["", "test", "me", "for", this.expectedFilename].join("/");
            this.pathAndFilename = this.fs.getPathAndFilenameFromFilename(this.inputFilenameAndPath);
            this.expectedPathSegments = ["test", "me", "for"];
            this.promise = this.fs.requestTemporaryFileSystem(5);
            this.promise.then((function(context) { 
              return function(filesystem){
                context.boundDirectoryCreator = context.fs.createDirectoryFromPath(filesystem);
                done();
              };
            }(this)), function(err){ done();});
          });
          afterEach(function(done){
            this.boundDirectoryCreator = this.expectedFilename, this.inputFilenameAndPath, this.pathAndFilename, this.expectedPathSegments = {};
            done();
          });
          it('should return a function', function(done){
            this.boundDirectoryCreator.should.be.an.instanceof(Function);
            done();
          });
          it('should return a promise of a directory', function(done){
            expect(this.boundDirectoryCreator(this.pathAndFilename[0]).then).to.exist;
            done();
          });
          it('should create the directory /test/me/for', function(done){
            var spy, promise, check;
            this.timeout(30000);
            spy = sinon.spy();
            check = function(){
              spy.should.have.been.called;
              done();
            };
            promise = this.boundDirectoryCreator(this.pathAndFilename[0]);
            promise.then(function(directory){ spy(); check();}, function(err){ check();});
          });
        });
      });
    });
    describe('.getFileEntry(filesystem)(fullfilepath)(create)', function(){
      testInBrowserOnly(this)(function(){
        beforeEach(function(done){
          this.expectedFilename = "path.ext"
          this.inputFilenameAndPath = ["", "test", "me", "for", this.expectedFilename].join("/");
          this.pathAndFilename = this.fs.getPathAndFilenameFromFilename(this.inputFilenameAndPath);
          this.expectedPathSegments = ["test", "me", "for"];
          this.promise = this.fs.requestTemporaryFileSystem(5);
          this.promise.then((function(context) { 
            return function(filesystem){
              context.boundDirectoryCreator = context.fs.createDirectoryFromPath(filesystem);
              context.boundFileEntryFetcher = context.fs.getFileEntry(filesystem);
              done();
            };
          }(this)), function(err){done();});
        });
        afterEach(function(done){
          this.boundDirectoryCreator = this.boundFileEntryFetcher = this.expectedFilename, this.inputFilenameAndPath, this.pathAndFilename, this.expectedPathSegments = {};
          done();
        });
        it('should exist', function(done){
          expect(this.fs.getFileEntry).to.exist
          done();
        });
        it('should return a promise', function(done){
          expect(this.boundFileEntryFetcher(this.inputFilenameAndPath)(true).then).to.exist
          done();
        });
        it('should create a file entry', function(done){
          var promise, check, spy;
          this.timeout(10000);
          spy = sinon.spy();
          check = function(){
            spy.should.have.been.called;
            done();
          };
          promise = this.boundFileEntryFetcher(this.inputFilenameAndPath)(true);
          promise.then(function(fileEntry){
            spy();
            check();
          }, function(err){ check();});
        });
        it('should get an existing fileEntry', function(done){
          var promise, check, spy;
          this.timeout(10000);
          spy = sinon.spy();
          check = function() {
            spy.should.have.been.called;
            done();
          };
          var creatorReader = this.boundFileEntryFetcher(this.inputFilenameAndPath);
          promise = creatorReader(true);
          promise.then(function(fileEntry){
            var deferred, promise;
            deferred = when.defer();
            promise = deferred.promise;
            fileEntry.createWriter(function(writer){
              deferred.resolve(writer);
            }, function(err){
              deferred.reject(err);
            });
            return promise;
          }, function(err){ check(); }).then(function(writer){
            var deferred, promise;
            deferred = when.defer();
            promise = deferred.promise;
            writer.onwriteend = function(event){
              deferred.resolve(event);
            };
            writer.onerror = function(err){
              deferred.reject(err);
            };
            writer.write(new Blob(['Test'], {type: 'text/plain'}));
            return promise;
          }, function(err){}).then(function(writer){
            return creatorReader(false);
           }, function(err){ check(); }).then(function(fileEntry){
             spy();
             check();
           }, function(err){
             check();
           });
        });
      });
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
    describe('.resolveFilesystemUri', function(){
      testInBrowserOnly(this)(function(){
        beforeEach(function(done){
          LocalFileSystem.requestPersistentFileSystem(5).then(function(fs){
            return LocalFileSystem.getFileEntry(fs)('/test/text.txt')(true);
          }, function(err){
            done();
          }).then(function(fileEntry){
            var deferred, promise;
            deferred = when.defer();
            promise = deferred.promise;
            fileEntry.createWriter(function(writer){
              deferred.resolve(writer);
            }, function(err){ deferred.reject(err);})
            return promise;
          }, function(err){ done(); }).then(function(writer){
            var deferred, promise;
            deferred = when.defer();
            promise = deferred.promise;
            writer.onwriteend = function(event) {
              deferred.resolve(event);
            };
            writer.onerror = function(err) {
              deferred.reject(err);
            };
            writer.write(new Blob(['test'], {type: 'text/plain'}));
            return promise;
          }, function(err){ done();}).then(function(event){
            done();
          }, function(err){});
        });
        afterEach(function(done){
          done();
        });
        it('should exist', function(done){
          expect(LocalFileSystem.resolveFilesystemUri).to.exist;
          done();
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
