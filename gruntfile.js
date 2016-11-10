module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            fonts: {
                files: [{
                    expand: true,
                    src: [
                    'dev/assets/**/*.{eot,svg,ttf,woff,woff2}',
                    'dev/components/**/*.{eot,svg,ttf,woff,woff2}'
                    ],
                    dest:"prod/fonts/",
                    flatten: true
                }]
            }
        },

        concat: {
            jsa: {
                src: [
                    'dev/assets/vendor/underscore.js',
                    'dev/assets/vendor/jquery.js',
                    'dev/assets/vendor/backbone.js',
                    'dev/inline/**/*.js',
                    'dev/app.js',
                    'dev/components/**/*.js'
                ],
                dest: 'prod/a.js',
            },

            css: {
                src: [
                    'dev/assets/**/*.{scss,css}',
                    'dev/components/theme-options.scss',
                    'dev/components/**/*.{scss,css}'
                ],
                dest: 'dev/tmp/build.scss',
            },
            css_inline: {
                src: [
                	'dev/vars.scss',
                    'dev/layout.scss',
                    'dev/inline/**/*.{scss,css}'
                ],
                dest: 'dev/tmp/inline.scss',
            },
        },

        sass: {
            dist: {
                files: {
                	'dev/tmp/inline.css': 'dev/tmp/inline.scss',
                    'prod/a.css': 'dev/tmp/build.scss',
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9', '> 1%']
            },
            inline: {
                src: 'dev/tmp/inline.css',
                dest: 'dev/tmp/inline.css'
            },

            main: {
                src: 'prod/a.css',
                dest: 'prod/a.css'
            }

        },

        uglify: {
            js: {
                src: 'prod/a.js',
                dest: 'prod/a.js'
            }
        },

        cssmin: {
            options: {
                restructuring: false,
                shorthandCompacting: false,
                roundingPrecision: -1,
                keepSpecialComments: 0
            },
            target: {
                files: {
                	'dev/tmp/inline.css': ['dev/tmp/inline.css'],
                    'prod/a.css': ['prod/a.css']
                }
            }
        },

        includereplace: {
            your_target: {
                options: {
                    includesDir: 'dev/components/'
                },
                // Files to perform replacements and includes with
                src: 'dev/index.html',
                // Destination directory to copy files to
                dest: 'prod/index.html'
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'dev/assets/img/',
                    src: [
                    '**/*.{png,jpg,gif}'],
                    dest: 'prod/img/'
                }]
            }
        },

        connect: {
            test: {
                options: {
                    port: 8080,
                    base: 'prod/'
                }
            },
        },

        watch: {
            assets: {
                files: ['dev/index.html', 'dev/**/**/*.{tpl,js,scss,css}'],
                tasks: ['copy', 'concat', 'sass', 'includereplace', 'imagemin'],
                options: {
                    spawn: false,
                    livereload: true
                },
            },
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['copy', 'concat', 'sass', 'autoprefixer', 'uglify', 'includereplace', 'imagemin', 'cssmin']);
    grunt.registerTask('dev', ['connect', 'watch']);
};