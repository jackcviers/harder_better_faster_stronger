var global = global ||  window;
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
var should = chai.should();
chai.use(sinonChai);
global.Handlebars = require('handlebars');
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
var templates = require('../../../tmp/templates.js');
var fileTarget = templates.fileTarget;
var player = templates.player;
var visualization = templates.visualization;
var controls = templates.controls;

describe('templates', function(){
  describe('.controls()', function(){
    beforeEach(function(done){
      $('#fixtures').html('');
      done();
    });
    afterEach(function(done){
      $('#fixtures').html('');
      done();
    });
    it('should exist', function(done){
      expect(controls).to.exist;
      done();
    });
    it('should be a function', function(done){
      controls.should.be.an.instanceof(Function);
      done();
    });
    it('should output the expected html', function(done){
      var expectedHtml = '<a href="#play" class="btn btn-small btn-primary offset4 span1" title="Play">\n' +
        '  <span class="fui-play"></span>\n' +
        '</a>\n' +
        '<a href="#stop" class="btn btn-small btn-primary span1" title="Stop">\n' +
        '  <span class="fui-checkbox-unchecked"></span>\n' +
        '</a>';
      controls().should.equal(expectedHtml);
      done();
    });
  });
  describe('.fileTarget()', function(){
    beforeEach(function(done){
      $('#fixtures').html('');
      done();
    });
    afterEach(function(done){
      $('#fixtures').html('');
      done();
    });
    it('should exist', function(done){
      expect(fileTarget).to.exist;
      done();
    });
    it('should be a function', function(done){
      fileTarget.should.be.an.instanceof(Function);
      done();
    });
    it('should output the expected html', function(done){
      var expectedHtml = '<div class="file-target"></div>';
      fileTarget().should.equal(expectedHtml);
      done();
    });
  });
  describe('.player()', function(){
    beforeEach(function(done){
      $('#fixtures').html('');
      done();
    });
    afterEach(function(done){
      $('#fixtures').html('');
      done();
    });
    it('should exist', function(done){
      expect(player).to.exist;
      done();
    });
    it('should be a function', function(done){
      player.should.be.an.instanceof(Function);
      done();
    });
    it('should output the expected html', function(done){
      var expectedHtml;
      expectedHtml = '<div class="player container-fluid">\n' +
        '  <div class="row-fluid">\n' + 
        '    <div class="span2">\n' + 
        '      <div class="file-target-container row-fluid"></div>\n' + 
        '    </div>\n' + 
        '    <div class="span10">\n' + 
        '      <div class="visualization-container row-fluid"></div>\n' + 
        '      <div class="controls-container row-fluid">\n' + 
        '    </div>\n' + 
        '  </div>\n' + 
        '</div>';
      player().should.equal(expectedHtml);
      done();
    });
  });
  describe('.visualization()', function(){
    it('should exist', function(done){
      expect(visualization).to.exist;
      done();
    });
    it('should be a function', function(done){
      visualization.should.be.an.instanceof(Function);
      done();
    });
    it('should output the expected html', function(done){
      var expectedHtml = '<canvas class="visualization-context span12"></canvas>';
      visualization().should.equal(expectedHtml);
      done();
    });
  });
});
