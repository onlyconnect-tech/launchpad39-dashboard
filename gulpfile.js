const Gulp   = require('gulp');
const babel = require('gulp-babel');


const Del    = require('del');  

const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const uglify = require('gulp-uglify');
const babelify = require('babelify');
const gutil = require('gulp-util');

const exit = require('gulp-exit');

const livereload = require('gulp-livereload');
const connect = require('gulp-connect');

const build = require('gulp-build');

const flow = require('gulp-flowtype');

const zip = require('gulp-zip');

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
  return Del([
    settings.destFolder + '/**/*'
  ]);
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

Gulp.task('default', [
  'clean',
  'config',
  'build'
]);

Gulp.task('dev', [
  'clean',
  'config',
  'watch'
]);

Gulp.task('distribution', ['default'], function(cb) {
  return Gulp.src('./public/**')
    .pipe(zip('launchpad39-dashboard.zip'))
    .pipe(Gulp.dest('distribution'))
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

