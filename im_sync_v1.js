let im_log = function im_log() { 

    let PORT = 11111;
    let id___ = 100;
    const ___guid_id = function () {
        id___++;
        if (id___ > 999) id___ = 100;

        const d = new Date();
        const id = d.toISOString().slice(-24).replace(/\D/g, '').slice(2, 8) + '' +
            d.toTimeString().split(' ')[0].replace(/\D/g, '') + '' + id___;

        return Number(id);
    }

    const config = {
        ready: false,
        scope: '_',
        error: '',

        id: 10,
        name: 'LOG',
        port: 11111
    };

    let client;
    const redis = require("redis");
     
    const redis___ready = (callback) => {
        const _self = this; 
    };

    this.start = function (port, scope, callback) {
        const _self = this;

        if (port && port > 0) PORT = port;
        if (scope) config.scope = scope;

        if (config.name == null || config.name.length == 0 || config.port == 0)
            return callback({ ok: false, message: 'Config of name or schema is null or port = 0' });

        client = redis.createClient({ port: config.port });
        client.on("error", function (error) {
            if (config.ready) {
                config.ready = false;
                config.error = error.message;
                console.log('API_' + config.name + ':', error);
            } else if (config.error != error.message) {
                config.error = error.message;
                console.log('API_' + config.name + ':', error);
            }
        });
        client.on("end", function (error) {
            config.ready = false;
            console.log('API_' + config.name + ': \t-> end');
        });
        client.on("ready", function (error) {
            config.ready = true;
            //console.log('CACHE_' + config.name + ': \t-> ready');
            if (config.schema == null) callback({ ok: true });
            else redis___ready(callback);
        });
        client.on("connect", function (error) {
            config.ready = true;
            //console.log('API_' + config.name + ': \t-> connect');
        });
        return _self;
    };

    this.delete_all = function (callback) {
        if (client == null || config.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

        client.flushall('ASYNC', function (err) {
            console.log(config.name, ' -> DELETE_ALL: OK');
            if (callback) callback({ ok: err == null, message: err });
        });
    };
    this.write = function ( ...agrs) {
        if (client == null || config.ready == false) return;
        
        let m = agrs;
        if (agrs.length == 1) m = agrs[0];
        if (typeof m == 'object') m = JSON.stringify(m);

        const id = ___guid_id();
        client.hset(config.scope, id, m, function (err, res) { });
    };
    this.write_key = function (key, ...agrs) {
        if (client == null || config.ready == false) return;

        let key_group = config.scope;
        if (key) key_group = config.scope + '.' + key.toUpperCase();
        
        let m = agrs;
        if (agrs.length == 1) m = agrs[0];
        if (typeof m == 'object') m = JSON.stringify(m);

        const id = ___guid_id(); 
        client.hset(key_group, id, m, function (err, res) { });
    };
};

im_log.instance = null;
im_log.getInstance = function () {
    if (this.instance === null) this.instance = new im_log();
    return this.instance;
};
module.exports = im_log.getInstance();
