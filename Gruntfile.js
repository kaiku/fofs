module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    babel: {
      production: {
        expand: true,
        cwd: 'src/assets',
        src: 'js/*.js',
        dest: 'dist/assets'
      }
    },

    clean: {
      all: ['dist'],
      css: ['dist/assets/css'],
      html: ['dist/assets/*.html'],
      img: ['dist/assets/img'],
      js: ['dist/assets/js']
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: 'dist',
          keepalive: true
        }
      }
    },

    cssmin: {
      production: {
        expand: true,
        cwd: 'dist/assets/css',
        src: '*.css',
        dest: 'dist/assets/css'
      }
    },

    copy: {
      img: {
        expand: true,
        cwd: 'src/assets',
        src: 'img/**',
        dest: 'dist/assets'
      },
      js: {
        expand: true,
        cwd: 'src/assets',
        src: 'js/*.js',
        dest: 'dist/assets'
      },
      vendor: {
        files: [
          {
             expand: true,
             cwd: 'node_modules',
             src: 'moment/moment.js',
             dest: 'dist/assets/js'
          },
          {
             expand: true,
             cwd: 'node_modules/react/dist',
             src: ['react.js', 'JSXTransformer.js'],
             dest: 'dist/assets/js/react'
          }
        ]
      }
    },

    eslint: {
      all: ['Gruntfile.js', 'assets/**/*.js']
    },

    htmlmin: {
      production: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [
          {
            expand: true,
            cwd: 'dist',
            src: '*.html',
            dest: 'dist'
          }
        ]
      }
    },

    less: {
      compile: {
        options: {
          paths: ['src/assets/less']
        },
        files: {
          'dist/assets/css/style.css': 'src/assets/less/style.less'
        }
      }
    },

    preprocess: {
      options: {
        context: {
          // This is the default, but be explicit for clarity
          NODE_ENV: 'development'
        }
      },
      development: {
        src: 'src/index.html',
        dest: 'dist/index.html'
      },
      production: {
        src: 'src/index.html',
        dest: 'dist/index.html',
        options: {
          context: {
            NODE_ENV: 'production'
          }
        }
      }
    },

    watch: {
      assets: {
        files: 'src/assets/img/*',
        tasks: [
          'clean:img',
          'copy:img'
        ]
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['build:development']
      },
      js: {
        files: ['src/assets/js/*.js'],
        tasks: [
          'eslint',
          'clean:js',
          'copy:js',
          'copy:vendor',
          'preprocess:development'
        ]
      },
      less: {
        files: ['src/assets/less/*.less'],
        tasks: ['less']
      }
    }
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('gruntify-eslint');

  // Development
  grunt.registerTask('build:development', [
    'clean:all',
    'eslint',
    'less',
    'copy:img',
    'copy:js',
    'copy:vendor',
    'preprocess:development'
  ]);

  // Production
  grunt.registerTask('build:production', [
    'clean:all',
    'eslint',
    'less',
    'cssmin:production',
    'copy:img',
    'babel:production',
    'preprocess:production',
    'htmlmin:production'
  ]);

  // Default builds development and starts the server
  grunt.registerTask('default', ['build:development', 'connect']);
};
