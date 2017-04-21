// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular/cli'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-coverage'),
			require('karma-coverage-istanbul-reporter'),
			require('@angular/cli/plugins/karma')
		],
		client:{
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		files: [
			{ pattern: './src/test.ts', watched: false }
		],
		// exclude angular node-modules
		exclude: [
			'node_modules/angular2/**/*_spec.js'
		],
		preprocessors: {
			'./src/test.ts': ['@angular/cli']
		},
		mime: {
			'text/x-typescript': ['ts','tsx']
		},
		coverageIstanbulReporter: {
			reports: [ 'html', 'lcovonly' ],
			fixWebpackSourcePaths: true
		},
		angularCli: {
			environment: 'dev'
		},
		reporters: config.angularCli && config.angularCli.codeCoverage
			? ['progress', 'coverage-istanbul', 'coverage']
			: ['progress'],
		remapIstanbulReporter: {
			reports: {
				html: 'coverage',
				lcovonly: './coverage/coverage.lcov'
			}
		},
		coverageReporter: {
			type: 'text-summary',
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: false
	});
};
