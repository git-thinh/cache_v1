let api_notify = function api_notify() {
    let READY = false;
    let PORT = 10000;

    let CLIENT;
    const REDIS = require("redis");

    this.start = function (port) {
        if (port && port > 0) PORT = port;

        CLIENT = REDIS.createClient({ port: PORT });
        CLIENT.on("error", function (error) {
            READY = false;
            console.log('API_NOTIFY:', error);
        });
        CLIENT.on("end", function (error) {
            READY = false;
            console.log('API_NOTIFY \t-> end');
        });
        CLIENT.on("ready", function (error) {
            READY = true;
            console.log('API_NOTIFY \t-> ready');
        });
        CLIENT.on("connect", function (error) {
            READY = true;
            console.log('API_NOTIFY \t-> connect');
        });
    };

    this.delete_all = function (callback) {
        if (CLIENT == null) return callback({ ok: false, message: 'CacheEngine [' + PORT + '] disconnect' });

        CLIENT.flushall('ASYNC', function (err) {
            if (callback) callback({ ok: err == null, message: err });
        });
    };

    this.send = function (receiver, data, callback) {
        if (receiver == null || data == null) return;
        if (CLIENT == null) return;

        const key = new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 8) + '' + new Date().toTimeString().split(' ')[0].replace(/\D/g, '');
        const m = { id: Number(key), to: receiver, m: data };

        CLIENT.hset(receiver, key, JSON.stringify(m), function (err, res) { if (callback) callback(err, res); });
    };
};

api_notify.instance = null;
api_notify.getInstance = function () {
    if (this.instance === null) this.instance = new api_notify();
    return this.instance;
};
module.exports = api_notify.getInstance();
