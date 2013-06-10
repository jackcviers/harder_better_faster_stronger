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
var testInBrowserOnly = require('./testInBrowserOnly.js');
var MusicFile = require('../../main/javascript/MusicFile');

describe('MusicFile', function(){
  testInBrowserOnly(this)(function(){
    it('should exist', function(done){
      expect(MusicFile).to.exist;
      done();
    });
    it('should be a Function', function(done){
      MusicFile.should.be.an.instanceof(Function);
      done();
    });
    describe('new MusicFile', function(){
      beforeEach(function(done){
        this.instance = new MusicFile();
        done();
      });
      afterEach(function(done){
        this.instance = {};
        done();
      });
      it('should be a Backbone.Model', function(done){
        this.instance.should.be.an.instanceof(Backbone.Model);
        done();
      });
      describe('#get("name")', function(){
        it('should exist', function(done){
          this.instance.has('name').should.be.true;
          done();
        });
        it('should be a string', function(done){
          this.instance.get('name').should.equal('');
          done();
        });
      });
      describe('#get("mimeType")', function(){
        it('should exist', function(done){
          this.instance.has('mimeType').should.be.true;
          done();
        });
        it('should be text/plain by default', function(done){
          this.instance.get('mimeType').should.equal("text/plain");
          done();
        });
      });
      describe('size', function(done){
        it('should exist', function(done){
          this.instance.has('size').should.be.true;
          done();
        });
      });
    });
  });
});