var global = global ||  window;
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
var should = chai.should();
chai.use(sinonChai);
var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery.$;
var _ = global._;
_ = _ || require('underscore');
var Backbone = global.Backbone;
Backbone = Backbone ||  require('backbone');
Backbone.$ = $
var File = require('../../main/javascript/Backbone.File.Sync.js');
Backbone = _.extend(Backbone, File);
var when = require('when');

describe('Backbone', function(){
  describe('.File', function(){
    it('should exist', function(done){
      expect(Backbone.File).to.exist
      done()
    });
    describe('.sync(method, model, options)', function(){
      // stubbing out the actual browser file system api is kind of a big job.
      // we'll stub Backbone.File.sync to call success instead.
      it('should be a function', function(done){
        Backbone.File.sync.should.be.an.instanceof(Function);
        done();
      });
      describe('writing with sync should return a promise', function(){
        beforeEach(function(done){
          this.stub = sinon.stub(Backbone.File, "sync", function(){
            var deferred, promise;
            deferred = when.defer();
            promise = deferred.promise;
            deferred.resolve({name: 'filename', data: []});
            return promise;
          });
          done();
        });

        afterEach(function(done){
          Backbone.File.sync.restore();
          done();
        });

        it('should return a promise', function(done){
          expect(Backbone.File.sync({}).then).to.exist
          done()
        });

        it('should resolve the promise on success, with a file object,', function(done) {
          Backbone.File.sync({}).inspect().state.should.equal("fulfilled");
          done();
        });
      });
    });
  });
});
