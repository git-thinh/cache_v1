let api = function api() {
    const config = {
        ready: false,
        name: 'API_BASE',
        port: 0,
        error: ''
    };

    let client;
    const redis = require("redis");

    const guid_id___ = async (k) => {
        if (k == null) k = 0;
        return new Promise((resolve, reject) => {
            const t = Math.floor(Math.random() * 99) + 1;
            setTimeout(function () {
                const d = new Date();
                const id = d.toISOString().slice(-24).replace(/\D/g, '').slice(2, 6) + '' +
                    d.toTimeString().split(' ')[0].replace(/\D/g, '') + '' + (Math.floor(Math.random() * 999) + k + 100).toString().substr(0, 3);

                //console.log(id);

                resolve(Number(id));
            }, t);
        });
    };

    this.start = function (config_, callback) {
        const _self = this;
        if (config_) for (var key in config_) config[key] = config_[key];

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
            console.log('API_' + config.name + ': \t-> ready');
            if (callback) callback();
        });
        client.on("connect", function (error) {
            config.ready = true;
            console.log('API_' + config.name + ': \t-> connect');
        });
        return _self;
    };
    this.info = () => { return config; };
    this.add = function (obj, callback) {
        if (client == null || config.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

        if (obj == null || Array.isArray(obj))
            return callback({ ok: false, message: 'The format of obj must be { ... }' });

        guid_id___().then(id => {
            let m = obj;
            if (typeof obj == 'string' || typeof obj == 'number') m = { v: obj };
            m.id = id;

            client.set(id, JSON.stringify(m), function (err, res) {
                if (callback) callback({ ok: err == null, id: id, message: err });
            });
        });
    };
    this.delete = function (key, callback) {
        if (client == null || config.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

        if (key == null) return callback({ ok: false, message: 'The key is null' });

        client.del(key, function (err, res) {
            if (callback) callback({ ok: err == null && res == 1, id: key, message: err });
        });
    };
    this.update = function (obj, callback) {
        if (client == null || config.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

        if (obj == null || obj.id == null || Array.isArray(obj))
            return callback({ ok: false, message: 'The format of obj must be { id:... }' });

        client.set(obj.id, JSON.stringify(obj), function (err, res) {
            if (callback) callback({ ok: err == null && res == 1, id: obj.id, message: err });
        });
    };




    this.update1 = function (obj, callback) {
        if (obj == null)
            return callback({ ok: false, message: 'obj or obj.id is null' });

        if (Array.isArray(obj)) {
            if (obj.length == 0) return callback({ ok: true });

            if (client == null || READY == false)
                return callback({ ok: false, id: obj.id, message: 'CacheEngine [' + PORT + '] disconnect' });

            const cmds = [];
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].id == null) continue;
                cmds.push(['set', obj[i].id, JSON.stringify(obj[i])]);
            }

            client.multi(cmds).exec(function (err, replies_) {
                if (callback) callback({ ok: err == null, replies: replies_, message: err });
            });

        } else {
            if (obj.id == null)
                return callback({ ok: false, message: 'obj or obj.id is null' });

            if (client == null)
                return callback({ ok: false, id: obj.id, message: 'CacheEngine [' + PORT + '] disconnect' });

            client.set(obj.id, JSON.stringify(obj), function (err, res) {
                if (callback) callback({ ok: err == null, id: obj.id, message: err });
            });
        }
    };

    this.delete_all = function (callback) {
        if (client == null) return callback({ ok: false, message: 'CacheEngine [' + PORT + '] disconnect' });

        client.flushall('ASYNC', function (err) {
            if (callback) callback({ ok: err == null, message: err });
        });
    };
};

api.instance = null;
api.getInstance = function () {
    if (this.instance === null) this.instance = new api();
    return this.instance;
};
module.exports = api.getInstance();
