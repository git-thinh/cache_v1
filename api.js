let api = function api() {
    const config = {
        ready: false,
        name: 'API_BASE',
        port: 0,
        cmd_install: '',
        sql_scope: null,
        sql_select: null,
        sql_connect: null,
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

    const db___push_cache = (callback) => {

        const _DB_CONNECTION = require('tedious').Connection;
        const _DB_REQUEST = require('tedious').Request;
        const _DB_TYPES = require('tedious').TYPES;

        const conn_str = config.sql_connect[config.sql_scope];
        const sql_text = config.sql_select;
        const _DB_CONN = new _DB_CONNECTION(conn_str);

        _DB_CONN.on('connect', function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('DB Connected ... ');
            }

            const _results = [];
            const request = new _DB_REQUEST(sql_text, function (err_, count_, rows_) {
                _DB_CONN.close();
                callback({ ok: err_ == null, rows: _results, message: err_ });
            });

            request.on('row', function (columns) {
                const o = {};
                columns.forEach(function (v_) {
                    const col = v_.metadata.colName;
                    const val = v_.value;
                    switch (col) {
                        case 'id':
                            if (v_.value != null)
                                o[col] = Number(val);
                            else
                                o[col] = val;
                            break;
                        default:
                            o[col] = val;
                            break;
                    }
                    //console.log('????????? = ' + v_.metadata.colName, v_.metadata.type.name);
                    //console.log('????????? = ' + v_.metadata.colName, v_.metadata.type.type);
                });
                //console.log('????????? = ', o);
                _results.push(o);
            });

            _DB_CONN.execSql(request);
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

            switch (config.cmd_install) {
                case 'RESET_FROM_DB':
                    _self.delete_all((del_) => {
                        if (del_.ok) {
                            db___push_cache((dbr_) => {
                                if (dbr_.ok) {
                                    console.log('DB_ROWS = ', dbr_.rows.length);
                                    _self.update_multi(dbr_.rows, (crs_) => {
                                        console.log('PUSH_CACHE = ' + config.port, crs_.ok);
                                        if (callback) callback();
                                    });
                                }
                            });
                        } else
                            if (callback) callback();
                    });
                    break;
                default:
                    if (callback) callback();
                    break;
            }
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
    this.update_multi = function (objs, callback) {
        if (client == null || config.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

        if (objs == null || Array.isArray(objs) == false)
            return callback({ ok: false, message: 'The format of obj must be [{ ... },{ ... },...]' });

        if (objs.length == 0) return callback({ ok: true });

        const cmds = [];
        for (var i = 0; i < objs.length; i++) {
            if (objs[i].id == null) continue;
            cmds.push(['set', objs[i].id, JSON.stringify(objs[i])]);
        }

        client.multi(cmds).exec(function (err, replies_) {
            if (callback) callback({ ok: err == null, replies: replies_, message: err });
        });
    };
    this.delete_all = function (callback) {
        if (client == null || config.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

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
