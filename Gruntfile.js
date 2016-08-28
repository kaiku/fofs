module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            build: {
                expand: true,
                cwd: 'src/assets',
                src: 'js/*.es6',
                dest: 'dist/assets',
                ext: '.js'
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

        copy: {
            html: {
                expand: true,
                cwd: 'src',
                src: '*.html',
                dest: 'dist'
            },
            img: {
                expand: true,
                cwd: 'src/assets',
                src: 'img/**',
                dest: 'dist/assets'
            }
        },

        eslint: {
            all: ['Gruntfile.js', 'assets/**/*.js']
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
                tasks: ['build']
            },
            js: {
                files: ['src/assets/js/*.js'],
                tasks: [
                    'eslint',
                    'clean:js',
                    'babel:build'
                ]
            },
            less: {
                files: ['src/assets/less/*.less'],
                tasks: ['less']
            },
            html: {
                files: ['src/*.html'],
                tasks: ['copy:html']
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('gruntify-eslint');

    grunt.registerTask('build', [
        'clean:all',
        'eslint',
        'less',
        'copy',
        'babel:build'
    ]);

    grunt.registerTask('default', 'build');
};
