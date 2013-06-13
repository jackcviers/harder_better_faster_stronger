var global = global ||  window;
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
var should = chai.should();
chai.use(sinonChai);
var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = global._;
_ = _ || require('underscore');
var Backbone = global.Backbone;
Backbone = Backbone ||  require('backbone');
Backbone.$ = $
var File = require('../../main/javascript/Backbone.File.Sync.js').File;
Backbone = _.extend(Backbone, File);
var when = require('when');
var testInBrowserOnly = require('./testInBrowserOnly.js');
var fileTarget = require('../../../tmp/templates.js').fileTarget;
var player = require('../../../tmp/templates.js').player;
var Player = require('../../main/javascript/Player.js');
var FileTarget = require('../../main/javascript/FileTarget.js');
var Visualization = require('../../main/javascript/Visualization.js');

describe('Player', function(){
  testInBrowserOnly(this)(function(){
    beforeEach(function(done){
      $('#fixtures').html('<div id="player"></div>');
      this.instance = new Player({el: $('#fixtures #player')});
      done();
    });
    afterEach(function(done){
      this.instance.remove();
      this.instance = {};
      $('#fixtures').html('');
      done();
    });
    it('should exist', function(done){
      expect(Player).to.exist;
      done();
    });
    it('should be a Backbone.View', function(done){
      this.instance.should.be.an.instanceof(Backbone.View);
      done();
    });
    describe('#controls', function(){
      beforeEach(function(done){
        this.instance.render();
        done();
      });
      afterEach(function(done){
        this.instance.fileTarget.remove();
        this.instance.visualization.remove();
        this.instance.controls.remove();
      });
      it('should exist');
      it('should be a Controls instance');
    });
    describe('#delegateEvents', function(){
      it('should exist', function(done){
        expect(this.instance.delegateEvents).to.exist;
        done();
      });
      it('should be a Function', function(done){
        this.instance.delegateEvents.should.be.an.instanceof(Function);
        done();
      });
      it('should be called on render', function(done){
        var spy = sinon.spy(this.instance, "delegateEvents");
        this.instance.render();
        spy.should.have.been.called;
        spy.restore();
        done();
      });
      it('should call listenTo with the #fileTarget and filetarget:filedropped', function(done){
        var spy = sinon.spy(this.instance, "listenTo");
        this.instance.render();
        spy.should.have.been.calledWith(this.instance.fileTarget, 'filetarget:filedropped');
        spy.restore();
        done();
      });
      it('should override and call up to Backbone.View.prototype.delegateEvents', function(done){
        var spy; 
        this.instance.delegateEvents.should.not.deep.equal(Backbone.View.prototype.delegateEvents);
        spy = sinon.spy(Backbone.View.prototype, 'delegateEvents');
        this.instance.render();
        spy.should.have.been.called;
        spy.restore();
        done();
      });
      it('should return the view instance (Be fluent!)', function(done){
        var spy = sinon.spy(this.instance, "listenTo");
        this.instance.delegateEvents({}).should.deep.equal(this.instance);
        spy.restore();
        done();
      });
    });
    describe('#fileDropped(files)', function(){
      it('should exist', function(done){
        expect(this.instance.fileDropped).to.exist;
        done();
      });
      it('should be a function', function(done){
        this.instance.fileDropped.should.be.an.instanceof(Function);
        done();
      });
      it('should trigger a player:filedropped event with the dropped files', function(done){
        var spy, files, check;
        files = [{filename: 'test.mp3', filetype: 'audo/ogg'}];
        spy = sinon.spy();
        check = function(){
          spy.should.have.been.calledWith(files);
          done();
        };
        this.instance.listenTo(this.instance, 'player:filedropped', function(files){spy(files); check();});
        this.instance.fileDropped(files);
      });
    });
    describe('#fileTarget', function(){
      beforeEach(function(done){
        this.instance.render();
        done();
      });
      afterEach(function(done){
        this.instance.fileTarget.remove();
        this.instance.visualization.remove();
        done();
      });
      it('should exist', function(done){
        expect(this.instance.fileTarget).to.exist;
        done();
      });
      it('should be a FileTarget instance', function(done){
        this.instance.fileTarget.should.be.an.instanceof(FileTarget);
        done();
      });
    });
    describe('#render', function(){
      it('should exist', function(done){
        expect(this.instance.render).to.exist;
        done();
      });
      it('should be a Function', function(done){
        this.instance.render.should.be.an.instanceof(Function);
        done();
      });
      it('should return the view instance ("Be fluent!")', function(done){
        this.instance.render().should.deep.equal(this.instance);
        done();
      });
      it('should render something into the fixtures div', function(done){
        this.instance.render();
        $('#fixtures #player').html().should.not.equal('');
        done();
      });
    });
    describe('#template', function(){
      it('should exist', function(done){
        expect(this.instance.template).to.exist;
        done();
      });
      it('should be a Function', function(done){
        this.instance.template.should.be.an.instanceof(Function);
        done();
      });
      it('should be player', function(done){
        this.instance.template.should.deep.equal(player);
        done();
      });
    });
    describe('#visualization', function(){
      beforeEach(function(done){
        this.instance.render();
        done();
      });
      afterEach(function(done){
        this.instance.visualization.remove();
        this.instance.fileTarget.remove();
        done();
      });
      it('should exist', function(done){
        expect(this.instance.visualization).to.exist;
        done();
      });
      it('should be a Visualization view', function(done){
        this.instance.visualization.should.be.an.instanceof(Visualization);
        done();
      });
    });
  });
});
