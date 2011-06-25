var fs = require('fs'),
    path = require('path'),
    ejs = require('ejs'),
    _ = require('underscore'),
    cmd = require('./components/muchmala-common').cmd,

    config = require('./config.js');

var componentsBaseDir = './components';
var components = fs.readdirSync(componentsBaseDir);
components = _.without(components, 'muchmala-common');

var configFiles = ['Jakefile.js', 'config.js'];
if (path.existsSync('config.local.js')) {
    configFiles.push('config.local.js');
}

desc('Start muchmala');
task('start', ['install'], function() {
    cmd.passthru('supervisorctl', ['start', 'muchmala:'], function(err) {
        if (err) {
            return fail(err, 2);
        }

        console.log("Muchmala is now running.");
        complete();
    });
}, true);



desc('Stop muchmala');
task('stop', function() {
    cmd.passthru('supervisorctl', ['stop', 'muchmala:'], function(err) {
        if (err) {
            return fail(err, 3);
        }

        console.log("Muchmala is now stopped.");
        complete();
    });
}, true);



desc('Restart muchmala');
task('restart', ['stop'], function() {
    jake.Task.start.invoke();
}, true);



desc('Install all muchmala stuff');
task('install', ['install-components'], function() {
    console.log('Muchmala is installed and ready to use.');
});

var linkedMuchmalaCommon = '/usr/lib/node_modules/muchmala-common';
file(linkedMuchmalaCommon, function() {
    console.log('Linking muchmala-common into global space');
    cmd.passthru('npm', ['link'], {cwd: componentsBaseDir + '/muchmala-common'}, function(err) {
        if (err) {
            fail(err, 2);
            return;
        }

        complete();
    });
}, true);

var installComponentsSubtasks = [];

components.forEach(function(component) {
    var cwd = componentsBaseDir + '/' + component;

    var jakeFile = cwd + '/Jakefile.js',
        nodeModules = cwd + '/node_modules',
        configLocal = cwd + '/config.local.js',

        hasConfigFile = path.existsSync(cwd + '/config.js'),
        hasJakeFile = path.existsSync(jakeFile);

    var componentDependencies = [linkedMuchmalaCommon, nodeModules];

    desc('Install dependencies for module ' + component);
    file(nodeModules, function() {
        console.log('Linking muchmala-common from global space into ' + component + ' space');
        cmd.unsudo(['npm', 'link', 'muchmala-common'], {cwd: cwd}, function(err) {
            if (err) {
                fail(err, 2);
                return;
            }

            console.log('Installing dependencies for module ' + component + '...');
            cmd.unsudo(['npm', 'install'], {cwd: cwd}, function(err) {
                if (err) {
                    fail(err, 2);
                    return;
                }
                complete();
            });
        });
    }, true);

    if (hasConfigFile) {
        componentDependencies.push(configLocal);

        desc('Override config for module ' + component);
        file(configLocal, function() {
            console.log('Overriding config in module ' + component + '...');
            fs.writeFile(configLocal, 'module.exports = require("../../config.js");', 'utf8', function() {
                complete();
            })
        }, true);
    }

    desc('Install component ' + component);
    task('install-' + component, componentDependencies, function() {
        if (hasJakeFile) {
            console.log('Running jake install for ' + component + '...');

            cmd.passthru('jake', ['install'], {cwd: cwd}, function(err) {
                if (err) {
                    fail(err, 3);
                    return;
                }

                complete();
            });
            return;
        }

        complete();
    }, true);
    installComponentsSubtasks.push('install-' + component);
});


desc('Install all dependencies in submodules');
task('install-components', installComponentsSubtasks, function() {});
