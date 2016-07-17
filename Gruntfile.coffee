module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      compile:
        files:
          'index.js': ['src/index.coffee']
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.registerTask 'default', ['coffee']
