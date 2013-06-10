var Backbone = require('backbone');

var MusicFile = Backbone.Model.extend({
  defaults: {
    name: "",
    mimeType: "text/plain",
    size: 0
  }
});
module.exports = MusicFile;
