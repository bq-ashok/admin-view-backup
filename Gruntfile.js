module.exports = function (grunt) {

  grunt.initConfig({
    exec: {
      "run": {
        cmd: function (command) {
          return command;
        },
        options: {
          maxBuffer: (200*1024) * 2
        }
      },
      "ember-server-stubby": 'ember serve --port 4201 --proxy http://localhost:8003',
      'build-dev': 'ember build',
      'build-prod': 'ember build --environment=production',
      'build-prod-bamboo': 'ember build --environment=production --output-path admin-dataview'
    },

    stubby: {
      test: {
        options: {
          relativeFilesPath: true,
          persistent: false,
          mute: true,
          location: "0.0.0.0",
          admin: 8001,
          tls: 8002,
          stubs: 8003
        },
        files: [{
          src: ['tests/stubs/**/*-endpoint.json']
        }]
      },
      server: {
        options: {
          relativeFilesPath: true,
          persistent: true,
          mute: false,
          location: "0.0.0.0"
        },
        files: [{
          src: ['tests/stubs/**/*-endpoint.json']
        }]
      }
    },
    svgstore: {
      options: {
        svg: {
          xmlns: 'http://www.w3.org/2000/svg',
          style: "display: none"
        }
      },
      default : {
        files: {
          'public/assets/emoji-one/emoji.svg': ['vendor/emoji-one/*.svg'],
          'public/assets/performance-report/report.svg': [
            'vendor/performance-report/*.svg'
          ]
        }
      }
    },
    eslint: {
      options: {
        configFile: '.eslintrc',
        quiet: grunt.option('quiet'),
        fix: grunt.option('fix')
      },
      target: ['app', 'config', 'tests']
    }
  });

  grunt.loadNpmTasks('grunt-stubby');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-svgstore');
  grunt.loadNpmTasks('grunt-eslint');


  grunt.registerTask('test', function () {
    //for development
    var noStubby = grunt.option("no-stubby") || grunt.option("ns"),
      server = grunt.option("server") || grunt.option("s");

    var command = 'ember test';
    if (server) {
      command += " --server";
    }
    var testExecTask = 'exec:run:' + command;

    var tasks = noStubby ? [testExecTask] : ['stubby:test', testExecTask];
    grunt.task.run(tasks);
  });

  grunt.registerTask('bamboo-eslint', function() {
    grunt.config.set('eslint.options.format', 'junit');
    grunt.config.set('eslint.options.outputFile', 'linter-xunit.xml');
    grunt.config.set('eslint.options.quiet', true);
    grunt.task.run(['eslint']);
  });

  grunt.registerTask('bamboo-test', function () {
    grunt.task.run(['stubby:test', 'exec:run:ember exam --split=4 --parallel --silent -r xunit > report-xunit.xml']);
  });

  grunt.registerTask('bamboo-eslint', function() {
    grunt.config.set('eslint.options.format', 'junit');
    grunt.config.set('eslint.options.outputFile', 'linter-xunit.xml');
    grunt.config.set('eslint.options.quiet', true);
    grunt.task.run(['eslint']);
  });

  grunt.registerTask('run', function (target) {
    target = target;
    var serverExecTask = 'exec:ember-server-' + (target);
    var tasks = ['generateSVG', 'stubby:test'];
    tasks.push(serverExecTask);
    grunt.task.run(tasks);
  });

  grunt.registerTask('generateSVG', ['svgstore']);

  // Wrapper for ember build, this runs generateSVG before the build
  grunt.registerTask('build', function (target) {
    var buildExecTask = 'exec:build-' + (target || 'dev');
    grunt.task.run(['generateSVG', buildExecTask]);
  });

};
