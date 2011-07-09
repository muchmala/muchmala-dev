var fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    passthru = require('passthru');


var componentsBaseDir = './components';
var components = ['muchmala-app', 'muchmala-frontend',
    'muchmala-generator', 'muchmala-io', 'muchmala-lb'];


desc('Install everything');
task('install',
    ['install-components'],
    function() {});


desc('Install all components');
task('install-components',
    ['install-muchmala-common',
    'install-muchmala-app', 'install-muchmala-frontend',
    'install-muchmala-generator', 'install-muchmala-io',
    'install-muchmala-lb', 'install-muchmala-scripts'],
    function() {});


desc('Install muchmala-common');
task('install-muchmala-common', function() {
    console.log('Installing muchmala-common...');

    var cwd = componentsBaseDir + '/muchmala-common';

    // we're doing it in two steps to overcome virtualbox permissions bugs
    passthru('npm install', {cwd: cwd}, failOnError(function() {
        passthru('sudo npm link', {cwd: cwd}, failOnError(function() {
            complete();
        }));
    }));
}, true);


desc('Install muchmala-app');
task('install-muchmala-app', function() {
    console.log('Installing muchmala-app...');
    componentNpmInstall('muchmala-app', failOnError(function() {
        complete();
    }));
}, true);


desc('Install muchmala-frontend');
task('install-muchmala-frontend', function() {
    console.log('Installing muchmala-frontend...');
    componentNpmInstall('muchmala-frontend', failOnError(function() {
        complete();
    }));
}, true);


desc('Install muchmala-generator');
task('install-muchmala-generator', function() {
    console.log('Installing muchmala-generator...');
    componentNpmInstall('muchmala-generator', failOnError(function() {
        complete();
    }));
}, true);


desc('Install muchmala-io');
task('install-muchmala-io', function() {
    console.log('Installing muchmala-io...');
    componentNpmInstall('muchmala-io', failOnError(function() {
        complete();
    }));
}, true);


desc('Install muchmala-lb');
task('install-muchmala-lb', function() {
    console.log('Installing muchmala-lb...');
    componentNpmInstall('muchmala-lb', failOnError(function() {
        complete();
    }));
}, true);


desc('Install muchmala-scripts');
task('install-muchmala-scripts', function() {
    console.log('Installing muchmala-scripts...');
    componentNpmInstall('muchmala-scripts', failOnError(function() {
        complete();
    }));
}, true);


desc('Start all services');
task('start', ['start-muchmala-lb'], function() {
    passthru('sudo supervisorctl start muchmala:', failOnError(function() {
        complete();
    }));
}, true);


desc('Stop all services');
task('stop', ['stop-muchmala-lb'], function() {
    passthru('sudo supervisorctl stop muchmala:', failOnError(function() {
        complete();
    }));
}, true);


desc('Start muchmala-lb');
task('start-muchmala-lb', function() {
    console.log('Starting muchmala-lb...');

    var cwd = componentsBaseDir + '/muchmala-lb';
    passthru('sudo bin/muchmala-lb.sh', {cwd: cwd}, failOnError(function() {
        complete();
    }));
}, true);


desc('Stop muchmala-lb');
task('stop-muchmala-lb', function() {
    console.log('Stopping muchmala-lb...');

    var cwd = componentsBaseDir + '/muchmala-lb';
    passthru('sudo bin/muchmala-lb.sh stop', {cwd: cwd}, failOnError(function() {
        complete();
    }));
}, true);


function failOnError(callback) {
    return function(err) {
        if (err) {
            fail(err);
            return;
        }

        callback.apply(null, Array.prototype.slice.call(arguments));
    }
}


function componentNpmInstall(component, callback) {
    var cwd = componentsBaseDir + '/' + component;

    passthru('npm link muchmala-common', {cwd: cwd}, function(err) {
        if (err) {
            return callback(err);
        }

        passthru('npm install', {cwd: cwd}, function(err) {
            if (err) {
                return callback(err);
            }

            callback();
        })
    });
}
