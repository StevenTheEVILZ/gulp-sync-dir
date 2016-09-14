// jshint esversion: 6
var del = require('del');
var glob = require("glob");

function main(options) {

    // Production steps of ECMA-262, Edition 5, 15.4.4.19
    // Reference: http://es5.github.io/#x15.4.4.19
    if (!Array.prototype.map) {

        Array.prototype.map = function(callback, thisArg) {
            var T, A, k;
            if (this == null) {
                throw new TypeError(' this is null or not defined');
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }
            if (arguments.length > 1) {
                T = thisArg;
            }
            A = new Array(len);
            k = 0;
            while (k < len) {
                var kValue, mappedValue;
                if (k in O) {
                    kValue = O[k];
                    mappedValue = callback.call(T, kValue, k, O);
                    A[k] = mappedValue;
                }
                k++;
            }
            return A;
        };
    }

    var src = options.src;
    if (src.match("/$")) {
        src = src.slice(0, -1);
    }
    var srcFiles = glob.sync(src + '/**/*');

    var dest = options.target;
    if (dest.match("/$")) {
        dest = dest.slice(0, -1);
    }
    var destFiles = glob.sync(dest + '/**/*');

    var exclude = options.exclude;
    if (exclude === undefined || exclude === null) exclude = [];

    var pre = options.extensions;
    if (pre === undefined || pre === null) pre = {};

    for (var i = 0; i < srcFiles.length; i++) {
        srcFiles[i] = srcFiles[i].replace(src + '/', '');
    } // Gets rid of src path prefix
    for (var j = 0; j < destFiles.length; j++) {
        destFiles[j] = destFiles[j].replace(dest + '/', '');
    } // Gets rid of dest path prefix

    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    var oldFiles = [];

    for (var destFile of destFiles) { // Checks that every file in the folder also exists in the src folder
        if (srcFiles.indexOf(destFile) == -1) { // File does not exist in the src folder; file might be old

            var destFile2 = destFile + '.'; // Add period suffix to make extension algorithm work

            for (var key of Object.keys(pre)) { // Extension algorithm
                if (pre[key] !== '') {
                    destFile2 = replaceAll(destFile2, '.' + key + '.', '.' + pre[key] + '.');
                }
                if (pre[key] === '') {
                    destFile2 = replaceAll(destFile2, '.' + key + '.', '.');
                }
            }

            destFile2 = destFile2.slice(0, -1); // Remove period prefix

            if (srcFiles.indexOf(destFile2) == -1) {
                oldFiles.push(destFile); // Adds file to the oldFiles list if file doesn't exist in src and doesn't match any preprocessor extension
            }
        }
    }

    for (var k = 0; k < oldFiles.length; k++) {
        oldFiles[k] = dest + '/' + oldFiles[k];
    } // Add back dest path prefix
    for (var exFile of exclude) { // Remove excluded files
        for (var dFile of oldFiles) {
            if (exFile === dFile.split("/").pop()) oldFiles.splice(oldFiles.indexOf(dFile), 1);
        }
    }
    del.sync(oldFiles); // Delete all the things
}
module.exports = main;
