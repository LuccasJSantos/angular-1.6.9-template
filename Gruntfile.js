module.exports = function (grunt) {
  const _buildDir = 'build/'
  const _distDir = 'dist/'
  const _srcDir = 'src/'
  const _tempDir = 'temp/'
  const _bundle = grunt.file.readJSON('src/app.bundle.json')
  const _pkg = grunt.file.readJSON('package.json')
  const _version = `-v${_pkg.version}`

  grunt.initConfig({
    pkg: _pkg,

    clean: {
      build: {
        src: [_buildDir]
      },
      dist: {
        src: [_distDir]
      },
      temp: {
        src: [_tempDir]
      }
    },

    concat: {
      options: {
        process: function (content, srcpath) {
          grunt.log.ok(`Concating file: '${srcpath}'`);
          return content;
        }
      },
      vendorCss: { src: _bundle.vendor.css, dest: `${_tempDir}assets/css/vendor.css`, nonull: true },
      vendorJs: { src: _bundle.vendor.js, dest: `${_tempDir}assets/js/vendor.min.js`, nonull: true },
      appCss: { src: 'src/**/*.css', dest: `${_tempDir}assets/css/styles.css`, nonull: true },
      appJs: { src: 'src/**/*.js', dest: `${_tempDir}assets/js/scripts.js`, nonull: true }
    },

    copy: {
      options: {
        process: function (content, srcpath) {
          let destpath = srcpath.replace(_srcDir, _buildDir).replace(_tempDir, _buildDir);
          grunt.log.ok(`Copying file: '${srcpath}' to '${destpath}'`);
          return content;
        },
        encoding: null
      },
      build: {
        files: [
          { expand: true, src: [`./index.html`], dest: _buildDir },
          { expand: true, cwd: _srcDir, src: ['assets/img/**', 'app/**/*.html'], dest: _buildDir, filter: 'isFile' },
          { expand: true, cwd: _tempDir, src: ['assets/**/*.css', 'assets/**/*.js'], dest: _buildDir },
        ]
      },
      dist: {
        files: [
          { expand: true, src: [`./index.html`], dest: _distDir },
          { expand: true, cwd: _srcDir, src: ['assets/img/**', 'app/**/*.html'], dest: _distDir, filter: 'isFile' },
          { expand: true, cwd: _tempDir, src: ['assets/**/*.min.css', 'assets/**/*.min.js'], dest: _distDir }
        ]
      }
    },

    cssmin: {
      vendorCss: {
        files: [
          { expand: true, cwd: _tempDir, src: ['assets/css/vendor.css'], dest: _tempDir, ext: '.min.css' }
        ]
      },
      appCss: {
        files: [
          { expand: true, cwd: _tempDir, src: [`assets/css/styles.css`], dest: _tempDir, ext: `${_version}.min.css` }
        ]
      }
    },

    jshint: {
      options: {},
      build: {
        options: {
          debug: true
        },
        src: [`${_srcDir}app/**/*.js`]
      },
      dist: {
        src: [`${_srcDir}app/**/*.js`]
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      default: {
        src: `${_tempDir}/assets/js/scripts.js`,
        dest: `${_tempDir}/assets/js/scripts${_version}.min.js`
      }
    },

    ['string-replace']: {
      build: {
        files: [
          { expand: true, flatten: true, src: [`${_srcDir}index.html`], dest: _buildDir }
        ],
        options: {
          replacements: [{
            pattern: '{@template-styles-app}',
            replacement: '<link type="text/css" rel="stylesheet" href="assets/css/styles.css" />'
          }, {
            pattern: '{@template-styles-vendor}',
            replacement: '<link type="text/css" rel="stylesheet" href="assets/css/vendor.css" />'
          }, {
            pattern: '{@template-styles-tailwind}',
            replacement: '<link type="text/css" rel="stylesheet" href="assets/css/tailwind.css"></script>'
          }, {
            pattern: '{@template-scripts-app}',
            replacement: '<script type="text/javascript" src="assets/js/scripts.js"></script>'
          }, {
            pattern: '{@template-styles-livereload}',
            replacement: '<script src="//localhost:35729/livereload.js"></script>'
          }]
        }
      },
      dist: {
        files: [
          { expand: true, flatten: true, src: [`${_srcDir}index.html`], dest: _distDir }
        ],
        options: {
          replacements: [{
            pattern: '{@template-styles-app}',
            replacement: '<link type="text/css" rel="stylesheet" href="assets/css/styles.css" />'
          }, {
            pattern: '{@template-styles-vendor}',
            replacement: '<link type="text/css" rel="stylesheet" href="assets/css/vendor.css" />'
          }, {
            pattern: '{@template-styles-tailwind}',
            replacement: '<link type="text/css" rel="stylesheet" href="assets/css/tailwind.css"></script>'
          }, {
            pattern: '{@template-scripts-app}',
            replacement: `<script type="text/javascript" src="assets/js/scripts${_version}.js"></script>`
          }, {
            pattern: '{@template-styles-livereload}',
            replacement: ''
          }]
        }
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('tailwindcss')(),
          require('autoprefixer')()
        ]
      },
      build: {
        expand: true,
        cwd: 'src/styles',
        src: ['**/*.css'],
        dest: `${_buildDir}assets/css`,
        ext: '.css'
      },
      dist: {
        expand: true,
        cwd: 'src/styles',
        src: ['**/*.css'],
        dest: `${_distDir}assets/css`,
        ext: '.css'
      }
    },

    watch: {
      options: {
        livereload: true,
      },
      scripts: {
        files: ['src/**/*', '!src/**/*.spec.js'],
        tasks: ['watch-build'],
        options: {
          interrupt: true,
          spawn: false
        },
      },
    }
  })

  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-postcss')

  grunt.registerTask('compile-tailwindcss', ['postcss'])
  grunt.registerTask('watch-tailwindcss', ['watch:postcss'])

  grunt.registerTask('build', [
    'clean:build',
    'concat:vendorCss',
    'concat:vendorJs',
    'concat:appCss',
    'postcss:build',
    'concat:appJs',
    'string-replace:build',
    'copy:build',
    'clean:temp'
  ]);
  grunt.registerTask('watch-build', [
    'concat:vendorCss',
    'concat:vendorJs',
    'concat:appCss',
    'concat:appJs',
    'string-replace:build',
    'copy:build',
    'clean:temp'
  ]);
  grunt.registerTask('dist', [
    'clean:dist',
    'concat:vendorCss',
    'cssmin:vendorCss',
    'concat:vendorJs',
    'concat:appCss',
    'cssmin:appCss',
    'postcss:dist',
    'concat:appJs',
    'uglify',
    'string-replace:dist',
    'copy:dist',
    'clean:temp'
  ]);

  grunt.registerTask('default', ['build', 'watch']);
}