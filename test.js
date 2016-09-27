/**
 * Created by gabriel on 9/24/16.
 */


const Chat = require('./lib/chat');
require('colors');

var chat = Chat();

function logIncomingMessage(socket, data) {
    var remoteAddressSays = "[" + socket.remoteAddress + "] says";
    console.log(remoteAddressSays.bold);
    console.log('\t' + data.toString());
}

function logConnection(socket) {
    var remoteAddressConnected = "[" + socket.remoteAddress + "] connected";
    console.log(remoteAddressConnected.bold.green);
}

function logOutcomingMessage(data) {
    chat.write(data);
    console.log('You say:'.bold);
    console.log('\t' + data.toString());
}

chat.on('connect', logConnection);
chat.on('message', logIncomingMessage);


//////////////////////////////////////////////////////







