# Node RC4 chat

A wrapper for socket with a optional RC4 cryptography

This _class_ does not allow multiple clients

## Internal Fields:
* `server` = socket listener
* `port` = port where the server listen to
* `cipher` = rc4 stream to cipher messages
* `decipher` = rc4 stream to decipher incoming messages
* `endPoint` = point where the clear messages can be read (it can be the socket itself, if a key was not set)
* `startPoint` = point where the clear messages can be written (it can be the socket itself, if a key was not set)
* `socket` = connection to another instance of this chat

## Public Setters
* `key` = when a key is set, new cipher and decipher are created and piped in socket, so new messages are encrypted 
          before they are sent, and decrypted when they come.


## Public Methods
* `write(data, enc)` = write data into startPoint
* `connect(options)` = connect this chat to a remote instance.

## Triggered Events
* `connect` = triggered when a client was connected
* `busy` = triggered when a connection is about to be established with a chat in progress
* `close` = triggered when a connection is closed
* `message` = triggered triggered when a message arrives