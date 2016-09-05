'use strict';
var chalk = require('chalk');
var crypto = require('crypto');
var _ = require('lodash');
var utils = require('keystone-utils');
var yeoman = require('yeoman-generator');

var KeystoneGenerator = yeoman.generators.Base.extend({

	initializing: function () {
		this.pkg = require('../package.json');
	},

	prompting: function () {
		var done = this.async();

		this.log('\nWelcome to the ' + chalk.green('Keystone Vue') + ' generator!\n');

		var prompts = [{
			type: 'input',
			name: 'projectName',
			message: 'What is the name of your project?',
			default: 'My Site'
		}, {
			type: 'confirm',
			name: 'createDirectory',
			message: 'Would you like to create a new directory for your project?',
			default: true
		}];

		this.prompt(prompts, function (props) {
			this.log('\n');
			_.extend(this, props);
			this.projectKey = utils.slug(this.projectName);
			if (props.createDirectory) {
				this.destinationRoot(this.projectKey);
			}
			done();
		}.bind(this));
	},

	keys: function keys() {
		this.cookieSecret = crypto.randomBytes(64).toString('hex');
	},

	writing: {
		project: function () {
			this.copy('keystone.js', 'keystone.js');
			this.copy('editorconfig', '.editorconfig');
			this.copy('gitignore', '.gitignore');
			this.copy('Procfile', 'Procfile');
			this.template('_package.json', 'package.json');
		},

		clientfiles: function () {
		},

		modelfiles: function () {
			this.copy('models/User.js', 'models/User.js');
		},

		publicfiles: function () {
			this.copy('public/favicon.ico', 'public/favicon.ico');
			this.directory('public/styles', 'public/styles');
			this.directory('public/lib', 'public/lib');
			this.directory('public/scripts', 'public/scripts');
		},

		routesfiles: function () {
			this.directory('routes/api', 'routes/api');
			this.copy('routes/index.js', 'routes/index.js');
		},

		templatefiles: function () {
			this.copy('templates/views/index.jade', 'templates/views/index.jade');
		},

		updatefiles: function () {
			this.copy('updates/0.0.1-admins.js', 'updates/0.0.1-admins.js');
		}

	},

	install: function () {
		this.log('\n' + chalk.green('Running npm install...') +
		'\n'
		);
		this.npmInstall();
	},

	end: function () {
		var cmd = (this.createDirectory ? '"cd ' + utils.slug(this.projectName) + '" then ' : '') + '"node keystone"';
		this.log(
			'\n' + chalk.green.underline('Your new project is ready!') +
			'\n' +
			'\n\nTo start Keystone, run ' + cmd + '.' +
			'\n'
		);
	}
});

module.exports = KeystoneGenerator;
