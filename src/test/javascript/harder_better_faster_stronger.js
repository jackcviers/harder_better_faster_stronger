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
var AudioSource = require('../../main/javascript/AudioSource.js');
var Player = require('../../main/javascript/Player.js');
var harder_better_faster_stronger = require('../../main/javascript/harder_better_faster_stronger.js');

describe('harder_better_faster_stronger', function(){
  testInBrowserOnly(this)(function(){
    beforeEach(function(done){
      $('#fixtures').html('<div id="#audio-target"></div><div id="#app-target"></div>');
      Backbone.history.start();
      this.instance = new harder_better_faster_stronger();
      done();
    });
    afterEach(function(done){
      $('#fixtures').html('');
      Backbone.history.stop();
      this.instance = {};
      done();
    });
    it('should exist', function(done){
      expect(harder_better_faster_stronger).to.exist;
      done();
    });
    it('should be a Backbone.Router', function(done){
      this.instance.should.be.an.instanceof(Backbone.Router);
      done();
    });
    describe('#audioSource', function(){
      it('should exist', function(done){
        expect(this.instance.audioSource).to.exist;
        done();
      });
      it('should be an AudioSource instance', function(done){
        this.instance.audioSource.should.be.an.instanceof(AudioSource);
        done();
      });
    });
    describe('#visualize', function(){
      it('should exist', function(done){
        expect(this.instance.visualize).to.exist;
        done();
      });
      it('should be a Function', function(done){
        this.instance.visualize.should.be.an.instanceof(Function);
        done();
      });
    });
    describe('#player', function(){
      it('should exist', function(done){
        expect(this.instance.player).to.exist;
        done();
      });
      it('should be a Player instance.', function(done){
        this.instance.player.should.be.an.instanceof(Player);
        done();
      });
    });
    describe('#play', function(){
      it('should exist', function(done){
        expect(this.instance.play).to.exist;
        done();
      });
      it('should be a Function', function(done){
        this.instance.play.should.be.an.instanceof(Function);
        done();
      });
    });
    describe('#stop', function(){
      it('should exist', function(done){
        expect(this.instance.stop).to.exist;
        done();
      });
      it('should be a Function', function(done){
        this.instance.stop.should.be.an.instanceof(Function);
        done();
      });
    });
    describe('#fileDropped', function(){
      it('should be a Function', function(done){
        expect(this.instance.fileDropped).to.exist;
        done();
      });
      it('should be called when the player emits a player:filedropped event', function(done){
        this.instance.fileDropped.should.be.an.instanceof(Function);
        done();
      });
    });
  });
});
