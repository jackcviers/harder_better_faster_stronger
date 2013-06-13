var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var visualization = require('../../../tmp/templates.js').visualization;

var Visualization = Backbone.View.extend({
  render: function(){
    this.$el.html(this.template());
    return this;
  },
  template: visualization
});

module.exports = Visualization;
