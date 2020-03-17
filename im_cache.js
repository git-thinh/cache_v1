module.exports = function (config_) {
    this.items = [];
    this.indexs = {};

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
    let db;

    const redis = require("redis");
    const _ = require('lodash');

    this.ok = false;
    this.message = '';
    this.ready = false;
    this.busy = false;
    this.stop = false;

    this.get_client = () => { return client; };
    this.get_db_sync = () => { return db; };

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
    let id___ = 100;
    this.___guid_id = () => {
        id___++;
        if (id___ > 999) id___ = 100;

        const d = new Date();
        const id = d.toISOString().slice(-24).replace(/\D/g, '').slice(2, 8) + '' +
            d.toTimeString().split(' ')[0].replace(/\D/g, '') + '' + id___;

        return Number(id);
    };

    this.start = function (callback) {
        const _self = this;
        const config = _self.config;

        if (config.name == null || config.name.length == 0 || config.port == 0) {
            _self.message = 'Config of name or schema is null or port = 0';
            return callback(_self);
        }

        const p1 = new Promise(function (resolve, reject) {
            client = redis.createClient({ port: config.port });
            client.on("error", function (error) {
                if (_self.ready) {
                    _self.ready = false;
                    _self.message = error.message;
                    console.log('API_' + config.name + ':', error);
                } else if (_self.message != error.message) {
                    console.log('API_' + config.name + ':', error);
                    _self.message = error.message;
                    return resolve(false);
                }
            });
            client.on("end", function (error) {
                _self.ready = false;
                console.log('API_' + config.name + ': \t-> end');
            });
            client.on("ready", function (error) {
                _self.ready = true;
                _self.ok = true;
                return resolve(true);
            });
            client.on("connect", function (error) {
                _self.ready = true;
                //console.log('API_' + config.name + ': \t-> connect');
            });
        });
        const p2 = new Promise(function (resolve, reject) {
            db = redis.createClient({ port: 19999 });
            db.on("error", function (error) {
                if (_self.ready) {
                    _self.db_ready = false;
                    _self.db_message = error.message;
                    console.log('DB_' + config.name + ':', error);
                } else if (_self.db_message != error.message) {
                    console.log('DB_' + config.name + ':', error);
                    _self.db_message = error.message;
                    return resolve(false);
                }
            });
            db.on("end", function (error) {
                _self.db_ready = false;
                console.log('DB_' + config.name + ': \t-> end');
            });
            db.on("ready", function (error) {
                _self.db_ready = true;
                return resolve(true);
            });
            db.on("connect", function (error) {
                _self.db_ready = true;
                //console.log('API_' + config.name + ': \t-> connect');
            });
        });

        Promise.all([p1, p2]).then(rsa => {
            const it = rsa[0] && rsa[1] ? _self : null;
            let isBreak = false;
            if (it) {
                switch (config.cmd_install) {
                    case 'RESET_FROM_DB':
                        _self.sync_db((m2) => {
                            if (m2.ok) {
                                _self.sync_redis(m3 => {
                                    if (m3.ok) {
                                        callback(_self);
                                        isBreak = true;
                                    }
                                });
                            }
                        });
                        break;
                    case 'LOAD_FROM_REDIS':
                    default:
                        // LOAD_FROM_REDIS
                        _self.redis_get_keys(keys_ => {
                            if (keys_.length > 0) {
                                _self.ram_clear();
                                let keys_k = keys_.length;
                                for (var i = 0; i < keys_.length; i++) {
                                    const key_ = keys_[i];
                                    client.get(key_, function (err3, val_) {
                                        keys_k--;
                                        if (err3) {
                                            console.log('LOAD_FROM_REDIS.' + config.name + '.' + key_, err3);
                                        } else {
                                            //console.log(keys_k, key_);
                                            let o_ = JSON.parse(val_);
                                            o_ = _self.index_addnew(o_);
                                            //console.log(keys_k, o_.id);
                                            _self.items.push(o_);
                                        }
                                        if (keys_k == 0) {
                                            console.log('LOAD_FROM_REDIS done ...');
                                            callback(_self);
                                        }
                                    });
                                }
                                isBreak = true;
                            }
                        });
                        break;
                }
            }
            if (isBreak == false) callback(null);
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
            _self.ram_clear();
            _self.busy = false;
            console.log(config.name, ' -> DELETE_ALL: OK');
            callback({ ok: err == null, message: err });
        });
    };

    this.search_by_config = (cf) => {
        const _self = this;

        let page_size;
        if (cf.page_size) page_size = cf.page_size;
        else page_size = _self.API.page_size;
        if (page_size == null) page_size = 0;
        if (page_size == 0) return { ok: false, code: 'CONFIG_PAGE_SIZE', message: 'Please config page_size > 0' };

        let page_number;
        if (cf.page_number) page_number = cf.page_number;
        else page_number = 1;

        let fn_map, fn_conditions;
        if (cf && typeof cf.fn_map == 'function') fn_map = cf.fn_map;
        if (cf && typeof cf.fn_conditions == 'function') fn_conditions = cf.fn_conditions;

        const total = _self.items.length;
        const ids = [], items = [];
        const no_filter = fn_conditions == null;
        const no_map = fn_map == null;

        let min = 0, max = page_size;
        if (page_number > 1) {
            min = (page_number - 1) * page_size + 1;
            max = page_number * page_size;
        }

        //console.log(page_number, min, max, no_map);

        for (var i = 0; i < total; i++) {
            let o = _self.items[i];
            try {
                if (no_filter) {
                    ids.push(o.id);
                    if (ids.length >= min && ids.length <= max) {
                        if (no_map) items.push(o);
                        else items.push(fn_map(o));
                    }
                } else if (fn_conditions(o)) {
                    ids.push(o.id);
                    if (ids.length >= min && ids.length <= max) {
                        if (no_map) items.push(o);
                        else items.push(fn_map(o));
                    }
                }
            } catch (e1) {
                return { ok: false, code: 'ERR_THROW.SEARCH_BY_CONFIG', message: e1.message, err: e1 };
            }
        }
        return { ok: true, total: total, count: ids.length, data: items, ids: ids };
    };
    this.get_by_ids = (ids, fn_map) => {
        const _self = this;
        if (ids == null || Array.isArray(ids) == false || ids.length == 0) return [];
        let a = [];
        try {
            a = _.map(ids, function (o_) { return fn_map == null ? _self.indexs[o_] : fn_map(_self.indexs[o_]); });
        } catch (e1) {
            return { ok: false, message: e1.message, err: e1, data: [] }
        }
        return { ok: true, data: a };
    };
    this.get_by_id = (id) => {
        const _self = this;
        if (id == null || Array.isArray(id) || _self.indexs[id] == null) return null;
        const pos = _self.indexs[id];
        if (pos < _self.items.length) return _self.items[pos];
        return null;
    };
    this.get_indexs = () => { return this.indexs; };

    this.index_update = function (o) {
        const _self = this;

        const it = _self.indexs[o.id];
        if (it) {
            for (var key in o) it[key] = o[key];

            const ids = [], utf8 = [];
            for (var c in it) {
                if (it[c] != null && it[c] != -1 && c[0] != '#' && c != 'ix___') {
                    if (typeof it[c] == 'number') ids.push(it[c]);
                    else utf8.push(it[c]);
                }
            }

            it['#ids'] = ids.join(' ');
            it['#utf8'] = utf8.join(' ');
            it['#ascii'] = _self.___convert_unicode_to_ascii(it['#utf8']);
            it['#org'] = it['#ids'] + ' ' + it['#utf8'];

            return it;
        }

        return null;
    };
    this.index_addnew = function (o) {
        const _self = this;

        const ids = [], utf8 = [];
        for (var c in o) {
            if (o[c] != null && o[c] != -1 && c[0] != '#' && c != 'ix___') {
                if (typeof o[c] == 'number') ids.push(o[c]);
                else utf8.push(o[c]);
            }
        }

        o['#ids'] = ids.join(' ');
        o['#utf8'] = utf8.join(' ');
        o['#ascii'] = _self.___convert_unicode_to_ascii(o['#utf8']);
        o['#org'] = o['#ids'] + ' ' + o['#utf8'];

        o.ix___ = _self.items.length;
        _self.indexs[o.id] = o.ix___;

        return o;
    };

    this.update_object_for_all = (obj, callback) => {
        const _self = this;

        if (obj == null || typeof obj != 'object' || Object.keys(obj).length == 0) callback({ ok: true });

        const ms = [], ids = [];
        for (var i = 0; i < _self.items.length; i++) {
            for (var col in obj) _self.items[i][col] = obj[col];
            ids.push(_self.items[i].id);
            ms.push(['set', _self.items[i].id, JSON.stringify(_self.items[i])]);
        }

        client.multi(ms).exec(function (err, replies) {
            callback({ ok: err == null, message: err == null ? '' : err.message, replies: replies, ids: ids, err: err });
        });

        //_self.sync_redis(callback);
    };
    this.update_array_objects_by_id = (objs, callback) => {
        const _self = this;

        if (objs == null || Array.isArray(objs) == false) callback({ ok: false, message: 'Input must be a array objects' });
        
        const ms = [], ids = [],not_finds = [];
        for (var i = 0; i < objs.length; i++) {
            if (objs[i].id) {
                let it = _.find(_self.items, function (o_) { return o_.id == objs[i].id; });
                if (it) {
                    for (var col in objs[i]) it[col] = objs[i][col];
                    ids.push(it.id);
                    ms.push(['set', it.id, JSON.stringify(it)]);
                } else not_finds.push(objs[i].id);
            }
        }

        client.multi(ms).exec(function (err, replies) {
            callback({ ok: err == null, message: err == null ? '' : err.message, not_finds: not_finds, replies: replies, ids: ids, err: err });
        });
        //_self.sync_redis(callback);
    };

    this.update_cols_by_id = (obj, callback) => {
        const _self = this;
        const config = _self.config;

        if (client == null || _self.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

        if (obj == null || typeof obj != 'object' || Object.keys(obj).length == 0)
            return callback({ ok: true });

        if (obj.id == null)
            return callback({ ok: false, message: 'Cannot find item has id = ' + obj.id });

        const it = _.find(_self.items, function (o_) { return o_.id = obj.id; });
        if (it == null)
            return callback({ ok: false, message: 'Cannot find item has id = ' + obj.id });

        for (var col in obj) if (col != 'id') it[col] = obj[col];

        client.set(it.id, JSON.stringify(it), function (err) {
            callback({ ok: true, data: it });
        });
    };





    this.addnew = function (obj, callback) {
        const _self = this;
        const config = _self.config;

        if (client == null || config.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

        if (obj == null || Array.isArray(obj) || typeof obj != 'object')
            return callback({ ok: false, message: 'The format of obj must be { ... }' });

        if (obj.id != null && _self.indexs[obj.id] != null)
            return callback({ ok: false, message: 'Object has ID = ' + obj.id + ' exist' });

        if (obj.id == null || obj.id == 0) obj.id = _self.___guid_id();

        const vd = _self.valid_add(obj);
        if (vd.ok) obj = vd.object;
        else return callback(vd);

        obj = _self.index_addnew(obj);

        const p1 = new Promise(function (resolve, reject) {
            client.set(obj.id, JSON.stringify(obj), function (err, res) {
                resolve({ ok: err == null, id: obj.id, object: obj, message: err });
            });
        });
        const p2 = new Promise(function (resolve, reject) {
            const itnew = JSON.parse(JSON.stringify(obj));
            itnew['api___'] = config.name;
            itnew['db___'] = 'INSERT';

            delete itnew['ix___'];
            delete itnew['#ids'];
            delete itnew['#utf8'];
            delete itnew['#ascii'];
            delete itnew['#org'];

            const id = _self.config.id + '.' + obj.id;

            db.set(id, JSON.stringify(itnew), function (err, res) {
                resolve({ ok: err == null, id: obj.id, object: obj, message: err });
            });
        });
        Promise.all([p1, p2]).then(rsa => {
            if (rsa[0].ok && rsa[0].ok) {
                _self.items.push(obj);
                return callback(rsa[0]);
            }

            if (rsa[0].ok) {
                return callback(rsa[1]);
            }

            if (rsa[1].ok) {
                return callback(rsa[0]);
            }
        });
    };
    this.update = function (obj, callback) {
        const _self = this;
        const config = _self.config;

        if (client == null || config.ready == false)
            return callback({ ok: false, message: 'Cache engine disconect: ' + JSON.stringify(config) });

        if (obj == null || Array.isArray(obj) || typeof obj != 'object')
            return callback({ ok: false, message: 'The format of obj must be { ... }' });

        if (obj.id == null || _self.indexs[obj.id] == null)
            return callback({ ok: false, message: 'Cannot find items has ID = ' + obj.id });

        const it = _self.index_update(obj);

        client.set(obj.id, JSON.stringify(it), function (err, res) {
            if (callback) callback({ ok: err == null, id: obj.id, item: it, object: obj, message: err });
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




    this.valid_add = function (obj) {
        const _self = this;
        const config = _self.config;

        try {

            if (config.schema == null) return obj;

            if (obj == null || typeof obj != 'object' || Array.isArray(obj) || Object.keys(obj).length == 0)
                return { ok: false, message: 'Object must be not null or emtpy' };

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
            const cf_auto = ['API', 'KEY_IDENTITY', 'yyyyMMdd', 'hhmmss', 'yyyyMMddhhmmss'];//
            const col_auto = _.filter(_.map(config.schema
                , function (val_, key_) { if (cf_auto.indexOf(val_) != -1 && key_ != 'id') return key_; else return null; })
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
                        //case 'KEY_IDENTITY':
                        //    obj['id'] = _self.API.___guid_id(_self.API, config.id);
                        //    break;
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
            const col_type_data = _.filter(cols, function (o_) { return o_ != 'id' && err_auto_null.indexOf(o_) == -1; });
            //console.log('COL_TYPE_DATA = ', JSON.stringify(col_type_data));
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
                //console.log('CF_API_VALID = ', JSON.stringify(cf_addon_valid));
                //console.log('COL_API_MISS = ', JSON.stringify(col_addon_miss));

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

                //console.log('CF_API_VALID_RESULT = ', JSON.stringify(cf_addon_valid_result));
                if (cf_addon_valid_result.length > 0)
                    return { ok: false, message: cf_addon_valid_result.join(', ') };
            }

            if (obj.id == null) return { ok: false, message: 'The field id is null' };

            return { ok: true, object: obj };
        } catch (e111) {
            return { ok: false, object: obj, message: e111.message, err: e111 };
        }
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
                    const _DB_CONNECTION = require('tedious').Connection;
                    const _DB_REQUEST = require('tedious').Request;
                    const _DB_TYPES = require('tedious').TYPES;

                    const conn_str = config.sql_connect;
                    const sql_text = config.sql_select;
                    const select_top = config.select_top;
                    const _DB_CONN = new _DB_CONNECTION(conn_str);

                    let script = sql_text.trim();
                    if (select_top && select_top.length > 0)
                        script = 'select top ' + select_top + ' ' + script.substr(6, script.length - 6);

                    //console.log(script);

                    const _results = [];
                    _DB_CONN.on('connect', function (err) {
                        if (err) {
                            console.log('DB_CONNECT_ERR: ', err.message);
                            _self.busy = false;
                            return callback({ ok: false, message: err });
                        }

                        console.log(config.name + ' reading db ...');

                        const request = new _DB_REQUEST(script, function (err_, count_, rows_) {
                            if (err_) {
                                console.log('DB_REQUEST -> ERR: ', err_.message);
                                return callback({ ok: false, message: err_.message, err: err_ });
                            }
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

                            _self.indexs[o.id] = o;

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

        if (client == null || _self.ready == false)
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

    this.redis_get_count = function (callback) {
        const _self = this;
        const config = _self.config;

        if (client == null || config.ready == false) return callback(0);
        client.keys('*', function (err, keys) {
            if (err) return callback(0);
            callback(keys.length);
        });
    };
    this.redis_get_keys = function (callback) {
        const _self = this;
        const config = _self.config;

        if (client == null || config.ready == false) return callback([]);
        client.keys('*', function (err, keys) {
            if (err) return callback([]);
            callback(keys);
        });
    };

    this.ram_clear = function () {
        const _self = this;
        _self.items = [];
        _self.indexs = {};
    };
    this.destroy = function () {
        const _self = this;
        try {
            _self.stop = true;
            _self.ram_clear();
            if (client) client.quit();
            if (db) db.quit();
        } catch (e) {
            console.log('err_destroy', e);
        }
    };


    //#region [ HOOK CACHE ]

    const ___notify_write = function (db_action, cache_name, o) { };

    const f_____update_cache_memory___execute = (obj, socket, callback) => {
        try {
            const ___cache = api.cache;

            let k = 0, i = 0;
            let sync_ok = false;

            let id;
            const ids = [];
            let api_name = obj.a;
            let cache_name = api_name ? api_name.toLocaleUpperCase() : '';

            if (!___cache.hasOwnProperty(cache_name)) {
                if (callback) callback({ ok: false, code: 'NOT_EXIST', data: obj, message: 'Cache not exist ' + cache_name });
                return;
            }

            const data = obj.d ? obj.d : [];
            const key = obj.c;
            ////const token = obj.t;
            ////const user_id = obj.ui;
            ////const user_command = obj.uc;
            ////const user_para = obj.up;

            const master_table = obj.mt;
            const master_id = obj.mi;
            const col_update = obj.v;

            switch (key) {
                case 'DB_INSERT':

                    //for (i = 0; i < data.length; i++) {
                    //    k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                    //    if (k == -1) {
                    //        data[i].index___ = ___cache[cache_name].length;

                    //        data[i] = ___row_changed_update_cache(cache_name, data[i]);

                    //        ___cache[cache_name].push(data[i]);
                    //        ___index[cache_name][data[i].id] = ___cache[cache_name].length - 1;

                    //        ids.push(data[i].id);
                    //        sync_ok = true;
                    //    }
                    //}

                    //if (master_table && master_id) {
                    //    ___row_changed_update_cache(master_table, master_id);
                    //}

                    break;
                case 'DB_UPDATE':

                    //for (i = 0; i < data.length; i++) {
                    //    k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                    //    if (k != -1) {
                    //        data[i] = ___row_changed_update_cache(cache_name, data[i]);
                    //        ___cache[cache_name][k] = data[i];
                    //        ids.push(data[i].id);
                    //        sync_ok = true;
                    //    }
                    //}

                    //if (master_table && master_id) {
                    //    ___row_changed_update_cache(master_table, master_id);
                    //}

                    break;
                case 'DB_UPDATE_V':
                    //if (col_update) {
                    //    for (i = 0; i < data.length; i++) {
                    //        k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                    //        if (k != -1) {
                    //            ___cache[cache_name][k][col_update] = data[i]['v'];
                    //            if (col_update == 'caller_online_id')
                    //                ___cache[cache_name][k].int_queued = -1;

                    //            ids.push(data[i].id);

                    //            sync_ok = true;
                    //        }
                    //    }
                    //}
                    break;
                case 'DB_UPDATE_KEYS':
                    for (i = 0; i < data.length; i++) {
                        k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                        if (k != -1) {
                            for (var col_ in data[i])
                                if (col_ != 'id') ___cache[cache_name][k][col_] = data[i][col_];
                            ids.push(data[i].id);
                            sync_ok = true;
                        }
                    }
                    break;
                default:
                    //if (key.startsWith('CACHE_ALL_POL_')) {
                    //    cache_name = key.substr('CACHE_ALL_'.length);
                    //    if (___cache[cache_name]) {
                    //        ___cache[cache_name] = [];
                    //        cache___initFromDB(cache_name.toLowerCase() + '.sql');
                    //    }
                    //    if (socket) socket.destroy();
                    //}
                    break;
            }

            if (sync_ok) {
                if (data && data.length > 0) ___notify_write(key, cache_name, data[0]);
            }

            const m_ = { ok: sync_ok, ids: ids, api: cache_name, action: key, data: obj };
            if (callback) callback(m_);
            //_im_sync_v1.write(m_);

            //console.log('', cache_name, sync_ok, obj);
        } catch (e) {
            const m_ = { ok: false, code: 'ERR_THROW', data: obj, message: e.message, err: e };
            if (callback) callback(m_);
            //_im_sync_v1.write(m_);
        }
    };

    function http___hook_cache(api, req, res, config, body, type_) {
        if (api == null || req == null || res == null) return null;

        let str_api, str_action;
        if (req.query && req.query.api && req.query.action) {
            str_api = req.query.api.toUpperCase();
            str_action = req.query.action.toLowerCase();
        }
        if (body && body.action___) str_action = body.action___.toLowerCase();
        if (body && body.api___) str_api = body.api___.toUpperCase();
        str_action = type_;

        if (str_api == null || str_api.length == 0 ||
            str_action == null || str_action.length == 0) {
            res.json({ ok: false, code: 'HTTP___', message: 'URI must be format is {api___:..., action___:...} Or /?api=...&action=...' });
            return;
        }

        if (api.cache && api.cache[str_api] == null) {
            res.json({ ok: false, code: 'HTTP___', message: 'Cache engine not exist ' + str_api });
            return;
        }

        let a = [];
        let k, v, pos = -1;

        const query = {};
        //#region [ PATH, QUERY ]

        let path = req.originalUrl;
        if (path.startsWith('/?')) path = path.substr(2);
        path = path.split('&&').join('^^');

        a = path.split('&');
        for (var i = 0; i < a.length; i++) {
            pos = a[i].indexOf('=');
            if (pos > 0) {
                k = a[i].substr(0, pos);
                v = a[i].substr(pos + 1, a[i].length - pos - 1);
                v = v.split('^^').join('&&');
                v = decodeURIComponent(v);
                query[k] = v;
            }
        }

        //#endregion

        let fn_conditions;
        //#region [ FN_CONDITIONS ]

        let str_conditions;
        if (query && query.fn_conditions) conditions = query.fn_conditions;
        if (str_conditions == null || conditions.length == 0) str_conditions = null;
        if (body && body.fn_conditions) str_conditions = body.fn_conditions;

        if (str_conditions) {
            try {
                fn_conditions = new Function('o', str_conditions);
                fn_conditions(null);
                fn_conditions({});
            } catch (e1) {
                fn_conditions = null;
                res.json({ ok: false, code: 'HTTP___.ERR_CREATE_FN_CONDITIONS', message: e1.message, err: e1 });
                return;
            }
        }

        //#endregion

        let fn_map;
        //#region [ FN_MAP ]

        let str_map;
        if (query && query.fn_map) str_map = query.fn_map;
        if (str_map == null || str_map.length == 0) str_map = null;
        if (body && body.fn_map) str_map = body.fn_map;
        //console.log('str_map === ', str_map);    

        if (str_map) {
            try {
                fn_map = new Function('o', str_map);
                fn_map(null);
                fn_map({});
            } catch (e1) {
                fn_map = null;
                res.json({ ok: false, code: 'HTTP___.ERR_CREATE_FN_MAP', message: e1.message, err: e1 });
                return;
            }
        }

        //#endregion

        let page_number = 1;
        //#region [ page_number ]

        let v_page_number;
        if (query && query.page_number) v_page_number = query.page_number;
        if (v_page_number == null || v_page_number.length == 0) v_page_number = null;
        if (body && body.page_number) v_page_number = body.page_number;

        if (v_page_number) {
            v_page_number = v_page_number.toString().trim().split('.')[0].trim();
            if (v_page_number.length > 0) {
                const n_page_number = Number(v_page_number);
                if (isNaN(n_page_number) || n_page_number < 1) {
                    res.json({ ok: false, code: 'HTTP___.ERR_CONFIG_PAGE_NUMBER', message: 'Config page_number must be > 0' });
                    return;
                } else {
                    page_number = n_page_number;
                }
            }
        }

        //#endregion

        let page_size = api.page_size == null ? 0 : api.page_size;
        //console.log('api.page_size === ', api.page_size);
        //#region [ page_size ]

        let v_page_size;
        if (query && query.page_size) v_page_size = query.page_size;
        if (v_page_size == null || v_page_size.length == 0) v_page_size = null;
        if (body && body.page_size) v_page_size = body.page_size;
        //console.log('v_page_size === ', v_page_size);

        if (v_page_size) {
            v_page_size = v_page_size.toString().trim().split('.')[0].trim();
            if (v_page_size.length > 0) {
                const n_page_size = Number(v_page_size);
                if (isNaN(n_page_size) || n_page_size < 1) {
                    res.json({ ok: false, code: 'HTTP___.ERR_CONFIG_PAGE_NUMBER', message: 'Config page_size must be > 0' });
                    return;
                } else if (n_page_size > 0) {
                    //console.log('n_page_size === ', n_page_size);
                    page_size = n_page_size;
                }
            }
        }

        //#endregion

        const config_ = {
            cache: str_api,
            action: str_action,
            path: path,
            query: query,
            page_number: page_number,
            page_size: page_size,
            body: body,
            fn_map: fn_map,
            fn_conditions: fn_conditions
        };

        if (str_action == 'search')
            http___hook_cache___search(api, req, res, config_, body);
        else if (str_action == 'update')
            http___hook_cache___update(api, req, res, config_, body);
        else {
            res.json({ ok: false, message: 'Value of action___ | action = search|update' });
        }
    }

    function http___hook_cache___update(api, req, res, config, body) {
        f_____update_cache_memory___execute(body, null, (m1) => {
            m1.request = config;
            res.json(m1);
        });
    }

    function http___hook_cache___search(api, req, res, cf, body) {

        if (cf == null || cf.cache == null || ___cache[cf.cache] == null) {
            res.json({ ok: false, code: 'CONFIG_CACHE_NAME', message: 'Cache name not exist ' + cf.cache });
            return;
        }
        try {
            const ___cache_items = ___cache[cf.cache];

            let page_size;
            if (cf.page_size) page_size = cf.page_size;
            else page_size = 15;
            if (page_size == null) page_size = 0;
            if (page_size == 0) {
                res.json({ ok: false, code: 'CONFIG_PAGE_SIZE', message: 'Please config page_size > 0' });
                return;
            }

            let page_number;
            if (cf.page_number) page_number = cf.page_number;
            else page_number = 1;

            let fn_map, fn_conditions;
            if (cf && typeof cf.fn_map == 'function') fn_map = cf.fn_map;
            if (cf && typeof cf.fn_conditions == 'function') fn_conditions = cf.fn_conditions;

            const total = ___cache_items.length;
            const ids = [], items = [];
            const no_filter = fn_conditions == null;
            const no_map = fn_map == null;

            let min = 0, max = page_size;
            if (page_number > 1) {
                min = (page_number - 1) * page_size + 1;
                max = page_number * page_size;
            }

            //console.log(page_number, min, max, no_map);

            for (var i = 0; i < total; i++) {
                let o = ___cache_items[i];
                try {
                    if (no_filter) {
                        ids.push(o.id);
                        if (ids.length >= min && ids.length <= max) {
                            if (no_map) items.push(o);
                            else items.push(fn_map(o));
                        }
                    } else if (fn_conditions(o)) {
                        ids.push(o.id);
                        if (ids.length >= min && ids.length <= max) {
                            if (no_map) items.push(o);
                            else items.push(fn_map(o));
                        }
                    }
                } catch (e1) {
                    res.json({ ok: false, code: 'ERR_THROW.SEARCH_BY_CONFIG', message: e1.message, err: e1 });
                    return;
                }
            }

            res.json({ ok: true, total: total, count: ids.length, data: items, ids: ids });

        } catch (e123) {
            res.json({ ok: false, code: 'ERR_THROW_123.SEARCH_BY_CONFIG', message: e123.message, err: e123 });
        }
    }

    ////_HTTP_APP.post('/api-v1/update', (req, res) => {
    ////    const api = { cache: ___cache, _: _ };
    ////    const config = {};
    ////    const body = req.body;
    ////    http___hook_cache(api, req, res, config, body, 'update');
    ////});

    ////_HTTP_APP.post('/api-v1/search', (req, res) => {
    ////    const api = { cache: ___cache, _: _ };
    ////    const config = {};
    ////    const body = req.body;
    ////    http___hook_cache(api, req, res, config, body, 'search');
    ////});

    ////_HTTP_APP.post('/api-v1/push-notify', (req, res) => {
    ////    ___notify_write(null, null, req.body);
    ////    res.json({ ok: true });
    ////});

    //#endregion

};