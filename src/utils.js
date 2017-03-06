const spawn = require('child_process').spawnSync;

const regex = /(\*?)\s(\(.*\))\s.*-.*-.*-.*\s(".*")\s\[\w*\]?/g;

function Connection(enabled, connected, name) {
	this.enabled = enabled;
	this.connected = connected;
	this.name = name;
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

		let data = regex.exec(line.replace(/\s+/g, ' '));
		let connection = new Connection(
			data[1] === '*',
			data[2] === '(Connected)',
			data[3].replace(/"/g, '')
		);
		connections.push(connection);
	});

	return connections;
};

exports.List = list;

exports.Connect = name => {
	return spawn('scutil', ['--nc', 'start', name]);
};

exports.Disconnect = name => {
	return spawn('scutil', ['--nc', 'stop', name]);
};

exports.IsConnected = name => {
	let found = list().find(c => {
		return c.name === name;
	});

	return (found !== undefined && found.connected);
};
