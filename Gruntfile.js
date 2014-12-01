'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, flatten: true, cwd: 'bower_components/', src: ['jquery/dist/*.min.js'], dest: 'public/scripts/', filter: 'isFile'},
          {expand: true, flatten: true, cwd: 'bower_components/', src: ['d3/*.min.js'], dest: 'public/scripts/', filter: 'isFile'},
          {expand: true, flatten: true, cwd: 'dev/', src: ['scripts/*.js'], dest: 'public/scripts/', filter: 'isFile'}

          // includes files within path and its sub-directories
          // {expand: true, src: ['path/**'], dest: 'dest/'},

          // makes all src relative to cwd
          // {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

          // flattens results to a single level
          // {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
        ],
      },
    },
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          'public/styles/style.css': 'dev/sass/style.scss'       // 'destination': 'source'
        }
      }
    },
    wiredep: {
      target: {
        src: 'views/index.html' // point to your HTML file.
      }
    }
  });
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');


  grunt.registerTask('default', 'wiredep', ['copy:main', 'sass']);

};