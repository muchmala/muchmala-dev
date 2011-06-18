var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    ejs = require('ejs'),

    config = require('./config.js');

var componentsBaseDir = './components';
var components = fs.readdirSync(componentsBaseDir);

var configFiles = ['Jakefile.js', 'config.js'];
if (path.existsSync('config.local.js')) {
    configFiles.push('config.local.js');
}

desc('Start muchmala');
task('start', ['install'], function() {
    exec('supervisorctl start muchmala:', function(err) {
        if (err) {
            return fail(err, 2);
        }

        console.log("Muchmala is now running.");
        complete();
    });
}, true);



desc('Stop muchmala');
task('stop', function() {
    exec('supervisorctl stop muchmala:', function(err) {
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
    jake.Task.start.execute();
}, true);



desc('Install all muchmala stuff');
task('install', ['install-components'], function() {
    console.log('Muchmala is installed and ready to use.');
}, true);


var installComponentsSubtasks = [];

components.forEach(function(component) {
    var cwd = componentsBaseDir + '/' + component;

    var jakeFile = cwd + '/Jakefile.js',
        nodeModules = cwd + '/node_modules',
        configLocal = cwd + '/config.local.js',

        hasConfigFile = path.existsSync(cwd + '/config.js'),
        hasJakeFile = path.existsSync(jakeFile);

    var componentDependencies = [nodeModules];

    desc('Install dependencies for module ' + component);
    file(nodeModules, function() {
        console.log('Installing dependencies for module ' + component + '...');
        exec('sudo -u ' + process.env.SUDO_USER + ' npm install', {cwd: cwd}, function(err) {
            if (err) {
                fail(err, 2);
            } else {
                complete();
            }
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

            exec('jake install', {cwd: cwd}, function(err, stdout) {
                if (err) {
                    fail(err, 3);
                } else {
                    console.log('<<< ' + stdout + ' >>>');
                    complete();
                }
            });

        } else {
            complete();
        }
    }, true);
    installComponentsSubtasks.push('install-' + component);
});
desc('Install all dependencies in submodules');
task('install-components', installComponentsSubtasks.concat(['/etc/supervisor/conf.d/muchmala.conf', 'proxy.json']), function() {});


desc('Generate supervisor config');
file('/etc/supervisor/conf.d/muchmala.conf', ['config/supervisor.conf.in'].concat(configFiles), function() {
    console.log('Generating supervisor config...');
    render('config/supervisor.conf.in', '/etc/supervisor/conf.d/muchmala.conf', {config: config});
    restartSupervisor(function(err) {
        if (err) {
            return fail(err, 1);
        }

        complete();
    })
}, true);

desc('Generate proxy config');
file('proxy.json', ['config/proxy.json.in'].concat(configFiles), function() {
    console.log('Generating proxy config...');
    render('config/proxy.json.in', 'proxy.json', {config: config});
});

function restartSupervisor(callback) {
    console.log('Restarting supervisor...');
    exec('/etc/init.d/supervisor stop', function() {
        exec('/etc/init.d/supervisor start', callback);
    });
}

function render(src, dst, options) {
    if (typeof(options) == 'function') {
        callback = options;
        options = {};
    }

    if (!options.root) {
        options.root = __dirname;
    }

    var template = fs.readFileSync(src).toString();
    var result = ejs.render(template, {locals: options});
    fs.writeFileSync(dst, result);
}
