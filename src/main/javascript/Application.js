var global = (typeof window !== 'undefined' && window != null) ? window : global;
var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var harder_better_faster_stronger = require('./harder_better_faster_stronger');

$(function(){
  var application = new harder_better_faster_stronger();
  Backbone.History.start();
});
