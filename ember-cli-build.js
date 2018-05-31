/*jshint node:true*/
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var mathquillFonts = pickFiles('vendor/mathquill/font', {
  srcDir: '/',
  files: ['**/**'],
  destDir: '/assets/font'
});

var katexFonts = pickFiles('bower_components/KaTeX/dist/fonts', {
  srcDir: '/',
  files: ['**/**'],
  destDir: '/assets/fonts'
});

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    outputPaths: {
      app: {
        css: {
          'app': '/assets/admin-dataview.css',
          'themes/bergen': '/assets/themes/bergen/styles.css'
        }
      }
    },
    'ember-cli-qunit': {
      useLintTree: false
    },
    fingerprint: {
      exclude: ['themes'] //excluding files
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  // NOTE: jquery UI must go before bootstrap; otherwise, tooltips will stop
  // working and other strange things may happen

  // NOTE-2: Only import jqueryUI components we are using, currently the
  // datepicker component causes conflicts with the bootstrap datepicker.

  app.import({
    development: 'bower_components/toastr/toastr.js',
    production:  'bower_components/toastr/toastr.min.js'
  });

  app.import({
    development: 'bower_components/toastr/toastr.css',
    production:  'bower_components/toastr/toastr.min.css'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/core.js',
    production:  'bower_components/jquery-ui/ui/minified/core.min.js'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/widget.js',
    production:  'bower_components/jquery-ui/ui/minified/widget.min.js'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/mouse.js',
    production:  'bower_components/jquery-ui/ui/minified/mouse.min.js'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/sortable.js',
    production:  'bower_components/jquery-ui/ui/minified/sortable.min.js'
  });

  app.import({
    development: 'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
    production:  'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js'
  });

  // Add touch events to jquery UI: https://github.com/furf/jquery-ui-touch-punch

  app.import({
    development: 'bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.js',
    production:  'bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/effect.js',
    production:  'bower_components/jquery-ui/ui/minified/effect.min.js'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/effect-highlight.js',
    production:  'bower_components/jquery-ui/ui/minified/effect-highlight.min.js'
  });

  app.import({
    development: 'bower_components/bootstrap-toggle/css/bootstrap2-toggle.css',
    production:  'bower_components/bootstrap-toggle/css/bootstrap2-toggle.min.css'
  });

  app.import({
    development: 'bower_components/bootstrap-toggle/js/bootstrap2-toggle.js',
    production:  'bower_components/bootstrap-toggle/js/bootstrap2-toggle.min.js'
  });

  app.import({
    development: 'bower_components/moment/moment.js',
    production:  'bower_components/moment/min/moment.min.js'
  });

  app.import({
    development: 'bower_components/moment-timezone/builds/moment-timezone-with-data.js',
    production:  'bower_components/moment-timezone/builds/moment-timezone-with-data.min.js'
  });

  app.import({
    development: 'bower_components/bootstrap-select/dist/css/bootstrap-select.min.css',
    production:  'bower_components/bootstrap-select/dist/css/bootstrap-select.min.css'
  });

  app.import({
    development: 'bower_components/bootstrap-select/dist/js/bootstrap-select.min.js',
    production:  'bower_components/bootstrap-select/dist/js/bootstrap-select.min.js'
  });

  app.import({
    development: 'bower_components/clipboard/dist/clipboard.js',
    production:  'bower_components/clipboard/dist/clipboard.min.js'
  });

  app.import({
    development: 'bower_components/intro.js/intro.js',
    production:  'bower_components/intro.js/minified/intro.min.js'
  });

  app.import({
    development: 'bower_components/intro.js/introjs.css',
    production:  'bower_components/intro.js/minified/introjs.min.css'
  });

  if (EmberApp.env() === 'test') {
    app.import('vendor/wysihtml-dummy.js');
  } else {
    app.import({
      development: 'bower_components/wysihtml/dist/wysihtml-toolbar.js',
      production:  'bower_components/wysihtml/dist/wysihtml-toolbar.min.js'
    });
    app.import('bower_components/wysihtml/parser_rules/advanced_and_extended.js');
  }
  app.import('bower_components/KaTeX/dist/katex.min.css');
  app.import('bower_components/KaTeX/dist/katex.min.js');
  app.import('bower_components/KaTeX/dist/contrib/auto-render.min.js');

  app.import({
    development: 'vendor/mathquill/mathquill.js',
    production:  'vendor/mathquill/mathquill.min.js'
  });
  app.import('vendor/mathquill/mathquill.css');
  return mergeTrees([app.toTree(), mathquillFonts, katexFonts]);
};
