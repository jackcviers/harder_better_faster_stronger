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
//todo -- add a file from the MusicFiles. This could get really interesting.
var AudioSource = Backbone.View.extend({
  audioContext: null,
  analyzer: null,
  file: [],
  render: function(){
    var reader, storeBuffer;
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
    reader = new FileReader();
    reader.onload = _.bind(function(event){
      var data = event.target.result;
      if(this.audioContext.decodeAudioData){
        this.source.decodeAudioData(data, _.bind(function(buffer){
          this.source.buffer = buffer;
        }), function(e){});
      } else{
        this.source.buffer = this.audioContext.createBuffer(data, false);
      }
      this.source.connect(this.analyzer);
      this.source.connect(this.audioContext.destination);
      this.source.noteOn(0);
      this.trigger('audiosource:play', this.analyzer);
      this.playing = true;

    }, this);
    if(this.file.fileSize){
      reader.readAsArrayBuffer(this.file);
      
    }
    this.$el.html('<audio id="audio-source"></audio>');
    return this;
  },
  play: function(){
    this.render();
  },
  stop: function(){
    if(this.source && this.playing){
      this.trigger('audiosource:stop', this.analyzer);
      this.source.noteOff(0);
      this.source.disconnect();
    }
    return this;
  },
  source: null
});

module.exports = AudioSource;
