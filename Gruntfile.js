module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    eslint: {
      all: ['Gruntfile.js', 'assets/**/*.js']
    }
  });

  grunt.loadNpmTasks('gruntify-eslint');
};
