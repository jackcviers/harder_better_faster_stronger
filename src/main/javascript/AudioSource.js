var global = (typeof window !== 'undefined' && window != null) ? window : global;
var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var File = require('./Backbone.File.Sync').File;
var AudioContext = global.AudioContext || global.webkitAudioContext;

var AudioSource = Backbone.View.extend({
  audioContext: null,
  render: function(){
    if(this.audioContext === null){
      this.audioContext = new AudioContext();
    }
    this.$el.html('<audio id="audio-source"></audio>');
    return this;
  }
});

module.exports = AudioSource;
