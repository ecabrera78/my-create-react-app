const fs = require('fs');
const path = require('path');
const os = require('os');
const process = require('process');
const childProcess = require('child_process');
const kleur, { bold } = require('kleur');

kleur.enabled = true;
const basePath = process.cwd();
const dependencies = {
	dev:
		'@babel/core @babel/cli @babel/preset-env @babel/preset-react ' +
		'webpack webpack-cli webpack-dev-server babel-loader ' +
		'browser-sync browser-sync-webpack-plugin html-loader css-loader style-loader ' +
		'html-webpack-plugin mini-css-extract-plugin ',
	prod: ' react react-dom',
};

function createReactApp(name) {
	const appPath = path.join(basePath, '/' + name);
	appExists(appPath);
	createFolder(appPath);
	createFolder(path.join(appPath, '/public'));
	createPackageJson(name, appPath);
	installPackages(appPath);
	appendScripts(appPath);
	copyTemplates(appPath);
}

function appExists(appPath) {
	if (fs.existsSync(appPath)) {
		console.error(
			bold().red(
				'FATAL ERROR: App ' +
					path.basename(appPath) +
					' already exists. Please change app name.'
			)
		);
		process.exit(1);
	}
}

function createFolder(dirPath) {
	console.log(bold().green('Create dir ') + bold().blue(dirPath));
	fs.mkdir(dirPath, err => {
		if (err) {
			console.error(bold().red(err.message));
			process.exit(1);
		}
	});
}

function createPackageJson(name, appPath) {
	console.log(bold().green('Writting package.json'));
	const initTemplate = {
		name: name,
		version: '1.0.0',
		main: 'index.js',
		scripts: {
			test: 'echo "Error: no test specified" && exit 1',
		},
	};
	fs.writeFileSync(
		path.join(appPath, 'package.json'),
		JSON.stringify(initTemplate, null, '\t') + os.EOL
	);
}

function installPackages(appPath) {
	console.log(bold().green('Installing DEV dependencies...'));
	childProcess.execSync('npm i -D ' + dependencies.dev, {
		cwd: appPath,
		stdio: 'inherit',
	});
	console.log(bold().green('Installing PROD dependencies...'));
	childProcess.execSync('npm i -s ' + dependencies.prod, {
		cwd: appPath,
		stdio: 'inherit',
	});
}

function appendScripts(appPath) {
	let webpackScripts = {
		build: 'webpack --mode production',
		start: 'webpack serve --open --mode development',
	};
	let buffer = fs.readFileSync(path.join(appPath, 'package.json'), []);
	let config = JSON.parse(buffer.toString());
	config.scripts = {
		...config.scripts,
		...webpackScripts,
	};

	fs.writeFileSync(
		path.join(appPath, 'package.json'),
		JSON.stringify(config, null, '\t') + os.EOL
	);
}

function copyTemplates(appPath) {
	let fileNames = fs.readdirSync(path.join(__dirname, '../templates'));

	fileNames.forEach(fileName => {
		const dataApp = fs.readFileSync(
			path.join(__dirname, '../templates', '/' + fileName),
			{}
		);
		if (fileName === 'index.html') {
			fs.writeFileSync(
				path.join(appPath, '/public', '/' + fileName),
				dataApp.toString() + os.EOL
			);
		} else {
			fs.writeFileSync(
				path.join(appPath, '/' + fileName),
				dataApp.toString() + os.EOL
			);
		}
	});
}

module.exports = { createReactApp: createReactApp };
