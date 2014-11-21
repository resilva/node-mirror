var MirrorClient = require('./mirror').MirrorClient;

var test = new MirrorClient('/dev/mirror');
test.on('tag', function(tag, state) {
    console.log('tag "' + tag + '" : ' + state);
});
