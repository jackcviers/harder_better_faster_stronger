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
var File = require('../../main/javascript/Backbone.File.Sync.js').File;
Backbone = _.extend(Backbone, File);
var when = require('when');
var testInBrowserOnly = require('./testInBrowserOnly.js');
var MusicFile = require('../../main/javascript/MusicFile');
var FileTarget = require('../../main/javascript/FileTarget.js');
var LocalFiles = require('../../main/javascript/LocalFiles.js');

describe('LocalFiles', function(done){
  testInBrowserOnly(this)(function(){
    beforeEach(function(done){
      this.instance = new LocalFiles();
      done();
    });
    afterEach(function(done){
      this.instance = {};
      done();
    });
    it('should exist', function(done){
      expect(LocalFiles).to.exist;
      done();
    });
    it('should be a Function', function(done){
      LocalFiles.should.be.an.instanceof(Function);
      done();
    });
    it('should be a Backbone.Collection', function(done){
      this.instance.should.be.an.instanceof(Backbone.Collection);
      done();
    });
    describe('.model', function(){
      it('should exist', function(done){
        expect(this.instance.model).to.exist;
        done();
      });
      it('should be MusicFile', function(done){
        this.instance.model.should.deep.equal(MusicFile);
        done();
      });
    });
    describe('#create(attrs, options)', function(){
      it('should exist', function(done){
        expect(this.instance.create).to.exist;
        done();
      });
      it('should be a Function', function(done){
        this.instance.create.should.be.an.instanceof(Function);
        done();
      });
      it('should accept an existing model', function(done){
        var stub, model;
        model = new MusicFile();
        stub = sinon.stub(model, "save");
        this.instance.create(model);
        stub.should.have.been.called;
        stub.restore();
        this.instance.remove(this.instance.at(0));
        done();
      });
      it('should accept a raw File object', function(done){
        var stub, model;
        model = {filename: 'test.mp3', filetype: 'image/png'};
        this.instance.create(model);
        done();
      });
    });
  });
});
