#! /usr/bin/env node --color
const yargs = require('yargs');
const createApp = require('./createReactApp');
const { bold } = require('kleur');
const kleur = require('kleur');

kleur.enabled = true;

const usageMsg = '\nUsage: ecabrera-cli <command> [options]';
const options = yargs
	.usage(usageMsg)
	.command('react-app', 'Create new react app')
	.option('n', {
		alias: 'name',
		describe: 'Application name',
		type: 'string',
		demandOption: true,
	})
	.help(true).argv;

if (options._[0] === 'react-app') {
	try {
		console.log(bold().green('Create react app'));
		createApp.createReactApp(yargs.argv.n);
		console.log('Process completed...');
	} catch (error) {
		console.error(bold().red('Error: ' + error.message));
	}
}
