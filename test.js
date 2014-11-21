var MirrorClient = require('./mirror').MirrorClient;

var test = new MirrorClient('/dev/mirror');
test.on('tag', function(tag, state) {
    console.log('tag "' + tag + '" : ' + state);
});

test.on('error', function(error) {
    setTimeout(function() {
        this._open();
    }.bind(this), 1000);
}.bind(test));
