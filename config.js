var config = exports;

config.http = {
    host: '0.0.0.0',
    port: 80,
    hostName: 'muchmala.dev'
};
config.http.url = 'http://' + config.http.hostName;

config.static = {
    host: "static.muchmala.dev",
    port: 8080,
    version: 2,
    minified: false
};
config.static.url = "http://" + config.static.host,

config.io = {
    externalHost: 'io.muchmala.dev',
    externalPort: 80,
    internalHost: '0.0.0.0',
    internalPort: 8091
};

config.storage = {
    type: 'file',
    file: {
        location: __dirname + '/webroot'
    },
    s3: {
        key:    null,
        secret: null,
        bucket: 'dev.muchmala.com'
    }
};

config.mongodb = {
    host:     '127.0.0.1',
    user:     'mongodb',
    database: 'muchmala'
};

config.queue = {
    host: "127.0.0.1",
    port: 6379,
    password: undefined,
    database: 0
};

config.cache = config.queue;

config.autenticationServices = {
    active: [],
    Twitter: {
        consumerKey:    null,
        consumerSecret: null
    },
    Facebook: {
        appId:     null,
        appSecret: null,
        callback:  config.http.url + '/auth/facebook',
        scope:     'email'
    },
    Google: {
        consumerKey:    null,
        consumerSecret: null,
        callback:       config.http.url + '/auth/google',
        scope:          ''
    },
    Yahoo: {
        consumerKey:    null,
        consumerSecret: null,
        callback:       config.http.url + '/auth/yahoo'
    }
};

config.googleAnalyticsKey = null;
config.autoRestart = false;

config.serversCount = {
    frontend: 1,    //can be only one for now
    io: 2,
    app: 1,
    generator: 1
};

var localConfigPath = __dirname + '/config.local.js';
if (require('path').existsSync(localConfigPath)) {
    var localConfig = require(localConfigPath),
        deepExtend = require('muchmala-common').misc.deepExtend;

    deepExtend(config, localConfig);
}
