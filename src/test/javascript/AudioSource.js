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

describe('AudioSource', function(){
  beforeEach(function(done){
    this.instance = {};
    done();
  });
  afterEach(function(done){
    this.instance = {};
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
});
