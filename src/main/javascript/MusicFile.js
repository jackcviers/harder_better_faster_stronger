var Backbone = require('backbone');

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
  }
});
module.exports = MusicFile;
