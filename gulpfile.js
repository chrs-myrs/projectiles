var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    htmlreplace = require('gulp-html-replace');

// minify javascript file(s)
gulp.task('compress', function (cb) {
    pump([
            gulp.src('js/*.js'),
            uglify(),
            gulp.dest('dist/js')
        ],
        cb
    );
});

// replace js with minified version
gulp.task('replace', function(cb) {
    pump([
            gulp.src('index.html'),
            htmlreplace({
                'js': 'js/projectiles.js'
            }),
            gulp.dest('dist')
        ],
        cb
    );
});

gulp.task('watch', function() {
    gulp.watch('js/*.js', ['compress']);
    gulp.watch('index.html', ['replace']);
});

// Default Task
gulp.task('default', ['compress', 'replace', 'watch']);