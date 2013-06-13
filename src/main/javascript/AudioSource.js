var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var File = require('./Backbone.File.Sync').File;

var AudioSource = Backbone.View.extend({
  render: function(){
    this.$el.html('<audio id="audio-source"></audio>');
    return this;
  }
});

module.exports = AudioSource;
