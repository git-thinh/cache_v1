let api = function api() {
    const _ = require('lodash');

    const config = {
        id: 0,
        ready: false,
        name: '',
        port: 0,
        cmd_install: '',
        sql_scope: null,
        sql_select: null,
        sql_connect: null,
        schema: null,
        valid_add: null,
        error: ''
    };

    let client;
    const redis = require("redis");


    const db___push_cache = (callback) => {

        const _DB_CONNECTION = require('tedious').Connection;
        const _DB_REQUEST = require('tedious').Request;
        const _DB_TYPES = require('tedious').TYPES;

        const conn_str = config.sql_connect;
        const sql_text = config.sql_select;
        const _DB_CONN = new _DB_CONNECTION(conn_str);

        _DB_CONN.on('connect', function (err) {
            if (err) {
                console.log(err);
                return callback({ ok: false, message: err });
            }

            console.log(config.name + ' start the readinf DB ...');

            const _results = [];
            const request = new _DB_REQUEST(sql_text, function (err_, count_, rows_) {
                console.log(config.name + ' finish the reading DB ...', _results.length);
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

    const redis___ready = (callback) => {
        const _self = this;

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
            case 'FIRST_FROM_DB':
                _self.get_count(k => {
                    if (k == 0) {
                        db___push_cache((dbr_) => {
                            if (dbr_.ok) {
                                console.log('DB PUSH CACHE ' + config.name + ' = ', dbr_.rows.length);
                                _self.update_multi(dbr_.rows, (crs_) => {
                                    console.log('PUSH_CACHE = ' + config.port, crs_.ok);
                                    if (callback) callback();
                                });
                            }
                        });
                    } else {
                        console.log(config.name + ' CACHED = ' + k);
                        if (callback) callback();
                    }
                });
                break;
            case 'DELETE_ALL':
                _self.delete_all(callback);
                break;
            default:
                if (callback) callback();
                break;
        }
    };

    this.start = function (config_, callback) {
        const _self = this;
        if (config_) for (var key in config_) config[key] = config_[key];

        if (config.name == null || config.name.length == 0 || config.port == 0 || config.schema == null)
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
            //console.log('API_' + config.name + ': \t-> ready');
            redis___ready(callback);
        });
        client.on("connect", function (error) {
            config.ready = true;
            //console.log('API_' + config.name + ': \t-> connect');
        });
        return _self;
    };

    this.info = () => { return config; };
    this.get_count = function (callback) {
        if (client == null || config.ready == false) return callback(0);
        client.keys('*', function (err, keys) {
            if (err) return callback(0);
            callback(keys.length);
        });
    };
    this.get_keys = function (callback) {
        if (client == null || config.ready == false) return callback([]);
        client.keys('*', function (err, keys) {
            if (err) return callback([]);
            callback(keys);
        });
    };
    this.add = function (obj, callback) {
        if (client == null || config.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

        if (obj == null || Array.isArray(obj))
            return callback({ ok: false, message: 'The format of obj must be { ... }' });

        const id = _self.API.___guid_id();

        let m = obj;
        if (typeof obj == 'string' || typeof obj == 'number') m = { v: obj };
        m.id = id;
        client.set(id, JSON.stringify(m), function (err, res) {
            if (callback) callback({ ok: err == null, id: id, object: m, message: err });
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
            console.log(config.name, ' -> DELETE_ALL: OK');
            if (callback) callback({ ok: err == null, message: err });
        });
    };

    this.index = function (callback) {
        if (callback) callback();
    };
    this.load_db = function () {
    };


    this.valid_add = function (obj) {
        const _self = this;

        //if (obj == null || typeof obj != 'object' || Array.isArray(obj) || Object.keys(obj).length == 0)
        //    return { ok: false, message: 'Object must be not null or emtpy' };

        const cols = Object.keys(obj);
        const col_schema = Object.keys(config.schema);
        //console.log('COLS = ', JSON.stringify(cols));
        //console.log('COL_SCHEMA = ', JSON.stringify(col_schema));

        //[1.1] Valid col is not exist into schema
        const col_wrong = _.filter(cols, function (o_) { return col_schema.indexOf(o_) == -1; });
        //console.log('ERR_COL_WRONG = ', JSON.stringify(col_wrong));
        if (col_wrong.length > 0)
            return { ok: false, message: col_wrong.join(', ') + ': field invalid' };


        //[1.2] Valid set value is auto
        const cf_auto = ['API', 'KEY_IDENTITY', 'yyyyMMdd', 'hhmmss', 'yyyyMMddhhmmss'];
        const col_auto = _.filter(_.map(config.schema
            , function (val_, key_) { if (cf_auto.indexOf(val_) != -1) return key_; else return null; })
            , function (o_) { return o_ != null; });
        const err_auto = _.filter(cols, function (o_) { return col_auto.indexOf(o_) != -1; });
        //console.log('AUTO = ', JSON.stringify(col_auto));
        //console.log('ERR_AUTO = ', JSON.stringify(err_auto));
        if (err_auto.length > 0)
            return { ok: false, message: err_auto.join(', ') + ': fields have values set auto as follow: ' + cf_auto.join(', ') };
        else {
            col_auto.forEach(col_ => {
                const val_ = config.schema[col_];
                switch (val_) {
                    case 'API':
                        const fn = config.name.toLowerCase() + '___' + col_.toLowerCase();
                        if (_self.API[fn])
                            obj[col_] = _self.API[fn]();
                        break;
                    case 'KEY_IDENTITY':
                        obj['id'] = _self.API.___guid_id(config.id);
                        break;
                    case 'hhmmss':
                        obj[col_] = Number(new Date().toTimeString().split(' ')[0].replace(/\D/g, ''));
                        break;
                    case 'yyyyMMdd':
                        obj[col_] = Number(new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 8));
                        break;
                    case 'yyyyMMddhhmmss':
                        obj[col_] = Number(new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 8) + '' + new Date().toTimeString().split(' ')[0].replace(/\D/g, ''));
                        break;
                }
            });
        }


        //[1.3] Valid set value is auto -1 or yyyyMMdd,hhmmss,yyyyMMddhhmmss
        const cf_auto_null = ['-1|yyyyMMdd', '-1|hhmmss', '-1|yyyyMMddhhmmss'];
        const col_auto_null = _.filter(_.map(config.schema
            , function (val_, key_) { if (cf_auto_null.indexOf(val_) != -1) return key_; else return null; })
            , function (o_) { return o_ != null; });
        const err_auto_null = _.filter(cols, function (o_) { return col_auto_null.indexOf(o_) != -1; });
        //console.log('AUTO_NULL = ', JSON.stringify(col_auto_null));
        //console.log('ERR_AUTO_NULL = ', JSON.stringify(err_auto_null));
        const err_auto_null_results = [];
        col_auto_null.forEach(col_ => {
            const v1 = config.schema[col_].substr(3);
            const v2 = obj[col_];
            if (v2 == null || v2 == -1 || v2 == '-1') {
                obj[col_] = -1;
            } else if (v2 == 'hhmmss' || v2 == 'yyyyMMdd' || v2 == 'yyyyMMddhhmmss') {
                switch (v1) {
                    case 'hhmmss':
                        obj[col_] = Number(new Date().toTimeString().split(' ')[0].replace(/\D/g, ''));
                        break;
                    case 'yyyyMMdd':
                        obj[col_] = Number(new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 8));
                        break;
                    case 'yyyyMMddhhmmss':
                        obj[col_] = Number(new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 8) + '' + new Date().toTimeString().split(' ')[0].replace(/\D/g, ''));
                        break;
                }
            } else {
                err_auto_null_results.push(col_ + ' must be value is -1 or ' + v1);
            }
        });
        if (err_auto_null_results.length > 0)
            return { ok: false, message: err_auto_null_results.join(', ') };

        //[2.1] Valid type data (not belong case 1.3)
        const col_type_data = _.filter(cols, function (o_) { return err_auto_null.indexOf(o_) == -1; });
        console.log('COL_TYPE_DATA = ', JSON.stringify(col_type_data));
        const err_type_data = [];
        col_type_data.forEach(col_ => {
            const typ = typeof config.schema[col_];
            if (typeof obj[col_] != typ)
                err_type_data.push(col_ + ' has type ' + typ + ' and value default is ' + config.schema[col_]);
        });
        if (err_type_data.length > 0)
            return { ok: false, message: err_type_data.join(', ') };

        //[3.1] Valid by config call API
        if (config.valid_add) {
            let cf_addon_valid = Object.keys(config.valid_add);
            cf_addon_valid = _.filter(cf_addon_valid, function (o_) { return col_schema.indexOf(o_) != -1; });

            const col_addon_miss = _.filter(cf_addon_valid, function (o_) { return cols.indexOf(o_) == -1; });
            //console.log('COLS = ', JSON.stringify(cols));
            console.log('CF_API_VALID = ', JSON.stringify(cf_addon_valid));
            console.log('COL_API_MISS = ', JSON.stringify(col_addon_miss));

            if (col_addon_miss.length > 0)
                return { ok: false, message: col_addon_miss.join(', ') + ' is missing' };

            const cf_addon_valid_result = [];
            for (var i = 0; i < cf_addon_valid.length; i++) {
                const col_ = cf_addon_valid[i];
                const fnv = config.valid_add[col_].name;
                const para = config.valid_add[col_].para;

                if (_self.API[fnv] == null)
                    cf_addon_valid_result.push('Function ' + fnv + ' to valid field ' + col_ + ' is missing');
                else {
                    const msg = _self.API[fnv](_self.API, col_, obj, para);
                    if (msg != null && msg.length > 0)
                        cf_addon_valid_result.push(msg);
                }
            }

            console.log('CF_API_VALID_RESULT = ', JSON.stringify(cf_addon_valid_result));
            if (cf_addon_valid_result.length > 0)
                return { ok: false, message: cf_addon_valid_result.join(', ') };
        }

        return { ok: true, object: obj };
    };
};

api.instance = null;
api.getInstance = function () {
    if (this.instance === null) this.instance = new api();
    return this.instance;
};
module.exports = api.getInstance();
