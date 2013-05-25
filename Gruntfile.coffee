module.exports = (grunt) ->
  all = [
    'clean'
    'copy'
    'jshint'
    'handlebars'
    'coffeeify:main'
    'coffeeify:test'
    'concat'
  ]
  defaultTasks = all.concat [
    'mocha:all'
    'uglify'
  ]
  watchTasks = all.concat [
    'mocha:watch'
  ]
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    meta:
      banner: """/**
 * <%=pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd")
 * <%= grunt.file.read('MIT-LICENSE')
 */
      """
    clean: [
      'test/css/**'
      'test/*.js'
      'test/img/**'
      'img/**'
      'css/**'
      'fonts/**'
      'test/fonts/**'
    ]
    coffeeify:
      options:
        debug: true
      main:
        files: [
          src:
            [
              'src/main/main.js'
            ]
          dest: 'main.js'
        ]
      test:
        files: [
          src:
            [
              'src/main/main.js'
              'src/test/js/**/*.js'
              'src/test/js/*.js'
            ]
          dest: 'test/main.js'
        ]
    concat:
      main:
        files:[
          {
            src:
              [
                'src/main/resources/js/jquery-1.8.2.min.js'
                'src/main/resources/js/jquery-ui-1.10.0.custom.min.js'
                'src/main/resources/js/bootstrap.js'
                'src/main/resources/js/jquery-dropkick-1.0.0.js'
                'src/main/resources/js/custom_checkbox_and_radio.js'
                'src/main/resources/js/custom_radio.js'
                'src/main/resources/js/jquery.tagsinput.js'
                'src/main/resources/js/bootstrap-tooltip.js'
                'src/main/resources/js/jquery.placeholder.js'
                'templates.js'
                'main.js'
              ]
            dest: '<%= pkg.name %>.js'
          }
          {
            src:
              [
                'src/main/resources/bootstrap.css'
                'src/main/resources/flat-ui.css'
                'styles.css'
              ]
            dest: '<%= pkg.name %>.css'
          }
        ]
      test:
        files:[
          {
            src:
              [
                'src/main/resources/js/jquery-1.8.2.min.js'
                'src/main/resources/js/jquery-ui-1.10.0.custom.min.js'
                'src/main/resources/js/bootstrap.js'
                'src/main/resources/js/jquery-dropkick-1.0.0.js'
                'src/main/resources/js/custom_checkbox_and_radio.js'
                'src/main/resources/js/custom_radio.js'
                'src/main/resources/js/jquery.tagsinput.js'
                'src/main/resources/js/bootstrap-tooltip.js'
                'src/main/resources/js/jquery.placeholder.js'
                'templates.js'
                'test/main.js'
              ]
            dest: 'test/<%= pkg.name %>-specs.js'
          }
          {
            src:
              [
                'src/main/resources/bootstrap.css'
                'src/main/resources/flat-ui.css'
                'styles.css'
              ]
            dest: 'test/css/<%= pkg.name %>.css'
          }
        ]
    copy:
      main:
        files:[
          {
            src:
              [
                'src/main/resources/images/**'
              ]
            dest: 'images/'
          }
          {
            src:
              ['src/main/resources/fonts/**']
            dest: 'fonts/'
          }
        ]
      test:
        files:[
          {
            src:
              [
                'src/main/resources/images/**'
              ]
            dest: 'test/images/'
          }
          {
            src:
              ['src/main/resources/fonts/**']
            dest: 'test/fonts/'
          }
        ]
    jshint:
      options:
        jshintrc: '.jshintrc',
      all: [
        'src/main/javascript/*.js'
        'src/main/javascript/**/*.js'
      ]
    less:
      options:
        paths: ["src/main/less/"]
        yuicompress: true
        optimization: 1
        strictImports: true
      test:
        files:
          "test/css/styles.css": "src/main/less/style.less"
      main:
        files:
          "css/style.css": "src/main/less/style.less"
    mocha:
      options:
        ignoreLeaks: true
        globals: [
          'window'
          'global'
          'document'
          'jQuery'
          '$'
        ]
        ui: 'bdd'
        run: true
        colors: false
        bail: false
      all:
        options:
          reporter: 'Spec'
        files:
          src: ['test/**/*.html']
      watch:
        options:
          reporter: 'Min'
        files:
          src: ['test/**/*.html']
    handlebars:
      options:
        wrapped: false
        namespace: 'com.github.jackcviers.harder_better_faster_stronger'
        node: false
        processName: (filename) ->
          filenameRegex = ///(?:.*/)*(.*)(?:\.handlebars$)///
          filenameRegex.exec(filename)[1]
      main:
        files:[
          src:
            [
              'src/main/handlebars/*.handlebars'
              'src/main/handlebars/**/*.handlebars'
            ]
          dest: 'templates.js'
        ]
    uglify:
      options:
        banner: '<%= meta.banner %>'
        preserveComments: 'some'
        report: 'gzip'
        mangle: true
        compress: true
      main:
        files: [
          src:
            [
              '<%= pkg.name %>.js'
            ]
          dest: '<%= pkg.name %>.min.js'
        ]
    watch:
      options:
        debounceDelay: 250
      files: [
        'Gruntfile.coffee'
        'package.json'
        'src/**'
        'test/*.html'
      ]

  grunt.loadNpmTasks('grunt-contrib')
  grunt.loadNpmTasks('grunt-mocha')
  grunt.loadNpmTasks('grunt-coffeeify')
  grunt.loadNpmTasks('grunt-bump')

  grunt.registerTask('test', watchTasks)
  grunt.registerTask('default', defaultTasks)
