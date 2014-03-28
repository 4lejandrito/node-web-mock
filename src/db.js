var rekuire = require('rekuire');
var mongoose = require('mongoose');
var async = require('async');

module.exports = {

    start: function(collections, cb) {
        var db = mongoose.connection.db;        
        var functions = [];
        for (var name in collections) {
            functions.push(function(cb) {
               db.collection(name, function(err, collection) {
                    collection.remove({}, function() {
                        collection.insert(collections[name], cb);
                    });
                });
            });
        }
        async.parallel(functions, cb);
    },

    stop: function(cb) {
        cb();
    }
};