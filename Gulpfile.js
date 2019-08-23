const pug     = require('pug');
const http    = require('http');
const gulp    = require('gulp');
const kelp    = require('kelp');
const serve   = require('kelp-static');
const render  = require('kelp-render');
const postcss = require('gulp-postcss');
const pkg     = require('./package');

gulp.task('default', [ 'build', 'watch', 'server' ]);
gulp.task('build', [ 'style' ]);
gulp.task('style', () => {
  const processors = pkg.postcss.map(name => {
    return require(name)(pkg.postcss[ name ]);
  });
  return gulp
  .src('./src/*.css')
  .pipe(postcss(processors))
  .pipe(gulp.dest('./dist'))
});

gulp.task('watch', () => {
  gulp.watch('./src/*.css', [ 'style' ]);
});

gulp.task('server', () => {
  const app = kelp();
  app.use(render({
    extension: 'pug',
    templates: 'examples',
    renderer: (filename, locals, options) => {
      return pug.renderFile(filename, Object.assign({}, pkg, locals))
    }
  }));
  app.use(serve(__dirname + '/dist'));
  app.use((req, res, next) => {
    res.render('index');
  });
  http.createServer(app).listen(3000);
});