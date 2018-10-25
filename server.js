const express = require('express');
const knex = require('knex');

const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());

server.post('/testserver', (req, res) => {
	const { thing } = req.body;

	db('things')
		.insert({ thing })
		.then(([id]) => {
			res.status(201).json({ message: `${thing} added with id ${id}` });
		})
		.catch(err => {
			if (err.code === 'SQLITE_CONSTRAINT') {
				res.status(409).json({ error: `${thing} already exists` });
			} else {
				res.status(500).json(err);
			}
		});
});

server.delete('/testserver', (req, res) => {
	const { thing } = req.body;

	db('things')
		.delete({ thing })
		.then(count => {
			if (count) {
				res.status(204).json({ message: `${thing} deleted` });
			} else {
				res.status(404).json({ message: `no ${thing} to delete` });
			}
		})
		.catch(err => res.status(500).json(err));
});

module.exports = server;
