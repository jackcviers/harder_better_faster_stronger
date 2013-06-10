var when = require('when');
var LocalFileSystem = require('./LocalFileSystem');
var uuid = require('node-uuid');

module.exports = {
  File: { 
    // for this sync, we are assuming that models
    // exist in collections modeling
    // a file system. Therefore, we
    // check for the Collection's fs
    // instance before doing anything
    // and reject the promise if something
    // is amiss.
    sync: function(method, model, options){
      var deferred, promise, methodMap, fs;
      deferred = when.defer();
      promise = deferred.promise;
      if(
        (typeof model === 'undefined' || model === null) || 
          (typeof model.collection === 'undefined' || model.collection === null) || 
          (typeof model.collection.filesystem === 'undefined' || 
           model.collection.filesystem === null)
      ) {
        deferred.reject(new TypeError('Your model must belong to a collection of files, and that collection must have a filesystem instance.'));
      } else {
        fs = model.collection.filesystem;
      }
      var createUpdate = function(model, options) {
        var deferred, promise;
        deferred = when.defer();
        promise = deferred.promise;
        LocalFileSystem.getFileEntry(fs)(model.get('filepath'))(true).then(function(fileEntry){
          var entryDeferred, entryPromise;
          entryDeferred = when.defer();
          entryPromise = entryDeferred.promise;
          fileEntry.createWriter(function(writer){
            entryDeferred.resolve(writer);
          }, function(err){
            entryDeferred.reject(err);
          });
          return entryPromise;
        }, function(err){
          deferred.reject(err);
        }).then(function(writer){
          var writerDeferred, writerPromise;
          writer.onwriteend = function(event) {
            writerDeferred.resolve(event.target);
          };
          writer.onerror = function(err) {
            writerDeferred.reject(err);
          };
          writer.write(new Blob(model.toSerialzed, model.get('mimeType')));
          return writerPromise;
        }, function(err){
          deferred.reject(err);
        }).then(function(writer){
          deferred.resolve(writer);
        }, function(err){
          deferred.reject(err);
        });
        return promise;
      };
      methodMap = {
        'create': createUpdate,
        'read': function(model, options) {
          var deferred, promise;
          deferred = when.defer();
          promise = deferred.promise;
          LocalFileSystem.getFileEntry(fs)(model.get('filepath'))(false).then(function(fileEntry){
            var fileDeferred, filePromise;
            fileDeferred = when.defer();
            filePromise = fileDeferred.promise;
            fileEntry.file(function(file){
              fileDeferred.resolve(file);
            }, function(err){
              fileDeferred.reject(err);
            });
            return filePromise;
          }, function(err){}).then(function(file){
            var reader, readerDeferred, readerPromise;
            readerDeferred = when.defer();
            readerPromise = readerDeferred.promise;
            reader = new FileReader();
            reader.onloadedend = function(event){
              readerDeferred.resolve(event);
            };
            reader.onprogress = function(event){
              readerDeferred.notify(event);
            };
            reader.onerror = function(err){
              readerDeferred.reject(err);
            };
            reader.readAsArrayBuffer(file);
            return readerPromise;
          }, function(err){}).then(function(event){
            deferred.resolve(event.target);
          }, function(err){}, function(event){
            deferred.notify(event.target);
          });
          return promise;
        },
        'update': createUpdate,
        // again, much the same, except for we probably don't care
        // about progress. At this point we can probably abstract out the read and write functions to avoid duplication
        'delete': function(model, options) {
          var deferred, promise;
          deferred = when.defer();
          promise = deferred.promise;
          LocalFileSystem.getFileEntry(fs)(model.get('filepath'))(false).then(function(fileEntry){
            var removeDeferred, removePromise;
            removeDeferred = when.defer();
            removePromise = removeDeferred.promise;
            fileEntry.remove(function(){
              removeDeferred.resolve("Deleted.");
            }, function(err){
              removeDeferred.reject(err);
            });
            return removePromise;
          }, function(err){
            deferred.reject(err);
          }).then(function(str){
            deferred.resolve(str);
          }, function(err){
            deferred.reject(err);
          });
          return promise;
        }
      };
      
      return promise;
    }
  }
};
