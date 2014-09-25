'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var Buffer = require('buffer').Buffer;
var path = require('path');
var fs = require('fs');
var File = gutil.File;

var regx_js = /\s*<script.*[^'|"]+['|"]([^'|"]*\.js)['|"].*/i

function jsContent(fileContent, options){
	var contentArr = [];
	var contArr = fileContent.split('document.write');
	contArr.forEach(function(jsFile){
		var jsFileArr = jsFile.match(regx_js);
		if(!jsFileArr) return
		var filePath = path.join(options.relativeUrls, jsFileArr[1]);
		var content = fs.readFileSync(filePath).toString();
		contentArr.push(content);
	});
	return contentArr.join(';')
}

function cssContent(fileContent, file, options){
	var contentArr = [];
	var cbFilePath = file.path.substring(0, file.path.lastIndexOf(path.sep));
	var contArr = fileContent.split('@import');
	contArr.forEach(function(cssFile){
		var cssFileArr = cssFile.match(/url\s*\(\s*(?:['|"]?)([\w\/_\.:\-]+\.css)(?:\?[^'|")]*)?(?:['|"]?)\s*\)\s*[;]?/);
		if(!cssFileArr) return;
		var filePath = path.resolve(cbFilePath, cssFileArr[1]);
		var content = fs.readFileSync(filePath).toString();
		contentArr.push(content);
	});
	return contentArr.join('')
}

module.exports = function (options) {
	var firstFile;
	var content;


    return through.obj(function (file, enc, cb){
	    if (file.isNull()) {
		    this.push(file);
		    return cb();
	    }

	    if (file.isStream()) {
		    this.emit('error', new gutil.PluginError('gule-file-concat', 'Streaming not supported'));
		    return cb();
	    }

	    if(firstFile) firstFile = file;
	    var fileName = path.basename(file.path);
	    var ext = fileName.split('.').pop().toLowerCase();
	    var fileContent = String(file.contents.toString());
	    content = ext == 'js' ? jsContent(fileContent, options) : cssContent(fileContent, file, options);

	    file.contents = new Buffer(content);
	    this.push(file);
	    cb();
    });

};