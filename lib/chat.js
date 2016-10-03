/**
 * Created by gabriel on 9/24/16.
 */

const EventEmitter = require('events');
const util = require('util');
const net = require('net');
const Socket = net.Socket;

const defaults = {
    port: 3355
};

/*
 * Chat "class"
 *
 * This class does not allow multiple clients
 *
 * # internal fields:
 *
 * `server` = socket listener
 * `port` = port where the server listen to
 * `cipher` = transform stream to cipher messages
 * `decipher` = transform stream to decipher incoming messages
 * `endPoint` = point where the clear messages can be read (it can be the socket itself, if no cryptographic layer was set)
 * `startPoint` = point where the clear messages can be written (it can be the socket itself, if no cryptographic layer was set)
 * `socket` = connection to another instance of this chat
 *
 * # public read only attribute
 * connected = true if a connection was established
 *
 * # public methods
 * write(data, enc) = write data into startPoint
 * connect(options) = connect this chat to a remote instance.
 * disconnect() = disconnect the chat if a connection is established
 * addCryptoLayer(cipher, decipher) = wrap chat with a cryptography layer
 *                                     `cipher` and `decipher` are Transform streams
 *
 *
 * # triggered events
 *
 * connect = a client was connected
 * busy = when a connection is about to be established with a chat in progress
 * close = when a connection is closed
 * data = triggered when a message arrives
 */
function Chat(options) {
    if (!(this instanceof Chat))
        return new Chat(options);

    options = Object.assign({}, defaults, options);

    EventEmitter.call(this);

    this.server = net.createServer(onconnect.bind(this));
    this.port = options.port;

    Object.defineProperty(this, 'connected', {
        get: function () {
            return !!this.socket;
        }
    });

    if (options.key) {
        this.key = options.key;
    }

    this.server.listen(this.port);
}

util.inherits(Chat, EventEmitter);

Chat.prototype.setCryptoLayer = function (cipher, decipher) {
    if (!(cipher && decipher))
        throw Error('You must provide a cioher and a decipher');

    if (this.socket) {
        if (this.cipher) {
            this.cipher.unpipe(this.socket);
        }

        if (this.decipher) {
            this.socket.unpipe(this.decipher);
        }
    }

    if (this.endPoint) {
        this.endPoint.removeListener('data', this.ondata);
    }

    this.startPoint = this.cipher = cipher;
    this.endPoint = this.decipher = decipher;

    if (this.socket) {
        this.cipher.pipe(this.socket).pipe(this.decipher);
        this.decipher.on('data', this.ondata);
    }
};

Chat.prototype.connect = function (options) {
    var socket = Socket();
    socket.on('connect', onconnect.bind(this, socket));
    socket.connect(Object.assign({}, defaults, options));
};

Chat.prototype.disconnect = function () {
    if (this.socket)
        this.socket.end();
};

Chat.prototype.write = function (data, enc) {
    if (this.socket) {
        this.startPoint.write(data, enc);
    }
};

function onconnect(socket) {
    if (this.socket) {
        // A conversation already is established,
        // so, don't do anything
        // close the new socket
        socket.end();
        this.emit('busy', socket);
        return;
    }

    this.socket = socket;
    this.endPoint = this.startPoint = socket;

    if (this.cipher) {
        this.startPoint = this.cipher;
        this.cipher.pipe(socket);
    }

    if (this.decipher) {
        this.endPoint = socket.pipe(this.decipher);
    }

    this.ondata = function(data){
        this.emit('data', data, socket);
    };
    this.endPoint.on('data', this.ondata.bind(this));
    this.emit('connect', socket);
    this.socket.on('close', (function () {
        this.emit('close', this.socket);

        this.socket =
            this.startPoint =
            this.endPoint =
            this.cipher =
            this.decipher = null
    }).bind(this));
}

module.exports = Chat;