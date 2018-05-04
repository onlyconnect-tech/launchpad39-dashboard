const Gulp   = require('gulp');
const babel = require('gulp-babel');


const Del    = require('del');  
const RunSequence = require('run-sequence');

var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var babelify = require('babelify');
var gutil = require('gulp-util');

var exit = require('gulp-exit');

var livereload = require('gulp-livereload');
var connect = require('gulp-connect');

var build = require('gulp-build');

var flow = require('gulp-flowtype');

/**
 * Build Settings
 */

var settings = {

   /*
   * Where is our config folder?
   */
  configFolder : './config',

  /*
   * Where is our code?
   */
  srcFolder    : './src',

  /*
   * Where should the final file be?
   */
  destFolder   : './public/js'

};

/**
 * Clean Task
 *
 * Clears the build folder from our 
 * previous builds files.
 */

Gulp.task('clean', function(cb) {  
  Del([
    settings.destFolder + '/**/*'
  ], cb);
});

function compile(watch) {
  var bundler = watchify(browserify('./src/app_ccs_client.js', { debug: true }).transform(babelify)); 

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('app_ccs_client.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify({ mangle: true, compress: true }))
      .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(Gulp.dest(settings.destFolder))
      .pipe(livereload({ start: true }));
  }

  if (watch) {
    bundler.on('update', function () {
        console.log('-> bundling...');
        rebundle();
    });

    rebundle();
  } else {
      rebundle().pipe(exit());
  }
}

function watch() {
  return compile(true);
}

Gulp.task('build', function() { return compile(); });
Gulp.task('watch', function() { return watch(); });

Gulp.task('connect', function() { 
  connect.server({
    name: 'Dist App',
    root: 'public',
    port: 8001,
    livereload: true
  });
});

// https://gist.github.com/danharper/3ca2273125f500429945

Gulp.task('default', function(cb) {  
  RunSequence([
    'clean',
    'config',
    'build'
  ], cb);
});

Gulp.task('dev', function(cb) {  
  RunSequence([
    'clean',
    'config',
    'watch'
  ], cb);
});

function printConfigurationsMqtt(endpointValue, accessKeyValue, secretKeyValue, regionName) {
  console.log('CONFIGURATIONS MQTT:\n{endpoint:', endpointValue, '- accessKey:', accessKeyValue, 
    '- secretKey:', secretKeyValue, '- regionName:', regionName, '}');
}

// urlEndpointAuthService

function printUrlEndpointAuthService(urlEndpointAuthService) {
  console.log('CONFIGURATION AUTH SERVICE:\nurlEndpointAuthService:', urlEndpointAuthService);
}

/**
 * Configure javascript files with mqtt and authentication/authorization parameters.
 * Before create a .env file with proper configurations.
 */

Gulp.task('config', function() {

    const env = require('env2')('.env');

    const endpointValue = process.env.ENDPOINT;
    const accessKeyValue = process.env.ACCESS_KEY;
    const secretKeyValue = process.env.SECRET_KEY;
    const regionName = process.env.REGION_NAME;

    if(!endpointValue && !accessKeyValue && !secretKeyValue && !regionName) {
      console.error('NO MQTT CONFIGURATIONS, check .env file!!!');
      return;
    }

    printConfigurationsMqtt(endpointValue, accessKeyValue, secretKeyValue, regionName);

    Gulp.src('config/config_mqtt.js')
      .pipe(build({ ENDPOINT: endpointValue,  ACCESS_KEY: accessKeyValue, 
        SECRET_KEY: secretKeyValue, REGION_NAME: regionName }))
      .pipe(Gulp.dest('src'));

    const urlEndpointAuthService = process.env.URL_ENDPOINT_AUTH_SERVICE;

    if(!urlEndpointAuthService) {
      console.error('NO ENDPOINT AUTH SERVICE CONFIGURATIONS, check .env file!!!');
      return;
    }

    printUrlEndpointAuthService(urlEndpointAuthService);

    Gulp.src('config/config_app.js')
      .pipe(build({ URL_ENDPOINT_AUTH_SERVICE: urlEndpointAuthService }))
      .pipe(Gulp.dest('public/js-app'));

});

