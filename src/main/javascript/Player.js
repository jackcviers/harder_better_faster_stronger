var global = (typeof window !== 'undefined' && window != null) ? window : global;
var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var File = require('./Backbone.File.Sync').File;
var templates = require('../../../tmp/templates.js');
var fileTarget = templates.fileTarget;
var FileTarget = require('./FileTarget');
var Visualization = require('./Visualization');
var Controls = require('./Controls');
var player = templates.player;

var Player = Backbone.View.extend({
  controls: null,
  delegateEvents: function(){
    if(this.fileTarget){
      this.listenTo(this.fileTarget, 'filetarget:filedropped', this.fileDropped);
    }
    return Backbone.View.prototype.delegateEvents.apply(this, arguments);
  },
  fileDropped: function(files){
    this.trigger('player:filedropped', files);
  },
  fileTarget: null,
  template: player,
  render: function(){
    this.undelegateEvents();
    if(this.fileTarget){
      this.fileTarget.remove();
    }
    if(this.visualization){
      this.visualization.remove();
    }
    if(this.controls){
      this.controls.remove();
    }
    this.$el.html(this.template());
    this.fileTarget = new FileTarget({el: this.$('.file-target-container', this.$el)}).render();
    this.visualization = new Visualization({el: this.$('.visualization-container', this.$el)}).render();
    this.controls = new Controls({el: this.$('.controls-container', this.$el)}).render();
    this.delegateEvents(this.events);
    return this;
  },
  visualization: null
});

module.exports = Player;

