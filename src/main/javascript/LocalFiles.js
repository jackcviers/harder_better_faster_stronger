var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var File = require('./Backbone.File.Sync').File;
var MusicFile = require('./MusicFile');

var LocalFiles = Backbone.Collection.extend({
  url: function(){
    return 'filesystem:';
  },
  model: MusicFile
});

module.exports = LocalFiles;
