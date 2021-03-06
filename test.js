var MirrorClient = require('./mirror').MirrorClient;

var test = new MirrorClient('/dev/mirror');
test.on('tag', function(tag, state) {
    console.log('tag "' + tag + '" : ' + ((state) ? 'on' : 'off'));
});

test.on('connected', function() {
    console.log('Mirror connected');
});

test.on('disconnected', function() {
    console.log('Mirror disconnected');
});

test.on('orientation', function(orientation) {
    console.log('Mirror orientation changed to ' + ((orientation) ? 'up' : 'down'));
});

test.on('error', function(error) {
    setTimeout(function() {
        this.open();
    }.bind(this), 1000);
}.bind(test));
