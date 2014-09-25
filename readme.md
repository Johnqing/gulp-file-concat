# gulp-file-concat

> 文件合并，js通过document.write，css通过@import

#### options
Type: `object`

All `false` by default.

- {STRING} **relativeUrls** - 合并js时，需要传入该参数

## Example
index.js:

```javascript
(function() {
	document.write('<script src="a.js"><\/script>');
	document.write('<script src="b.js"><\/script>');
}());
```

index.css:

```css
@import url("a.css");
@import url("b.css");
```

gulpfile.js:

```javascript
var gulp = require('gulp');
var fileconcat = require('gulp-file-concat');

gulp.task('default', function() {
  gulp.src('index.js')
    .pipe(fileconcat({
        relativeUrls: './'
    }))
    .pipe(gulp.dest('build/'));

  gulp.src('index.css')
      .pipe(fileconcat())
      .pipe(gulp.dest('build/'));

});

```