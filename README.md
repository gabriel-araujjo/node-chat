# Node RC4 chat

A wrapper for socket that implement a p2p connection with possibility
of adding a cryptographic Layer

This _class_ does not allow multiple clients

## Internal Fields:
* `server` = socket listener
* `port` = port where the server listen to
* `cipher` = transform stream to cipher messages
* `decipher` = transform stream to decipher incoming messages
* `endPoint` = point where the clear messages can be read (it can be the socket itself, if no cryptographic layer was set)
* `startPoint` = point where the clear messages can be written (it can be the socket itself, if no cryptographic layer was set)
* `socket` = connection to another instance of this chat

## Public Read Only Attribute
* `connected` = true if a connection was established

## Public Write Only Attribute
* `key` = when a key is set, new cipher and decipher are created and piped in socket, so new messages are encrypted 
          before they are sent, and decrypted when they come.

## Public Methods
* `write(data, enc)` = write data into startPoint
* `connect(options)` = connect this chat to a remote instance.
* `disconnect()` = disconnect the chat if a connection is established
* `setCryptoLayer(cipher, decipher)` = wrap chat with a cryptographic layer. `cipher` and `decipher` are Transform streams

## Triggered Events
* `connect` = triggered when a client was connected
* `busy` = triggered when a connection is about to be established with a chat in progress
* `close` = triggered when a connection is closed
* `data` = triggered when a message arrives