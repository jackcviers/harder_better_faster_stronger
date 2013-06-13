var global = (typeof window !== 'undefined' && window != null) ? window : global;
var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var controls = require('../../../tmp/templates.js').controls;

var Controls = Backbone.View.extend({
  template: controls,
  render: function(){
    this.$el.html(this.template());
    return this;
  }
});

module.exports = Controls;
