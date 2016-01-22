var gutil = require('gulp-util');
var through = require('through2');

module.exports = function(options) {
    var REGX_HTML_ENCODE = /"/g;
    var encodeHtml = function(s) {
        return s.replace(/[\r\n\t]/g, " ").replace(/\\/g, "\\\\").replace(/'/g, "\\\'");
    };
    return through.obj(function(file, enc, cb) {
        options = options || {};
        var self = this;

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var html = file.contents.toString();
        var sp = file.path.split('/');
        if (sp.length == 1) {
            sp = file.path.split('\\');
        }

        var nameArr = sp[sp.length - 1].split('.');
        var name = nameArr.slice(0,nameArr.length-1).join('.');
        if (options == "m") {
            file.contents = new Buffer("$define(\"" + name + "\",function(_require, exports, module){" + html + "},\'" + options + "\');");
        } else {
            html = encodeHtml(html);
            file.contents = new Buffer("$define(\"" + name + "\",function(_require, exports, module){return \'" + html + "\'},\'" + options + "\');");
        }
        self.push(file);
        cb();

    });
};