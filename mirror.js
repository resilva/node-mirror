var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

exports.MirrorClient = MirrorClient = function(device) {
    this._device = null;
    this._device_name = device;
    this.open();
};

util.inherits(MirrorClient, EventEmitter);

MirrorClient.prototype.open = function() {
    try {
        this._device = fs.createReadStream(this._device_name);

        this._device.on('open', function() {
            this.emit('connected');
        }.bind(this));

        this._device.on('readable', function() {
            this._read();
        }.bind(this));

        this._device.on('close', function() { this._device_disconnected(); }.bind(this));
        this._device.on('error', function(error) { this._device_error(error); }.bind(this));
    } catch (e) {
        this._device_error(e);
    }
};

MirrorClient.prototype._device_connected = function() {
    this.emit('connected');
};

MirrorClient.prototype._device_disconnected = function() {
    this.emit('disconnected');
};

MirrorClient.prototype._device_error = function(error) {
    this.emit('error', error);
};

MirrorClient.prototype._device_orientation = function(orientation) {
    this.emit('orientation', orientation);
};

MirrorClient.prototype._device_tag = function(tag, state) {
    this.emit('tag', tag, state);
};

MirrorClient.prototype._read = function() {
    try {
        var chunk;
        while (null !== (chunk = this._device.read(16))) {
            var data = chunk.toString('hex');
            var state = data.slice(0, 4);
            var tag = data.slice(4, -1);

            switch (state) {
                case '0104':
                case '0105':
                        var orientation = (state == '0104') ? true : false;
                        this._device_orientation(orientation);
                    break;

                case '0201':
                case '0202':
                    var tag = data.slice(4, -1);
                    var tag_state = (state == '0201') ? true : false;
                    this._device_tag(tag, tag_state);
                    this.emit('tag', tag, (state == '0201') ? true : false);
                    break;
            }
        }
    } catch (e) {
        this._device_error(e);
    }
};
