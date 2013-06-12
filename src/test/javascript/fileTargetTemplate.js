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
fileTarget = require('../../../tmp/templates.js').fileTarget;

describe('templates', function(){
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
  })
});
