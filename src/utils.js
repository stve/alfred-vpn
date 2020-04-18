const spawn = require('child_process').spawnSync;

const regex = /(\*?)\s(\(.*\))\s.*-.*-.*-.*\s(".*")\s\[\w*\]?/g;

function Connection(enabled, connected, name) {
	this.enabled = enabled;
	this.connected = connected;
	this.name = name;
	this.isConnected = () => {
		return this.connected === '(Connected)'
	};
	this.isConnecting = () => {
		return this.connected === '(Connecting)'
	};
	this.isDisconnected = () => {
		return this.connected === '(Disconnected)'
	};
}

const list = () => {
	let connections = [];
	let result = spawn('scutil', ['--nc', 'list']);
	let lines = result.stdout.toString().split('\n');
	lines.forEach((line, index, arr) => {
		if (index === arr.length - 1 && line === '') {
			return;
		}
		if (line.indexOf('Available') > -1) {
			return;
		}

		regex.lastIndex = 0;
		let data = regex.exec(line.replace(/\s+/g, ' '));
		if (data) {
			let connection = new Connection(
				data[1] === '*',
				data[2],
				data[3].replace(/"/g, '')
			);
			connections.push(connection);
		}
	});

	return connections;
};

const findByName = (name) => {
	return list().find(c => {
		return c.name === name;
	});
}

exports.List = list;

exports.Connect = name => {
	return spawn('osascript', ['-e',
	`on run argv
		set MyVPNName to item 1 of argv

		tell application "System Events"
				tell current location of network preferences
								set myConnection to the service MyVPNName
								if myConnection is not null then
												if current configuration of myConnection is not connected then
																connect myConnection
												end if
								end if
				end tell
		end tell
		end run`,
	name]);
};

exports.Disconnect = name => {
	return spawn('scutil', ['--nc', 'stop', name]);
};

exports.IsConnected = name => {
	let found = findByName(name);
	return (found !== undefined && found.isConnected());
};

exports.IsConnecting = name => {
	let found = findByName(name);
	return (found !== undefined && found.isConnecting());
}
