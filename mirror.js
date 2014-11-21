var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

exports.MirrorClient = MirrorClient = function(device) {
    this._device = null;
    this._device_name = device;
    this._open();
};

util.inherits(MirrorClient, EventEmitter);

MirrorClient.prototype._open = function() {
    try {
        this._device = fs.createReadStream(this._device_name);

        this._device.on('readable', function() {
            this._read();
        }.bind(this));

        this._device.on('error', function(error) { this._device_error(error); }.bind(this));
    } catch (e) {
        this._device_error(e);
    }
};

MirrorClient.prototype._device_error = function(error) {
    this.emit('error', error);
};

MirrorClient.prototype._read = function() {
    try {
        var chunk;
        while (null !== (chunk = this._device.read(16))) {
            var data = chunk.toString('hex');
            var state = data.slice(0, 4);
            var tag = data.slice(4, -1);

            if (state == '0201' || state == '0202') {
                this.emit('tag', tag, state);
            }
        }
    } catch (e) {
        this._device_error(e);
    }
};
