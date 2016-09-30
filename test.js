/**
 * Created by gabriel on 9/24/16.
 */


const Chat = require('./lib/chat');
require('colors');

var chat = Chat({port: 3355});

function logIncomingMessage(data, socket) {
    var remoteAddressSays = "[" + socket.remoteAddress + "] says";
    console.log(remoteAddressSays.bold);
    console.log('\t' + data.toString());
}

function logConnection(socket) {
    var remoteAddressConnected = "[" + socket.remoteAddress + "] connected";
    console.log(remoteAddressConnected.bold.green);
}

function logClose(socket) {
    var remoteAddressConnected = "[" + socket.remoteAddress + "] closed";
    console.log(remoteAddressConnected.bold.red);
}

function logBusy(socket) {
    var remoteAddressConnected = "[" + socket.remoteAddress + "] busy";
    console.log(remoteAddressConnected.bold.blue);
}

function logOutcomingMessage(data) {
    chat.write(data);
    console.log('You say:'.bold);
    console.log('\t' + data.toString());
}

chat.on('connect', logConnection);
chat.on('busy', logBusy);
chat.on('close', logClose);
chat.on('data', logIncomingMessage);


//////////////////////////////////////////////////////







