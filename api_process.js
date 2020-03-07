let api_process = function api_notify() {
    let READY = false;
    let PORT = 10001;

    let CLIENT;
    const REDIS = require("redis");

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

    this.start = function (port) {
        if (port && port > 0) PORT = port;

        CLIENT = REDIS.createClient({ port: PORT });
        CLIENT.on("error", function (error) {
            READY = false;
            console.log('API_PROCESS:', error);
        });
        CLIENT.on("end", function (error) {
            READY = false;
            console.log('API_PROCESS \t-> end');
        });
        CLIENT.on("ready", function (error) {
            READY = true;
            console.log('API_PROCESS \t-> ready');
        });
        CLIENT.on("connect", function (error) {
            READY = true;
            console.log('API_PROCESS \t-> connect');
        });
    };
    
    this.add = function (obj, callback) {
        if (obj == null)
            return callback({ ok: false, message: 'obj or obj.id is null' });

        if (CLIENT == null)
            return callback({ ok: false, message: 'CacheEngine [' + PORT + '] disconect' });

        guid_id___().then(id => {
            CLIENT.set(id, JSON.stringify(obj), function (err, res) {
                if (callback) callback({ ok: err == null, id: id, message: err });
            });
        }); 
    };

    this.update = function (obj, callback) {
        if (obj == null && obj.id == null)
            return callback({ ok: false, message: 'obj or obj.id is null' });

        if (CLIENT == null)
            return callback({ ok: false, id: obj.id, message: 'CacheEngine [' + PORT + '] disconect' });

        CLIENT.set(id, JSON.stringify(obj), function (err, res) {
            if (callback) callback({ ok: err == null, id: obj.id, message: err });
        });
    };
};

api_process.instance = null;
api_process.getInstance = function () {
    if (this.instance === null) this.instance = new api_process();
    return this.instance;
};
module.exports = api_process.getInstance();
