/*
 * grunt-t4mvc-statics
 * https://github.com/Mpdreamz/grunt-t4mvc-statics
 *
 * Copyright (c) 2013 Martijn Laarman
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // jshint: {
    //   all: [
    //     'Gruntfile.js',
    //     'tasks/*.js',
    //     '<%= nodeunit.tests %>',
    //   ],
    //   options: {
    //     jshintrc: '.jshintrc', 
    //   },
    // },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    t4mvc_statics: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options.cs': ['test/fixtures'],
        },
      },
      custom_options: {
        options: {
        },
        files: {
          'tmp/custom_options.cs': ['../grunt-t4mvc-statics/test/fixtures'],
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 't4mvc_statics', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
