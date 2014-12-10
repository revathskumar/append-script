'use strict';
var path = require('path');
var fs = require('fs');
var stream = require('stream')
var util = require('util');

function Rewriter (options) {
    stream.Transform.call(this);
    this.options = options;
};

util.inherits(Rewriter, stream.Transform);

Rewriter.prototype._transform = function (chunk, encoding, callback) {
    var body = this.rewrite(this.options, chunk.toString());
    callback(null, body)
};

Rewriter.prototype.rewrite = function rewrite(args, haystack) {
    // check if splicable is already in the body text
    var re = new RegExp(args.splicable.map(function(line) {
        return '\s*' + this.escapeRegExp(line);
    }.bind(this)).join('\n'));

    if (re.test(haystack)) {
        return haystack;
    }

    var lines = haystack.split('\n');

    var otherwiseLineIndex = 0;
    lines.forEach(function(line, i) {
        if (line.indexOf(args.needle) !== -1) {
            otherwiseLineIndex = i;
        }
    });

    var spaces = 0;
    while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
        spaces += 1;
    }

    var spaceStr = '';
    while ((spaces -= 1) >= 0) {
        spaceStr += ' ';
    }

    lines.splice(otherwiseLineIndex, 0, args.splicable.map(function(line) {
        return spaceStr + line;
    }).join('\n'));

    return lines.join('\n');
};

Rewriter.prototype.escapeRegExp = function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

module.exports = function (options) {
    var rew = new Rewriter(options);
    return rew;
};

