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
var AudioContext = global.AudioContext || global.webkitAudioContext;

describe('AudioSource', function(){
  testInBrowserOnly(this)(function(){
    beforeEach(function(done){
      $('#fixtures').html('<div id="audio-source-container"></div>');
      this.instance = new AudioSource({el: $('#fixtures #audio-source-container')});
      done();
    });
    afterEach(function(done){
      this.instance.remove();
      $('#fixtures').html('');
      done();
    });
    it('should exist', function(done){
      expect(AudioSource).to.exist;
      done();
    });
    it('should be a Backbone.View', function(done){
      this.instance.should.be.an.instanceof(Backbone.View);
      done();
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
        $('#fixtures #audio-source-container').html().should.not.equal('');
        done();
      });
    });
    describe('#audioContext', function(){
      beforeEach(function(done){
        this.instance.render();
        done();
      });
      afterEach(function(done){
        this.instance.remove();
        done();
      });
      it('should exist', function(done){
        expect(this.instance.audioContext).to.exist;
        done();
      });
      it('should be an AudioContext or a webkitAudioContext', function(done){
        this.instance.audioContext.should.be.an.instanceof(AudioContext);
        done();
      });
    });
  });
});
