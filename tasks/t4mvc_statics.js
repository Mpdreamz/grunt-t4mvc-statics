/*
 * grunt-t4mvc-statics
 * https://github.com/Mpdreamz/grunt-t4mvc-statics
 *
 * Copyright (c) 2013 Martijn Laarman
 * Licensed under the MIT license.
 */

'use strict';
// External libs.


module.exports = function(grunt) {
  var fs = require("fs");

  var Q = require("q");
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  // External libs.
  var _    = grunt.util._; // lodash

  var fileStart = function(generated) {
      generated.push("#pragma warning disable 1591");
      
      generated.push("using System;");
      generated.push("using System.Diagnostics;");
      generated.push("using System.CodeDom.Compiler;");
      generated.push("using System.Collections.Generic;");
      generated.push("using System.Linq;");
      generated.push("using System.Runtime.CompilerServices;");
      generated.push("using System.Web;");
      generated.push("using System.Web.Hosting;");
      generated.push("using System.Web.Mvc;");
      generated.push("using System.Web.Mvc.Ajax;");
      generated.push("using System.Web.Mvc.Html;");
      generated.push("using System.Web.Routing;");
      generated.push("using T4MVC;");


      generated.push("namespace Files");
      generated.push("{");
  }
  

  grunt.registerMultiTask('t4mvc_statics', 'Generate a T4MVC C# class to strongly type static files', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
    });

    var done = this.async();

    // Iterate over all specified file groups.
    var safeName = function(name) {
      return name.replace(/[-\., \s]+/g, "_");
    } 
    var outputPromises = _.map(this.files, function(f) {
      var generated = [];
      var nodes = [];

      fileStart(generated);

      // Concat specified files.
      var folderPromises = f.src.filter(function(filepath) {
        var isDir = grunt.file.isDir(filepath);
        if(!isDir) {
          grunt.log.warn('Path "' + filepath + '" is not a directory.');
        }
        return isDir;
      }).map(function(filepath) {
        var folderDefer = Q.defer();
        
        var walkEnd = function(err) {
          if (err)
            folderDefer.reject();
          else
            folderDefer.resolve();
        }
        var normalizeDir = function(dir) {
          var dirUp = _.initial(filepath.split(/[\/]/)).join("/");
          var re = new RegExp("^" + dirUp + "/?");
          return dir.replace(re, "");
        }

        var writeDir = function(dir, fileInfo, depth) {
          dir = normalizeDir(dir);
          var path = dir + "/" + fileInfo.file;
          var dirName = safeName(_.last(dir.split("/")));
          writeLog(depth, '[GeneratedCode("T4MVC", "2.0"), DebuggerNonUserCode]');
          writeLog(depth, 'public static class @'+ dirName);

          writeLog(depth, '{')
        };
        var writeDirEnd = function(dir, fileInfo, depth) {
          dir = normalizeDir(dir);
          var path = dir + "/" + fileInfo.file;
          writeLog(depth, '}')
        };
        var writeFileStart = function(dir, fileInfo, depth) {
          dir = normalizeDir(dir);
          
          var path = dir + "/" + fileInfo.file;
          var safe = safeName(fileInfo.file);
          writeLog(depth, 'private const string URLPATH = "~/' + dir + '";');
          writeLog(depth, 'public static string Url() { return T4MVCHelpers.ProcessVirtualPath(URLPATH); }');
          writeLog(depth, 'public static string Url(string fileName) { return T4MVCHelpers.ProcessVirtualPath(URLPATH + "/" + fileName); }');
          
         
        }

        var writeFile = function(dir, fileInfo, depth) {
          dir = normalizeDir(dir);
          
          var path = dir + "/" + fileInfo.file;
          var safe = safeName(fileInfo.file);
          writeLog(depth + 1, ' public static readonly string '+safe+' = Url("'+fileInfo.file+'");')

        };
        var writeLog = function(depth, message) {
          var indent = new Array(depth + 1).join('  ');
          generated.push(indent+message);
        }

        walk(filepath, {
          writeDir: writeDir,
          writeFileStart: writeFileStart,
          writeDirEnd: writeDirEnd,
          writeFile: writeFile,
          walkEnd: walkEnd
        });

        return folderDefer.promise;
      });
      return Q.allSettled(folderPromises).then(function() {
        generated.push("}");
        // Write the destination file.
        grunt.file.write(f.dest, generated.join("\r\n"));

        // Print a success message.
        grunt.log.writeln('File "' + f.dest + '" created.');

      })
    });

    Q.allSettled(outputPromises)
      .then(done);
  });
  
  var walk = function(dir, actions) {
    // this function will recursively explore one directory in the context defined by the variables above
    var dive = function(dir, depth) {
      depth = depth || 0;
      depth++;

      var list = fs.readdirSync(dir);
      var fileInfo = { file : "" };
      fileInfo.stat = fs.statSync(dir);

      var fileInfos = _.map(list, function(file) {
        var path = dir + "/" + file;
        var stat = fs.statSync(path);
        return { stat: stat, file: file };
      });
      var listing = _.groupBy(fileInfos, function(fileInfo) { 
        return fileInfo.stat.isDirectory() ? "folder" : "file"; 
      });
      actions.writeDir(dir, fileInfo, depth);
      _.each(listing.folder, function(fileInfo) {
         var path = dir + "/" + fileInfo.file;
         dive(path, depth);
      });
      actions.writeFileStart(dir, fileInfo, depth);
      _.each(listing.file, function(fileInfo) {
        actions.writeFile(dir, fileInfo, depth);
      });
      actions.writeDirEnd(dir, fileInfo, depth);        
    };

    // start exploration
    dive(dir);
    actions.walkEnd();
  };
};
