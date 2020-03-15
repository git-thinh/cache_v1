module.exports = function (config_) {
    this.config = {
        id: 0,
        scope: null,
        name: '',
        port: 0,
        schema: null,

        cmd_install: '',
        valid_add: null,

        select_top: null,
        sql_select: null,
        sql_connect: null
    };
    if (config_) for (var key in config_) this.config[key] = config_[key];

    let client;

    const redis = require("redis");
    const _ = require('lodash');

    const _DB_CONNECTION = require('tedious').Connection;
    const _DB_REQUEST = require('tedious').Request;
    const _DB_TYPES = require('tedious').TYPES;

    this.ok = false;
    this.message = '';
    this.ready = false;
    this.busy = false;

    this.start = function (callback) {
        const _self = this;
        const config = _self.config;

        if (config.name == null || config.name.length == 0 || config.port == 0) {
            _self.message = 'Config of name or schema is null or port = 0';
            return callback(_self);
        }

        client = redis.createClient({ port: config.port });
        client.on("error", function (error) {
            if (_self.ready) {
                _self.ready = false;
                _self.message = error.message;
                console.log('API_' + config.name + ':', error);
            } else if (_self.message != error.message) {
                console.log('API_' + config.name + ':', error);
                _self.message = error.message;
                return callback(_self);
            }
        });
        client.on("end", function (error) {
            _self.ready = false;
            console.log('API_' + config.name + ': \t-> end');
        });
        client.on("ready", function (error) {
            _self.ready = true;
            _self.ok = true;
            return callback(_self);
        });
        client.on("connect", function (error) {
            _self.ready = true;
            //console.log('API_' + config.name + ': \t-> connect');
        });
    };

    this.get_config = (callback) => {
        const _self = this;
        callback({
            ok: _self.ok,
            message: _self.message,
            ready: _self.ready,
            busy: _self.busy,
            config: _self.config
        });
    };
    this.load_db = (callback) => {
        const _self = this;
        const config = _self.config;

        if (_self.busy)
            return callback({ ok: false, message: '[load_db]: Cache engine is busy' });

        _self.delete_all(rs_ => {
            if (rs_.ok) {
                _self.busy = true;

                try {
                    const conn_str = config.sql_connect;
                    const sql_text = config.sql_select;
                    const select_top = config.select_top;
                    const _DB_CONN = new _DB_CONNECTION(conn_str);

                    let script = sql_text.trim();
                    if (select_top && select_top.length > 0)
                        script = 'select top ' + select_top + ' ' + script.substr(6, script.length - 6);

                    _DB_CONN.on('connect', function (err) {
                        if (err) {
                            console.log(err);
                            _self.busy = false;
                            return callback({ ok: false, message: err });
                        }

                        console.log(config.name + ' db ...');

                        const _results = [];
                        const request = new _DB_REQUEST(script, function (err_, count_, rows_) {
                            console.log(config.name + ' ok = ' + _results.length);
                            _DB_CONN.close();
                            _self.busy = false;
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

                } catch (e1) {
                    _self.busy = false;
                    return callback({ ok: false, message: e1.message });
                }
            } else {
                return callback(rs_);
            }
        });
    };
    this.delete_all = function (callback) {
        const _self = this;
        const config = _self.config;

        if (_self.busy)
            return callback({ ok: false, message: '[delete_all]: Cache engine is busy' });

        if (client == null || _self.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

        _self.busy = true;
        client.flushall('ASYNC', function (err) {
            _self.busy = false;
            console.log(config.name, ' -> DELETE_ALL: OK');
            callback({ ok: err == null, message: err });
        });
    };

};