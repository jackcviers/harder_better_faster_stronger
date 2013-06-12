var jQuery = global.jQuery;
jQuery = jQuery || require('jquery-browserify');
var $ = jQuery;
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var File = require('./Backbone.File.Sync').File;

var MusicFile = Backbone.Model.extend({
  defaults: {
    name: "",
    mimeType: "text/plain",
    size: 0,
    data: ""
  },
  filesystemUrl: "filesystem:/",
  toSerialized: function(){
    return new Blob([this.get('data')], {type: this.get('mimeType')});
  },
  save: function(key, val, options) {
    var attrs, method, xhr, wrapError, attributes = this.attributes;
    wrapError = function (model, options) {
      var error = options.error;
      options.error = function(resp) {
        if (error){ 
          error(model, resp, options);
        }
        model.trigger('error', model, resp, options);
      };
    };
    if (key == null || typeof key === 'object') {
      attrs = key;
      options = val;
    } else {
      (attrs = {})[key] = val;
    }
    if (attrs && (!options || !options.wait) && !this.set(attrs, options)) {
      return false;
    }
    options = _.extend({validate: true}, options);
    if (!this._validate(attrs, options)){ 
      return false;
    }
    if (attrs && options.wait) {
      this.attributes = _.extend({}, attributes, attrs);
    }
    if (options.parse === void 0){ 
      options.parse = true;
    }
    var model = this;
    var success = options.success;
    options.success = function(resp) {
      model.attributes = attributes;
      var serverAttrs = model.parse(resp, options);
      if (options.wait){ 
        serverAttrs = _.extend(attrs || {}, serverAttrs);
      }
      if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
        return false;
      }
      if (success){ 
        success(model, resp, options);
      }
      model.trigger('sync', model, resp, options);
    };
    wrapError(this, options);
    method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
    if (method === 'patch'){ 
      options.attrs = attrs;
    }
    if (attrs && options.wait){
      this.attributes = attributes;
    }
    return this.sync(method, this, options).then(function(successArr){
      options.success(successArr);
      return successArr;
    }, function(err){
      options.error(err);
      return err;
    });
  },
  sync: function() {
    return File.sync.apply(this, arguments);
  }
});

module.exports = MusicFile;
