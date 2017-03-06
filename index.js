'use strict';
const alfy = require('alfy');
const list = require('./src/utils').List;

alfy.output(list().map(c => {
	return {
		title: c.name,
		subtitle: c.connected ? 'Status: Connected' : 'Status: Disconnected',
		arg: c.name
	};
}));
