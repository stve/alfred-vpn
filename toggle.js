'use strict';
const isConnected = require('./src/utils').IsConnected;
const isConnecting = require('./src/utils').IsConnecting;
const connect = require('./src/utils').Connect;
const disconnect = require('./src/utils').Disconnect;

const connection = process.argv.slice(-1)[0];

const toggleConnection = name => {
	if (isConnected(name) || isConnecting(name)) {
		disconnect(name);
	} else {
		connect(name);
	}
};

toggleConnection(connection);
