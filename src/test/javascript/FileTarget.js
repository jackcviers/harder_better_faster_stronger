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
var FileTarget = require('../../main/javascript/FileTarget.js');
var when = require('when');
var testInBrowserOnly = require('./testInBrowserOnly.js');
var fileTarget = require('../../../tmp/templates.js').fileTarget;


describe('FileTarget', function(){
  testInBrowserOnly(this)(function(){
    beforeEach(function(done){
      $('#fixtures').html('<div id="file-target"></div>');
      this.instance = new FileTarget({el: $('#fixtures #file-target')});
      done();
    });
    afterEach(function(done){
      this.instance.remove();
      done();
    });
    it('should exist', function(done){
      expect(FileTarget).to.exist
      done();
    });
    it('should be a Function', function(done){
      FileTarget.should.be.an.instanceof(Function);
      done();
    });
    it('should be a Backbone.View', function(done){
      this.instance.should.be.an.instanceof(Backbone.View);
      done();
    });
    describe('#events', function(){
      it('should exist', function(done){
        expect(this.instance.events).to.exist;
        done();
      });
      describe('#drop', function(){
        it('should exist', function(done){
          expect(this.instance.events['drop']).to.exist;
          done();
        });
        it('should be fileDropped', function(done){
          this.instance.events['drop'].should.equal('fileDropped');
          done();
        });
      });
    });
    describe('#fileDropped(event)', function(){
      it('should exist', function(done){
        expect(this.instance.fileDropped).to.exist;
        done();
      });
      it('should be a Function', function(done){
        this.instance.fileDropped.should.be.an.instanceof(Function);
        done();
      });
      it('should fire a filetarget:filedropped event, with the dropped file', function(done){
        var mockEvent, spy, check;
        spy = sinon.spy();
        mockEvent = {
          originalEvent:{
            dataTransfer: {
              files: [{filename: 'test.mp3', filetype: 'image/png'}]
            },
            stopImmediatePropagation: sinon.spy(),
            preventDefault: sinon.spy()
          },
          stopImmediatePropagation: sinon.spy(),
          preventDefault: sinon.spy()
        };
        check = function(){
          mockEvent.stopImmediatePropagation.should.have.been.called;
          mockEvent.preventDefault.should.have.been.called;
          mockEvent.originalEvent.stopImmediatePropagation.should.have.been.called;
          mockEvent.originalEvent.preventDefault.should.have.been.called;
          spy.should.have.been.calledWith(mockEvent.originalEvent.dataTransfer.files);
          done();
        };
        this.instance.listenTo(this.instance, 'filetarget:filedropped', function(files){ spy(files); check();});
        this.instance.fileDropped(mockEvent);
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
        $('#fixtures #file-target').html().should.not.equal('');
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
      it('should be fileTarget', function(done){
        this.instance.template.should.deep.equal(fileTarget);
        done();
      });
    });
  });
});
