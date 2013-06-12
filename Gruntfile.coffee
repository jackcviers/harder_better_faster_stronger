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
  serverTasks = all.concat [
    'connect'

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
      'test/css/harder_better_faster_stronger.css'
      'test/*.js'
      'test/images/**'
      'images/**'
      'css/**'
      'fonts/**'
      'test/fonts/**'
    ]
    coffeeify:
      options:
        debug: false
      main:
        files: [
          src:
            [
              'src/main/javascript/main.js'
            ]
          dest: 'main.js'
        ]
      test:
        files: [
          src:
            [
              'src/test/javascript/**/*.js'
              'src/test/javascript/*.js'
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
    connect:
      server:
        options:
          keepalive: true
          port:8080
          base: './test'
    copy:
      main:
        files:[
          {
            src:
              [
                '**'
              ]
            dest: 'images/'
            cwd: 'src/main/resources/images'
            expand: true
          }
          {
            src:
              ['**']
            dest: 'fonts/'
            cwd: 'src/main/resources/fonts'
            expand: true            
          }
        ]
      test:
        files:[
          {
            src:
              [
                '**'
              ]
            dest: 'test/images'
            expand: true
            cwd:'src/main/resources/images'
          }
          {
            src:
              [
                'jquery-2.0.2.min.js'
              ]
            dest: 'test/lib'
            expand: true
            cwd: 'lib'
          }
          {
            src:
              [
                '**'
              ]
            dest: 'test/fonts'
            expand: true
            cwd:'src/main/resources/fonts'
          }
        ]
    jshint:
      options:
        jshintrc: '.jshintrc',
        globals: 
          'window': true
          'global': true
          'document': true
          'Blob': true
          'FileReader': true
          'jQuery': true
          '$': true
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
        colors: true
        bail: true
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
      tasks: 'test'

  grunt.loadNpmTasks('grunt-contrib')
  grunt.loadNpmTasks('grunt-mocha')
  grunt.loadNpmTasks('grunt-coffeeify')
  grunt.loadNpmTasks('grunt-bump')

  grunt.registerTask('server', serverTasks)
  grunt.registerTask('test', watchTasks)
  grunt.registerTask('default', defaultTasks)
