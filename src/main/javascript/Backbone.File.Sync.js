var when = require('when');
var LocalFileSystem = require('./LocalFileSystem');

module.exports = {
  File: { 
    sync: function(method, model, options){
      var deferred, promise;
      deferred = when.defer();
      promise = deferred.promise;
      return promise;
    }
  }
};
