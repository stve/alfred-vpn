'use strict';
const alfy = require('alfy');
const list = require('./src/utils').List;

alfy.output(list().sort((a, b) => (a.name > b.name) ? 1 : -1).map(c => {
	return {
		title: c.name,
		subtitle: 'Status: ' + c.connected,
		arg: c.name
	};
}));
