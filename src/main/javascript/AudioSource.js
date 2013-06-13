var global = (typeof window !== 'undefined' && window != null) ? window : global;
var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var File = require('./Backbone.File.Sync').File;
// There can be only one!!!
var AudioContext = (global.AudioContext || global.webkitAudioContext);
var audioContext = new AudioContext();
var analyser = audioContext.createAnalyser();

var AudioSource = Backbone.View.extend({
  audioContext: null,
  analyzer: null,
  render: function(){
    if(this.audioContext === null){
      // create the audio context
      this.audioContext = audioContext;
    }
    if(this.analyzer === null) {
      this.analyzer = analyser;
      this.analyzer.smoothingTimeConstant = 0.8;
      this.analyzer.fftSize = 512;
    }
    this.source = this.audioContext.createBufferSource();
    
    this.$el.html('<audio id="audio-source"></audio>');
    return this;
  },
  source: null
});

module.exports = AudioSource;
