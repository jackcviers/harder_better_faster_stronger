var global = (typeof window !== 'undefined' && window != null) ? window : global;
var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var File = require('./Backbone.File.Sync').File;
var Player = require('./Player');
var MusicFiles = require('./LocalFiles');
var AudioSource = require('./AudioSource');

var harder_better_faster_stronger = Backbone.Router.extend({
  audioSource: null,
  player: null,
  collection: null,
  routes: {
    //#play/myMusicFile/CoolVis
    'play': 'play',
    'stop': 'stop'
  },
  initialize: function(){
    console.log('initialize');
    this.audioSource = new AudioSource({el: $('#audio-target')}).render();
    this.player = new Player({el: $('app-target')}).render();
    this.collection = new MusicFiles();
    this.listenTo(this.audioSource, 'audiosource:play', this.visualize);
  },
  visualize: function(analyzer){
    console.log('vizualize');
    this.player.visualization.analyzer = analyzer;
    this.player.visualization.startAnimation();
  },
  fileDropped: function(files){
    console.log('fileDropped');
    var file = _.head(files);
    this.collection.create({name: file.name, mimeType: file.type, data: file, size: file.filesize});
    _.each(this.collection.models, function(musicFile){ musicFile.save();});
    this.audioSource.file = file;
  },
  play: function(){
    console.log('play');
    this.audioSource.play();
  },
  stop: function(args){
    console.log('stop');
    this.audioSource.stop();
  }
});

module.exports = harder_better_faster_stronger;

