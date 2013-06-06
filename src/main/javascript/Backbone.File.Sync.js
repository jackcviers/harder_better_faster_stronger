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
        (typeof model === 'undefined' || model === null) || (typeof model.collection === 'undefined' || model.collection === null) || (typeof model.collection.filesystem === 'undefined' || model.collection.filesystem === null)
      ) {
        deferred.reject(new TypeError('Your model must belong to a collection of files, and that collection must have a filesystem instance.'));
      } else {
        fs = model.collection.filesystem;
      }
      methodMap = {
        'create': function(model, options) {
          var getPromisedFile, getPromisedFileWriter, deferred, promise, promiseOfFile, getPromiseOfWriteSuccess;
          // The file writer api is a big
          // cps api. To unmangle all the 
          // nested callbacks, we'll lift
          // each step into a promise so we
          // can handle each step atomically.
          // the whole deferred will fail if
          // any one step fails, ad this way
          // each step need not know about
          // the next step in the process.
          getPromisedFile = function() {
            var getFileDeferred, getFilePromise, getFileSuccess, getFileFailure;
            model.id = uuid.v4();
            getFileDeferred = when.defer();
            getFilePromise = deferred.promise;
            getFileSuccess = (function(that) {
              return function(fileEntry) {
                getFileDeferred.resolve(fileEntry);
              };
            }(this));
            getFileFailure = (function(that){
              return function (error) {
                getFileDeferred.reject(error);
              };
            }(this));
            fs.root.getFile(model.collection.path + '/' + model.id + model.extension, {create: true, exclusive: true}, getFileSuccess, getFileFailure );
            return getFilePromise;
          };
          
          getPromisedFileWriter = function(fileEntry) {
            var getFileWriterDeferred, getFileWriterPromise, getFileWriterSuccess, getFileWriterFailure;
            getFileWriterDeferred = when.defer();
            getFileWriterPromise = getFileWriterDeferred.promise;
            getFileWriterSuccess = function(fileWriter) {
              getFileWriterDeferred.resolve(fileWriter);
            };
            getFileWriterFailure = function(error) {
              getFileWriterDeferred.reject(error);
            };
            fileEntry.createWriter(getFileWriterSuccess, getFileWriterFailure);
            return getFileWriterPromise;
          };
          getPromiseOfWriteSuccess = function(fileWriter) {
            var writeSuccessDeferred, writeSuccessPromise, writeSuccess, writeFailure, writeProgress;
            writeSuccessDeferred = when.defer();
            writeSuccessPromise = writeSuccessDeferred.promise;
            writeSuccess = function(event) {
              writeSuccessDeferred.resolve(event);
            };
            writeFailure = function(error) {
              writeSuccessDeferred.reject(error);
            };
            writeProgress = function(event) {
              writeSuccessDeferred.notify(event);
            };
            fileWriter.onWriteEnd = writeSuccess;
            fileWriter.onprogress = writeProgress;
            fileWriter.onerror = writeFailure;
            var blob = new Blob(model.serialize(), model.get('mime/type'));
            fileWriter.write(blob);
            return writeSuccessPromise;
          };

          // 1st, get the promised file.
          promiseOfFile = getPromisedFile();
          
          // then get the writer for the filepath
          promiseOfFile.then(getPromisedFileWriter, function(error) {
            return deferred.reject(error);
            // then write the file
          }).then(getPromiseOfWriteSuccess, function(error) {
            return deferred.reject(error);
            // then get the complete event and pass it to the 
            // listening success handler.
          }).then(function(writeEvent){
            deferred.resolve(model, options);
          }, function(error){
            deferred.reject(error);
          }, function(progress) {
            deferred.notify(progress);
          });
          
          // all this happens async, so return the promise
          // so anything else can listen.
          return promise;
        },
        // reading a file is litle different than writing.
        // We get a file reader instead of a writer.
        // The key difference is we have a choice of how
        // to get our data. I chose as array buffer
        // because we can use the file result while it is being read.
        'read': function(model, options) {
          var getPromisedFileEntry, getPromisedFile, deferred, promise, promisedFile, getPromisedFileData;
          deferred = when.defer();
          promise = deferred.promise;
          getPromisedFileEntry = function() {
            var getFileDeferred, getFilePromise, getFileSuccess, getFileFailure;
            getFileDeferred = when.defer();
            getFilePromise = deferred.promise;
            getFileSuccess = (function(that) {
              return function(fileEntry) {
                getFileDeferred.resolve(fileEntry);
              };
            }(this));
            getFileFailure = (function(that){
              return function (error) {
                getFileDeferred.reject(error);
              };
            }(this));
            fs.root.getFile(model.collection.path + '/' + model.id + model.extension, {}, getFileSuccess, getFileFailure );
            return getFilePromise;
          };
          getPromisedFile = function(fileEntry) {
            var getFileDeferred, getFilePromise, getFileSuccess, getFileFailure;
            getFileDeferred = when.defer();
            getFilePromise = getFileDeferred.promise;
            getFileSuccess = function(file) {
              getFileDeferred.resolve(file);
            };
            getFileFailure = function(error) {
              getFileDeferred.reject(error);
            };
            fileEntry.file(getFileSuccess, getFileFailure);
            return getFilePromise;
          };
          getPromisedFileData = function(file) {
            var fileDataDeferred, fileDataPromise, fileDataSuccess, fileDataFailure, fileDataProgress, fileReader;
            fileDataDeferred = when.defer();
            fileDataPromise = fileDataDeferred.promise;
            fileDataProgress = function(event) {
              fileDataDeferred.notify(event);
            };
            fileDataSuccess = function(event) {
              fileDataDeferred.resolve(event.target.result);
            };
            fileDataFailure = function(error) {
              fileDataDeferred.reject(error);
            };
            fileReader = new FileReader();
            fileReader.onloadedend = fileDataSuccess;
            fileReader.onprogress = fileDataProgress;
            fileReader.onerror = fileDataFailure;
            fileReader.readAsArrayBuffer(file);
            return fileDataPromise;
          };
          promisedFile = getPromisedFileEntry();
          promisedFile.then(
            getPromisedFile,
            function(error){ deferred.reject(error);}
          ).then(
            getPromisedFileData,
            function(error) { deferred.reject(error);}
          ).then(
            function(fileResult) { deferred.resolve(fileResult); },
            function(error) { deferred.reject(error); },
            function(progress) { deferred.notify(progress);}
          );
          return promise;
        },
        'update': function(model, options) {
          
        },
        // again, much the same, except for we probably don't care
        // about progress. At this point we can probably abstract out the read and write functions to avoid duplication
        'delete': function(model, options) {
          
        }
      };
      
      return promise;
    }
  }
};
