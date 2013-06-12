var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var File = require('./Backbone.File.Sync').File;
var fileTarget = require('../../../tmp/templates.js').fileTarget;

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
  },
  template: fileTarget,
  render: function() {
    this.$el.html(this.template());
    return this;
  }
});

module.exports = FileTarget;
