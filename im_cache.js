module.exports = function (config_) {
    this.items = [];

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
    
    this.___convert_unicode_to_ascii = function (str) {
        if (str == null || str.length == 0) return '';
        try {
            str = str.trim();
            if (str.length == 0) return '';

            var AccentsMap = [
                "aàảãáạăằẳẵắặâầẩẫấậ",
                "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
                "dđ", "DĐ",
                "eèẻẽéẹêềểễếệ",
                "EÈẺẼÉẸÊỀỂỄẾỆ",
                "iìỉĩíị",
                "IÌỈĨÍỊ",
                "oòỏõóọôồổỗốộơờởỡớợ",
                "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
                "uùủũúụưừửữứự",
                "UÙỦŨÚỤƯỪỬỮỨỰ",
                "yỳỷỹýỵ",
                "YỲỶỸÝỴ"
            ];
            for (var i = 0; i < AccentsMap.length; i++) {
                var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
                var char = AccentsMap[i][0];
                str = str.replace(re, char);
            }

            str = str
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D");

            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
            str = str.replace(/ + /g, " ");

            str = str.toLowerCase();

        } catch (err_throw) {
            //___log_err_throw('___convert_unicode_to_ascii', err_throw, str);
        }

        return str;
    };
    
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
    this.get_config = () => {
        const _self = this;
        return {
            ok: _self.ok,
            message: _self.message,
            ready: _self.ready,
            busy: _self.busy,
            config: _self.config
        };
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

    this.sync_db = (callback) => {
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

                    const _results = [];
                    _DB_CONN.on('connect', function (err) {
                        if (err) {
                            console.log(err);
                            _self.busy = false;
                            return callback({ ok: false, message: err });
                        }

                        console.log(config.name + ' reading db ...');

                        const request = new _DB_REQUEST(script, function (err_, count_, rows_) {
                            console.log(config.name + ' ok = ' + _results.length);
                            _DB_CONN.close();
                            _self.items = _results;
                            _self.busy = false;
                            callback({ ok: err_ == null, total: _results.length, message: err_ });
                        });

                        request.on('row', function (columns) {
                            const o = {};
                            const ids = [], ascii = [], utf8 = [], org = [];

                            columns.forEach(function (v_) {
                                const col = v_.metadata.colName;
                                const type = v_.metadata.type.name.toLowerCase();
                                const isNumber = type.indexOf('int') != -1;
                                //console.log(col, type, isNumber);

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

                                if (val != null && val != -1) {
                                    if (isNumber) ids.push(val);
                                    else utf8.push(val);
                                }

                                //console.log('????????? = ' + v_.metadata.colName, v_.metadata.type.name);
                                //console.log('????????? = ' + v_.metadata.colName, v_.metadata.type.type);
                            });

                            o['#ids'] = ids.join(' ');
                            o['#utf8'] = utf8.join(' ');
                            o['#ascii'] = _self.___convert_unicode_to_ascii(o['#utf8']);
                            o['#org'] = o['#ids'] + ' ' + o['#utf8'];

                            //console.log('????????? = ', o);

                            o.ix___ = _results.length;
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

    this.sync_redis = function (callback) {
        const _self = this;
        const config = _self.config;

        if (client == null || config.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

        if (_self.items.length == 0) return callback({ ok: true });

        const cmds = [], ids = [];
        for (var i = 0; i < _self.items.length; i++) {
            if (_self.items[i].id == null) continue;
            ids.push(_self.items[i].id);
            cmds.push(['set', _self.items[i].id, JSON.stringify(_self.items[i])]);
        }

        client.multi(cmds).exec(function (err, replies_) {
            if (callback) callback({ ok: err == null, replies: replies_, ids: ids, message: err });
        });
    };
};