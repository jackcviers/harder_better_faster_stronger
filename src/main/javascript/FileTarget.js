var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var File = require('./Backbone.File.Sync').File;

var FileTarget = Backbone.View.extend({
  events: {
    'drop': 'fileDropped'
  },
  fileDropped: function(event) {
    var originalEvent = event.originalEvent;
    originalEvent.stopImmediatePropagation();
    originalEvent.preventDefault();
    event.stopImmediatePropagation();
    event.preventDefault();
    this.trigger('filetarget:filedropped', originalEvent.dataTransfer.files);
  }
});

module.exports = FileTarget;
