const ___PORT_API = 3500;
const ___PORT_TCP_SERVER = 3456;
console.log(___PORT_API, ___PORT_TCP_SERVER);
const ___LOG_PORT = 1515;
const ___LOG_ERROR_PORT = 1510;
const ___LOG_POS_MSG_PORT = 1616;
const ___LOG_AFFILATE_MSG_PORT = 1717;
const ___LOG_DONTUPHEU_MSG_PORT = 1818;

const _USER_ID_ADMIN_CALL = 617;
let _thread_page_size = 1000;
const _sql_select_top = ''; //top 500


const _JOB = require('cron').CronJob;
const _DGRAM = require('dgram');

//#region [ LOG UDP ]


const ___log_post_api = (...agrs) => { LOG_TCP_FILE.push('LOG_POST_API ' + new Date().toLocaleString() + ': \t' + JSON.stringify(agrs)); }
const ___log = (...agrs) => { LOG_TCP_FILE.push('LOG ' + new Date().toLocaleString() + ': \t' + JSON.stringify(agrs)); }
const ___log_err_throw = (func_name, err_throw, para1, para2, para3) => {
    const s = 'LOG_ERR_THROW ' + new Date().toLocaleString() + ' [ ' + func_name + ' ]';
    LOG_ERROR_MSG.push([s, err_throw, para1, para2, para3]);
}
const ___log_tcp = (...agrs) => { LOG_TCP_FILE.push('LOG_TCP ' + new Date().toLocaleString() + ': \t' + JSON.stringify(agrs)); }
const ___log_tcp_db2cache = (...agrs) => { LOG_TCP_FILE.push('LOG_TCP_DB2CACHE ' + new Date().toLocaleString() + ': \t' + JSON.stringify(agrs)); }
//console.log = (...agrs) => { LOG_TCP_FILE.push('LOG ' + new Date().toLocaleString() + ': \t' + JSON.stringify(agrs)); }

const LOG_ERROR_MSG = [];
let LOG_ERROR_MSG_WRITING = false;
new _JOB('* * * * * *', function () {
    try {
        if (LOG_ERROR_MSG_WRITING) return;
        if (LOG_ERROR_MSG.length > 0) {
            LOG_ERROR_MSG_WRITING = true;
            const text = LOG_ERROR_MSG.shift();
            var buf = Buffer.from(text);
            const udp = _DGRAM.createSocket('udp4');
            udp.send(buf, 0, buf.length, ___LOG_ERROR_PORT, '127.0.0.1', (err) => {
                LOG_ERROR_MSG_WRITING = false;
                udp.close();
            });
        }
    } catch (e1) { }
}).start();

const LOG_TCP_FILE = [];
let LOG_TCP_FILE_WRITING = false;
new _JOB('* * * * * *', function () {
    try {
        if (LOG_TCP_FILE_WRITING) return;
        if (LOG_TCP_FILE.length > 0) {
            LOG_TCP_FILE_WRITING = true;
            const text = LOG_TCP_FILE.shift();
            var buf = Buffer.from(text);
            const udp = _DGRAM.createSocket('udp4');
            udp.send(buf, 0, buf.length, ___LOG_PORT, '127.0.0.1', (err) => {
                LOG_TCP_FILE_WRITING = false;
                udp.close();
            });
        }
    } catch (e1) { }
}).start();
const savelog_error = function (type, data) {
    var text = '\nLOG_ERROR ' + new Date().toLocaleString() + ' --> Type=' + type + '\n' + '--> Para= ' + data + '\r\n';
    LOG_TCP_FILE.push(text);
};
LOG_TCP_FILE.push(new Date().toLocaleString() + ' -> SERVER ' + ___PORT_API + ' ' + ___PORT_TCP_SERVER + ' ... ');


const LOG_POS_MSG = [];
let LOG_POS_MSG_WRITING = false;
new _JOB('* * * * * *', function () {
    try {
        if (LOG_POS_MSG_WRITING) return;
        if (LOG_POS_MSG.length > 0) {
            LOG_POS_MSG_WRITING = true;
            const text = LOG_POS_MSG.shift();
            var buf = Buffer.from(text);
            const udp = _DGRAM.createSocket('udp4');
            udp.send(buf, 0, buf.length, ___LOG_POS_MSG_PORT, '127.0.0.1', (err) => {
                //console.log('??????????????????? [1] ', text);
                LOG_POS_MSG_WRITING = false;
                // Send success
                udp.close();
            });
        }
    } catch (e1) { }
}).start();
const savelog_pos = function (type, data) {
    var text = '\nLOG_POS ' + new Date().toLocaleString() + ' --> Type=' + type + '\n' + '--> Para= ' + data + '\r\n';
    LOG_POS_MSG.push(text);
};


const LOG_AFFILATE_MSG = [];
let LOG_AFFILATE_MSG_WRITING = false;
new _JOB('* * * * * *', function () {
    try {
        if (LOG_AFFILATE_MSG_WRITING) return;
        if (LOG_AFFILATE_MSG.length > 0) {
            LOG_AFFILATE_MSG_WRITING = true;
            const text = LOG_AFFILATE_MSG.shift();
            var buf = Buffer.from(text);
            const udp = _DGRAM.createSocket('udp4');
            udp.send(buf, 0, buf.length, ___LOG_AFFILATE_MSG_PORT, '127.0.0.1', (err) => {
                LOG_AFFILATE_MSG_WRITING = false;
                udp.close();
            });
        }
    } catch (e1) { }
}).start();
const savelog_affilate = function (type, data) {
    var text = '\nLOG_AFFILATE ' + new Date().toLocaleString() + ' --> Type=' + type + '\n' + '--> Para= ' + data + '\r\n';
    LOG_AFFILATE_MSG.push(text);
};


const LOG_DONTUPHEU_MSG = [];
let LOG_DONTUPHEU_MSG_WRITING = false;
new _JOB('* * * * * *', function () {
    try {
        if (LOG_DONTUPHEU_MSG_WRITING) return;
        if (LOG_DONTUPHEU_MSG.length > 0) {
            LOG_DONTUPHEU_MSG_WRITING = true;
            const text = LOG_DONTUPHEU_MSG.shift();
            var buf = Buffer.from(text);
            const udp = _DGRAM.createSocket('udp4');
            udp.send(buf, 0, buf.length, ___LOG_DONTUPHEU_MSG_PORT, '127.0.0.1', (err) => {
                LOG_DONTUPHEU_MSG_WRITING = false;
                udp.close();
            });
        }
    } catch (e1) { }
}).start();
const savelog_dontupheu = function (type, data) {
    var text = '\nLOG_DONTUPHEU ' + new Date().toLocaleString() + ' --> Type=' + type + '\n' + '--> Para= ' + data + '\r\n';
    LOG_DONTUPHEU_MSG.push(text);
};

//#endregion

//#region [ DATABASE ]

const _DB_CACHE_123 = {
    user: 'pol',
    password: '',
    server: '',
    database: 'POL_20191230',
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
        idleTimeoutMillis: 300000,
        max: 100
    }
};

const _DB_CACHE_POS_AMAZON = {
    user: 'mobile',
    password: '',
    server: '',
    database: 'Release_FB51_App',
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
        idleTimeoutMillis: 300000,
        max: 100
    }
};
  
//#endregion

//#region [ VARIABLE ]


//#region [ VARIABLE ]

let ___CACHE_DONE = false;
const ___page_size = 30;

//----------------------------------------------------------------------------

const { Worker, MessageChannel, workerData } = require('worker_threads');

const excel = require('node-excel-export');
const _NET = require('net');
const _PATH = require('path');
const _FS = require('fs');
const _SQL = require('mssql');
const _ = require('lodash');
const _URL = require('url');

const _FETCH = require('node-fetch');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//----------------------------------------------------------------------------

let IP___LOCAL = '';
const _OS = require('os');
const _IFACES = _OS.networkInterfaces();

Object.keys(_IFACES).forEach(function (ifname) {
    _IFACES[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }
        //console.log(iface.address);
        if (iface.address && iface.address.indexOf('192.168.') != -1) IP___LOCAL = iface.address;
    });
});

console.log('-> ', IP___LOCAL, ___PORT_API, ___PORT_TCP_SERVER);
console.log('\n' + new Date().toLocaleString() + '\n');

//#endregion

//#region [ db___execute_callback ]

const affilate___fetch_callback = function (type_pol_pos_id, id, IsF88Cus, cancelReason, cancelContent) {
    try {
        // khi huy don set value cho cancelReason, cancelContent
        // khi hoan tat hop dong thi moi co IsF88Cus

        if (IsF88Cus == null || isNaN(Number(IsF88Cus))) IsF88Cus = 0;
        if (cancelReason == null) cancelReason = '';
        if (cancelContent == null) cancelContent = '';

        let p;
        if (type_pol_pos_id == 'pos')
            p = _.find(___cache['POL_PAWN'], function (o) { return o.int_pawn_id_pos == id; });
        else
            p = _.find(___cache['POL_PAWN'], function (o) { return o.id == id; });

        if (p) {



            const obj = {
                pawnOnlineId: p.id,
                action: p.int_status,
                referenceTypeStr: p.int_reference_type,
                transactionID: p.str_reference_affilate_id,
                isShop: 1,
                cancelReason: cancelReason,
                cancelContent: cancelContent,
                IsF88Cus: IsF88Cus
            };
            const url = 'https://apilienket.f88.vn/SendAffiliate';
            //const url = 'http://192.168.10.20:1809/SendAffiliate';
            _FETCH(url, { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) })
                .then(res => res.json())
                .then(m => {
                    // console.log('?????????' + url, obj, m);
                    savelog_affilate('AFFLIATE', JSON.stringify(obj) + '\n---\n' + JSON.stringify(m));
                }).catch(err => {
                    // console.log(url, err.message);
                    savelog_affilate('ERROR_AFFLIATE', JSON.stringify(err.message));
                });
        }
    } catch (err_throw) {
        ___log_err_throw('affilate___fetch_callback', err_throw);
    }
};

const ___exe_callback = {
    pol_process_biz_addnew: function (objInput, objResult) {
        try {
            if (objResult && objResult.ok == true) {
                if (objInput && objInput.int_pol_pawn_id) {
                    affilate___fetch_callback('pol', objInput.int_pol_pawn_id, null, objInput.str_canceled_reason, objInput.str_content);
                }
            }
        } catch (err_throw) {
            ___log_err_throw('pol_process_biz_addnew', err_throw);
        }
    },
    pol_process_biz_chiadon: function (objInput, objResult) {
        try {
            if (objResult && objResult.ok == true) {
                if (objInput && objInput.obj_item_check) {
                    var ids = objInput.obj_item_check.split(',');
                    Array.from(ids).forEach(id_ => affilate___fetch_callback('pol', id_));
                }
            }
        } catch (err_throw) {
            ___log_err_throw('pol_process_biz_chiadon', err_throw);
        }
    }
};

const _TCP_POOL_123 = new _SQL.ConnectionPool(_DB_CACHE_123);
const _TCP_POOL_123_CONNECT = _TCP_POOL_123.connect();
(async function () {
    try {
        await _TCP_POOL_123_CONNECT;
    } catch (err_throw) {
        ___log_err_throw('await _TCP_POOL_123_CONNECT', err_throw);
    }
})();

const db___execute_callback__done = function (socket_response, request_, store, data, callback_ok, callback_err, result) {
    try {
        let m_ = { ok: false, message: '', callback: '', data: null };

        if (result.output) {
            m_.ok = result.output.___ok;
            m_.message = result.output.___msg;
            m_.callback = result.output.___callback;
            try {
                if (result.output.___data
                    && result.output.___data.length > 0) {
                    if (result.output.___data[0] == '[' || result.output.___data[0] == '{') {
                        m_.data = JSON.parse(result.output.___data);
                    } else {
                        m_.data = result.output.___data;
                    }
                }
            } catch (err_) {
                ___log_err_throw('db___execute_callback__done -> JSON', err_);
            }
        }

        if (callback_ok) callback_ok(socket_response, m_);

    } catch (err_throw) {
        ___log_err_throw('db___execute_callback__done', err_throw);
    }
};

const db___execute_callback = function (socket_response, request_, store, data, callback_ok, callback_err) {
    try {
        let cmd = _TCP_POOL_123.request();
        cmd.input('IP___', _SQL.VarChar(36), IP___LOCAL);
        cmd.input('USER_ID___', _SQL.Int, 0);
        cmd.input('TOKEN___', _SQL.VarChar(_SQL.MAX), '');

        let v, t, errs = [], v_encode;
        for (let key in data) {
            if (key != '___exe_callback') {
                v = data[key];
                if (v == undefined) {
                    //console.log('!!!!!!!!!!!!', key, v);
                    errs.push('[' + key + '] must be not NULL');
                } else {
                    t = typeof v == 'string';
                    cmd.input(key, t ? _SQL.NVarChar(_SQL.MAX) : _SQL.BigInt, data[key]);
                }
            }
            //console.log(key, v, t);
        }

        cmd.output('___ok', _SQL.Bit, 0);
        cmd.output('___msg', _SQL.NVarChar(255), '');
        cmd.output('___callback', _SQL.NVarChar(255), '');
        cmd.output('___data', _SQL.NVarChar(_SQL.MAX), '{}');

        if (errs.length > 0) {
            const val = errs.join('|');
            //	___log_post_api(store + ' -> PARA_ERROR = ', val);

            if (callback_err) callback_err(socket_response, val);
        } else {
          //  ___log_post_api(store + ' -> EXE ... ');

            cmd.stream = true;
            cmd.execute(store);

            cmd.on('recordset', columns => { });

            cmd.on('row', row => {
                const key = row['db_action'];
                const rm = {
                    t: '9A6AE499-8F1F-4886-B382-2840C2D6EC6B',
                    c: key,
                    a: row['api'],
                    mt: row['mt'],
                    mi: row['mi'],
                    v: row['v'],
                    d: JSON.parse(row['sjson'])
                };
              //  ___log_post_api(store + ' -> RESULT = ', data, rm);

                switch (key) {
                    case 'CACHE_ALL_USER':
                        ___MSG_DB2CACHE____CACHE_ALL_USER.push({ client: null, text: '!' + JSON.stringify(rm) });
                        break;
                    case 'CACHE_ALL_SHOP':
                        ___MSG_DB2CACHE____CACHE_ALL_SHOP.push({ client: null, text: '!' + JSON.stringify(rm) });
                        break;
                    case 'CACHE_ALL_GROUP':
                        ___MSG_DB2CACHE____CACHE_ALL_GROUP.push({ client: null, text: '!' + JSON.stringify(rm) });
                        break;
                    case 'DB_INSERT':
                        ___MSG_DB2CACHE____DB_INSERT.push({ client: null, text: '!' + JSON.stringify(rm) });
                        break;
                    case 'DB_UPDATE':
                        ___MSG_DB2CACHE____DB_UPDATE.push({ client: null, text: '!' + JSON.stringify(rm) });
                        break;
                    case 'DB_UPDATE_V':
                        ___MSG_DB2CACHE____DB_UPDATE_V.push({ client: null, text: '!' + JSON.stringify(rm) });
                        break;
                    default:
                        ___MSG_DB2CACHE.push({ client: null, text: '!' + JSON.stringify(rm) });
                        break;
                }
            });

            cmd.on('error', err_ => {
                ___log_err_throw('db___execute_callback ' + store + ' -> CMD_ERROR = ', err_);
            });

            cmd.on('done', result => {
                //___log_post_api(store + ' -> CMD_DONE = ', result);
                db___execute_callback__done(socket_response, request_, store, data, callback_ok, callback_err, result);
            });
        }
    } catch (err_throw) {
        ___log_err_throw('db___execute_callback', err_throw, store, data);
    }
};

const ___MSG_DB2CACHE____CACHE_ALL_USER = [];
const ___MSG_DB2CACHE____CACHE_ALL_SHOP = [];
const ___MSG_DB2CACHE____CACHE_ALL_GROUP = [];

const ___MSG_DB2CACHE____DB_INSERT = [];
const ___MSG_DB2CACHE____DB_UPDATE = [];
const ___MSG_DB2CACHE____DB_UPDATE_V = [];

new _JOB('* * * * * *', function () {
    if (___MSG_DB2CACHE____CACHE_ALL_USER.length > 0) {
        LOG_TCP_FILE.push('JOB ___MSG_DB2CACHE____CACHE_ALL_USER     -> LEN = ' + ___MSG_DB2CACHE____CACHE_ALL_USER.length);
        const m = ___MSG_DB2CACHE____CACHE_ALL_USER.shift();
        f_____update_cache_memory(m);
    }
}).start();

new _JOB('* * * * * *', function () {
    if (___MSG_DB2CACHE____CACHE_ALL_SHOP.length > 0) {
        LOG_TCP_FILE.push('JOB ___MSG_DB2CACHE____CACHE_ALL_SHOP     -> LEN = ' + ___MSG_DB2CACHE____CACHE_ALL_SHOP.length);
        const m = ___MSG_DB2CACHE____CACHE_ALL_SHOP.shift();
        f_____update_cache_memory(m);
    }
}).start();

new _JOB('* * * * * *', function () {
    if (___MSG_DB2CACHE____CACHE_ALL_GROUP.length > 0) {
        LOG_TCP_FILE.push('JOB ___MSG_DB2CACHE____CACHE_ALL_GROUP    -> LEN = ' + ___MSG_DB2CACHE____CACHE_ALL_GROUP.length);
        const m = ___MSG_DB2CACHE____CACHE_ALL_GROUP.shift();
        f_____update_cache_memory(m);
    }
}).start();

const f___MSG_DB2CACHE____DB_UPDATE_V = function () {
    if (___MSG_DB2CACHE____DB_UPDATE_V.length > 0) {
        LOG_TCP_FILE.push('JOB ___MSG_DB2CACHE____DB_UPDATE_V        -> LEN = ' + ___MSG_DB2CACHE____DB_UPDATE_V.length);
        const m = ___MSG_DB2CACHE____DB_UPDATE_V.shift();
        f_____update_cache_memory(m);
    }
    setTimeout(function () { f___MSG_DB2CACHE____DB_UPDATE_V(); }, 1);
};

const f___MSG_DB2CACHE____DB_INSERT = function () {
    if (___MSG_DB2CACHE____DB_INSERT.length > 0) {
        LOG_TCP_FILE.push('JOB ___MSG_DB2CACHE____DB_INSERT          -> LEN = ' + ___MSG_DB2CACHE____DB_INSERT.length);
        const m = ___MSG_DB2CACHE____DB_INSERT.shift();
        f_____update_cache_memory(m);
    }
    setTimeout(function () { f___MSG_DB2CACHE____DB_INSERT(); }, 1);
};

const f___MSG_DB2CACHE____DB_UPDATE = function () {
    if (___MSG_DB2CACHE____DB_UPDATE.length > 0) {
        LOG_TCP_FILE.push('JOB ___MSG_DB2CACHE____DB_UPDATE          -> LEN = ' + ___MSG_DB2CACHE____DB_UPDATE.length);
        const m = ___MSG_DB2CACHE____DB_UPDATE.shift();
        f_____update_cache_memory(m);
    }
    setTimeout(function () { f___MSG_DB2CACHE____DB_UPDATE(); }, 1);
};

f___MSG_DB2CACHE____DB_UPDATE_V();
f___MSG_DB2CACHE____DB_INSERT();
f___MSG_DB2CACHE____DB_UPDATE();

const f_____update_cache_memory = (m) => {
    try {
        if (m) {
            const text = m.text, socket = m.client;
         //   ___log('JOB ___MSG_DB2CACHE____SQL = ', text);
            if (text && text.length > 36) {
                const s = text.substr(1);

                //console.log(s);
                //console.log('\r\n\r\n');
                //return;

                if (s[0] == '{' && s[s.length - 1] == '}') {
                    let validJson = false;
                    let validTextCommand = false;
                    let obj;
                    try {
                        obj = JSON.parse(s);
                        if (typeof obj == 'object') validJson = true;
                    } catch (e1) {
                        validJson = false;
                    }
                    if (validJson) {
                        let k = 0, i = 0;
                        let sync_ok = false;

                        let id;
                        let api_name = obj.a;
                        let cache_name = api_name ? api_name.toLocaleUpperCase() : '';

                        const data = obj.d ? obj.d : [];
                        const key = obj.c;
                        const token = obj.t;
                        const user_id = obj.ui;
                        const user_command = obj.uc;
                        const user_para = obj.up;

                        const master_table = obj.mt;
                        const master_id = obj.mi;
                        const col_update = obj.v;

                        switch (key) {
                            case 'CACHE_ALL_USER':
                                if (___cache['USER']) {
                                    ___cache['USER'] = [];
                                    cache___initFromDB('user.sql');
                                    //socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                }
                                socket.destroy();

                                break;
                            case 'CACHE_ALL_SHOP':

                                if (___cache['SHOP']) {
                                    ___cache['SHOP'] = [];
                                    cache___initFromDB('shop.sql');
                                    //socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                }
                                socket.destroy();

                                break;
                            case 'CACHE_ALL_GROUP':

                                if (___cache['GROUP']) {
                                    ___cache['GROUP'] = [];
                                    cache___initFromDB('group.sql');
                                    //socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                }
                                socket.destroy();

                                break;
                            case 'DB_INSERT':
                                //if(cache_name == 'POL_PAWN') console.log(data);

                                for (i = 0; i < data.length; i++) {
                                    k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                    if (k == -1) {
                                        data[i].index___ = ___cache[cache_name].length;

                                        data[i] = ___row_changed_update_cache(cache_name, data[i]);

                                        ___cache[cache_name].push(data[i]);
                                        ___index[cache_name][data[i].id] = ___cache[cache_name].length - 1;

                                        sync_ok = true;
                                    }
                                }

                                if (master_table && master_id) {
                                    ___row_changed_update_cache(master_table, master_id);
                                }

                                break;
                            case 'DB_UPDATE':
                                //if(cache_name == 'POL_PAWN') console.log(data);

                                for (i = 0; i < data.length; i++) {
                                    k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                    if (k != -1) {
                                        data[i] = ___row_changed_update_cache(cache_name, data[i]);
                                        ___cache[cache_name][k] = data[i];
                                        sync_ok = true;
                                    }
                                }

                                if (master_table && master_id) {
                                    ___row_changed_update_cache(master_table, master_id);
                                }

                                break;
                            case 'DB_UPDATE_V':
                                if (col_update) {

                                    for (i = 0; i < data.length; i++) {
                                        k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                        if (k != -1) {
                                            ___cache[cache_name][k][col_update] = data[i]['v'];
                                            if (col_update == 'caller_online_id')
                                                ___cache[cache_name][k].int_queued = -1;
                                            //console.log(key, cache_name, data[i].id);
                                        }
                                    }

                                }
                                break;
                            default:
                                if (key.startsWith('CACHE_ALL_POL_')) {
                                    cache_name = key.substr('CACHE_ALL_'.length);
                                    if (___cache[cache_name]) {
                                        ___cache[cache_name] = [];
                                        cache___initFromDB(cache_name.toLowerCase() + '.sql');
                                        //socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                    }
                                    socket.destroy();
                                }
                                break;
                        }

                      //  ___log('JOB ___MSG_DB2CACHE____SQL RESULT = ' + key, sync_ok, text);

                        if (sync_ok) {

                            ___job_reduce(cache_name);
                            if (data && data.length > 0) ___notify_write(key, cache_name, data[0]);
                        }
                        //console.log('', cache_name, sync_ok, obj);
                    }
                }
            }
        }
    } catch (err_throw) {
        ___log_err_throw('f_____update_cache_memory', err_throw, m);
    }
};

//#endregion

//#region [ BASE ]

const ___guid = function () {
    return 'id-xxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const ___base64Random = function () {
    return '12345xxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const ___convert_unicode_to_ascii = function (str) {
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
        ___log_err_throw('___convert_unicode_to_ascii', err_throw, str);
    }

    return str;
};

const ___convert_number = function (text, val_default) {
    if (text) {
        const v = Number(text);
        if (isNaN(v) == false) return v;
    }
    if (val_default == null) val_default = -1;
    return val_default;
};

const ___format_text_before_update_database = function (text) {
    if (text == null || text == undefined) text = '';
    if (typeof text != 'string') text = JSON.stringify(text);
    return text;
};

//#endregion

//#region [ JOB_REDUCE: GRPC RAISE NOTIFY WHEN CHANGED CACHE ]

let ___job_reduce = function (api_name, item) {

};

//#endregion

//#region [ TCP_SERVER ]

let _SUBSCRIBES_CLIENTS = [];

const ___MSG_DB2CACHE = [];
new _JOB('* * * * * *', function () {
    if (___MSG_DB2CACHE.length > 0) {
        const m = ___MSG_DB2CACHE.shift();
        f_____update_cache_memory(m);
    }
}).start();

const ___MSG_AFFILATE = [];
const ___PAWN_ONLINE_AFFILATE___CONVERT_PARA = function (lading, is_auto_test) {
    try {
        //var lading = {};
        if (lading == null) return {};

        var para = {
            pawn_online_id: -1,
            customer_id: -1,
            lng_money: null, //Int64 : Tiền KH muốn vay
            int_days: null, //int : Số ngày muốn vay 

            int_status: 1, //@Status tinyint: 1 Chưa tư vấn 
            int_queued: null, //@Queued
            int_trans_to_shop_date: null, //@TransToShopTime
            int_trans_to_shop_time: null, //@TransToShopTime

            int_region_id: null, //int

            str_cus_name: null, //@Name
            str_cus_phone: null, //@Mobile
            str_cus_address: null, // @Address
            str_cus_province: null, //@Province

            int_priority: null, //@Priority

            //pawn_detail
            int_urgent_level: null, //@UrgentLevel
            int_order_priority: null, //@OrderPriority 
            int_reference_type: null, //@ReferenceType
            str_reference_affilate_id: null, //@TransactionID

            int_current_group_id: null, //@CurrentGroupID
            str_group_ids_reveiced: null, //@SteepedGroupID
            area_id: null, //@POLRegion -> ID miền 0=Miền Bắc; 1=Miền Nam
            caller_shop_id: null, //@ShopCallerID -> Lưu vào caller_shop_id (chia luôn cho shop); ID CVKD xử lý đơn

            str_asset_type_name: null, //@Asset
            str_link: null, //@Link
            str_trademark: null, //@Trademark
            str_channel_name: null, //@Source
            str_description: null, //@Description

            //-------------------------------------------

            asset_type_id: null, // int
            channel_id: null, // int 

            city_id: null, // int
            district_id: null, // int

            str_city_name: null, // nvarchar(255)
            str_district_name: null // nvarchar(255)
        };

        if (lading.PawnOnlineId) para.pawn_online_id = lading.PawnOnlineId;
        if (lading.CustomerId) para.customer_id = lading.CustomerId;

        //#region [ LadingPage ]

        ////public class LadingPage {
        ////    public bool ? Delay { get; set; }
        ////    public int ? OrderPriority { get; set; } 
        ////    public string Trademark { get; set; }
        ////    public string Source { get; set; } 

        ////----------------------------------------------------------------------------------------------

        ////    public string name { get; set; } //tên khách hàng
        ////    public string phone { get; set; } // số điện thoại
        ////    public string select1 { get; set; } // loại tài sản
        ////    public string select2 { get; set; } // tỉnh thành phố (địa chỉ khách hàng)
        ////    public string select3 { get; set; } // tiền vay

        ////    public int Status { get; set; } // Mã khách hàng
        ////    public string RegionID { get; set; }

        ////    public string CurrentGroupID { get; set; }
        ////    public string POLRegion { get; set; }
        ////    public string ShopCallerID { get; set; }

        ////    public string Description { get; set; } // Số ngày muốn vay 
        ////    public string link { get; set; } // tên tài sản

        ////    public int ? ReferenceType { get; set; } // type of MasOffer, affilate 
        ////    public string TransactionID { get; set; } // MasOffer, affilate id


        ////----------------------------------------------------------------------------------------------

        ////    public Int64 Money { get; set; } // Tiền KH muốn vay
        ////    public int Days { get; set; } // Số ngày muốn vay 
        ////    public string ReferenceTypeStr { get; set; } // type of MasOffer, affilate 
        ////    public int PawnID { get; set; } // Mã hợp đồng
        ////    public int ? PawnType { get; set; } // Loại hợp đồng
        ////    public int CustomerID { get; set; } // Mã khách hàng
        ////    public int AffCustomerID { get; set; } // Mã khách hàng
        ////    public int AffPawnID { get; set; } // Mã khách hàng
        ////    public string Publisher { get; set; } // Mã Publisher
        ////    public string AT_conversion_result_id { get; set; } // Mã Publisher
        ////    public string AT_transaction_value { get; set; } // Mã Publisher
        ////    public string LoginToken { get; set; } // MasOffer, affilate id
        ////    public string Province { get; set; }
        ////    public string District { get; set; }
        ////}

        //INSERT INTO [pos].[PawnOnline]
        //    ([Asset],[Trademark],[Created],[CustomerID],[Status]
        //    ,[Source],[CurrentGroupID],[SteepedGroupID],[Priority],[UrgentLevel]
        //    ,[LastTrans],[Url],[ReferenceId],[ReferenceType],[OrderPriority]
        //    ,[Queued],[RegisterDate],[Description],[POLRegion],[ShopCallerID]
        //    ,[TransToShopTime])
        //VALUES
        //    (@Asset,@Trademark,(SELECT DATEADD(hour, 7, GETUTCDATE())),@CustomerID,1,
        //    @Source,@CurrentGroupID,@SteepedGroupID,@Priority,@UrgentLevel,
        //    (SELECT DATEADD(hour, 7, GETUTCDATE())),@Url,@ReferenceId,@ReferenceType,@OrderPriority,
        //    @Queued,(SELECT DATEADD(hour, 7, GETUTCDATE())),@Description,@POLRegion,@ShopCallerID,
        //    @TransToShopTime);

        if (is_auto_test == true) {
            lading = {
                Delay: null, //bit -> @Queued = lading.Delay ? 1 : 0 ????????????????????????????????????????
                OrderPriority: null,// 1,2,3,4,5
                Trademark: null,
                Source: null,

                name: null, //string: tên khách hàng -> @Name
                phone: null, //string: số điện thoại -> @Mobile
                Province: null,//string: -> tỉnh thành phố -> @Province
                select2: null, //string : tỉnh thành phố -> địa chỉ -> @Address


                Status: null, //int : Mã khách hàng
                Money: null, //Int64 : Tiền KH muốn vay
                Days: null, //int : Số ngày muốn vay 
                RegionID: null,//string :

                SteepedGroupID: null,//string :
                CurrentGroupID: null,//string :
                POLRegion: null,//string :
                ShopCallerID: null,//string :

                link: null, //string : tên tài sản
                ReferenceType: null, //int : type of MasOffer, affilate 

                select1: null, //string : loại tài sản -> @Asset
                Description: null, //string 
                //----------------------------------------------------------------
                ReferenceTypeStr: null, //string : type of MasOffer, affilate 
                select3: null, //string : tiền vay
                PawnID: null, //int : Mã hợp đồng
                PawnType: null, //int : Loại hợp đồng
                CustomerID: null, //int : Mã khách hàng
                AffCustomerID: null, //int : Mã khách hàng
                AffPawnID: null, //int : Mã khách hàng
                Publisher: null, //string : Mã Publisher
                AT_conversion_result_id: null, //string : Mã Publisher
                AT_transaction_value: null, //string : Mã Publisher
                TransactionID: null, //string : MasOffer, affilate id
                LoginToken: null, //string : MasOffer, affilate id
                District: null,//string :
            };
        }

        //#endregion

        //#region [ STUB FOR TEST ]

        if (is_auto_test == true) {
            var _items, _index;
            var _str_cus_phone = '0' + (Math.floor(Math.random() * 999999999) + 100000000);
            var _int_phone = parseInt(_str_cus_phone);

            _items = ___cache['POL_CHANNEL'];
            _index = Math.floor(Math.random() * _items.length);
            var _channel_id = _items[_index].id;
            var _str_channel_name = _items[_index].str_name;

            _items = _.filter(___cache['REGION'], function (o) { return o.int_pid == 0; });
            _index = Math.floor(Math.random() * _items.length);
            var _city_id = _items[_index].id;
            var _str_city_name = _items[_index].str_name;

            _items = _.filter(___cache['REGION'], function (o) { return o.int_pid == _city_id; });
            _index = Math.floor(Math.random() * _items.length);
            var _district_id = _items[_index].id;
            var _str_district_name = _items[_index].str_name;
            //-----------------------------------------

            _items = ___cache['USER'];
            _index = Math.floor(Math.random() * _items.length);

            var _user_created_id = _items[_index].id;
            var _shop_id = _items[_index].shop_id;
            var _group_id = _items[_index].group_id;
            if (_int_phone % 2 == 0) {
                //chintn
                _user_created_id = 617;
                _group_id = 44;
                _shop_id = 21;
            } else if (_int_phone % 4 == 0) {
                //yennh
                _user_created_id = 619;
                _group_id = 44;
                _shop_id = 21;
            } else if (_int_phone % 3 == 0) {
                //kiennt Nhóm CH 82 Phùng Hưng
                _user_created_id = 703;
                _group_id = 26;
                shop_id = 147;
            } else if (_int_phone % 5 == 0) {
                //hoant Nhóm CH 82 Phùng Hưng
                _user_created_id = 507;
                _group_id = 26;
                _shop_id = 147;
            }

            //-----------------------------------------

            _items = ___cache['POL_ASSET_TYPE'];
            _index = Math.floor(Math.random() * _items.length);
            var _asset_type_id = _items[_index].id;
            var _str_asset_type_name = _items[_index].str_name;

            //-----------------------------------------
            //-----------------------------------------

            lading.Delay = _int_phone % 2 == 0 ? 0 : 1; //bit -> @Queued = lading.Delay ? 1 = 0 ????????????????????????????????????????
            lading.OrderPriority = Math.floor(Math.random() * 5) + 1;//int 1;2;3;4;5
            lading.link = 'http://' + ___guid();//string
            lading.Trademark = ___test_random_text(9);//string
            lading.Source = _str_channel_name; //string

            lading.RegionID = '' + _district_id;//string =

            lading.name = ___test_random_text(3); //string= tên khách hàng -> @Name
            lading.phone = _str_cus_phone; //string= số điện thoại -> @Mobile
            lading.Province = _str_city_name;//string= -> tỉnh thành phố -> @Province
            lading.select2 = ___test_random_text(9); //string = tỉnh thành phố -> địa chỉ -> @Address

            lading.RegionID = '' + _district_id;
            lading.Status = 1; //int = Mã khách hàng
            lading.Money = Math.floor(Math.random() * 99999999) + 1000000; //Int64 = Tiền KH muốn vay
            lading.Days = Math.floor(Math.random() * 99) + 30; //int = Số ngày muốn vay 

            lading.SteepedGroupID = '' + _group_id;//string =
            lading.CurrentGroupID = '' + _group_id;//string =
            lading.POLRegion = '' + (_int_phone % 2 == 0 ? 0 : 1);//string =
            lading.ShopCallerID = '' + _shop_id;//string =

            lading.ReferenceType = Math.floor(Math.random() * 9) + 1; //int = type of MasOffer; affilate 
            lading.ReferenceTypeStr = ___guid().split('-')[0]; //string = type of MasOffer; affilate 

            lading.select1 = _str_asset_type_name; //string = loại tài sản -> @Asset
            lading.Description = ___test_random_text(15); //string 
        }

        //#endregion

        //-------------------------------------------------------------------------------------------------------

        //#region [ @Money, @Days, @RegionID ]

        //para.lng_money = ___convert_number(lading.Money); //Int64 : Tiền KH muốn vay
        //para.int_days = ___convert_number(lading.Days); //int : Số ngày muốn vay 
        para.lng_money = ___convert_number(lading.select3, 0); //Int64 : Tiền KH muốn vay
        para.int_days = 0; //int : Số ngày muốn vay 
        para.int_region_id = ___convert_number(lading.RegionID);

        //#endregion

        //-------------------------------------------------------------------------------------------------------

        //#region [ @Name, @Mobile, @Address, @Province ]

        //paramCustomer.Add("@Name", lading.name); // tên khách hàng
        //paramCustomer.Add("@Mobile", lading.phone); // điện thoại
        //paramCustomer.Add("@Address", lading.select2); // tỉnh thành phố
        //paramCustomer.Add("@Province", lading.Province); // tỉnh thành phố

        para.str_cus_name = ___format_text_before_update_database(lading.name);
        para.str_cus_phone = ___format_text_before_update_database(lading.phone);
        para.str_cus_address = ___format_text_before_update_database(lading.select2);
        para.str_cus_province = ___format_text_before_update_database(lading.Province);

        //#endregion

        //-------------------------------------------------------------------------------------------------------

        //#region [ @Priority, @UrgentLevel, @OrderPriority ]

        var PAWN_ONLINE_PRIORITY = {
            Low: 1,//Thấp
            Medium: 2,//Trung bình
            Hight: 3//Cao
        };

        // SteepedGroupID = CurrentGroupID 
        // paramPawn.Add("@Priority", (byte)PawnOnlinePriority.Medium + "");
        // paramPawn.Add("@UrgentLevel", (byte)PawnOnlineUrgentLevel.Medium + "");
        // mặc định = 2

        para.int_priority = PAWN_ONLINE_PRIORITY.Medium;
        para.int_urgent_level = PAWN_ONLINE_PRIORITY.Medium;
        para.int_order_priority = ___convert_number(lading.OrderPriority);

        //#endregion

        //-------------------------------------------------------------------------------------------------------

        //#region [ @CurrentGroupID, @SteepedGroupID, @POLRegion, @ShopCallerID ]

        para.int_current_group_id = ___convert_number(lading.CurrentGroupID);
        para.str_group_ids_reveiced = ___format_text_before_update_database(lading.SteepedGroupID);
        para.area_id = ___convert_number(lading.POLRegion, 0);
        para.caller_shop_id = ___convert_number(lading.ShopCallerID);

        //#endregion

        //-------------------------------------------------------------------------------------------------------

        //#region [ @ReferenceType, @TransactionID ]

        para.int_reference_type = ___convert_number(lading.ReferenceType);
        para.str_reference_affilate_id = ___format_text_before_update_database(lading.TransactionID);

        //#endregion

        //-------------------------------------------------------------------------------------------------------

        //#region [ @Asset, @Link, @Trademark, @Source, @Description ]

        para.str_asset_type_name = ___format_text_before_update_database(lading.select1); // tên loại tài sản
        para.str_link = ___format_text_before_update_database(lading.link);
        para.str_trademark = ___format_text_before_update_database(lading.Trademark);
        para.str_channel_name = ___format_text_before_update_database(lading.Source);
        para.str_description = ___format_text_before_update_database(lading.Description);

        //#endregion

        //-------------------------------------------------------------------------------------------------------

        //#region [ @Queued, @TransToShopTime ]

        //-> Đơn chưa được chia
        para.int_group_id == 44;

        //paramPawn.Add("@Queued", lading.Delay ? 1 : 0);
        //paramPawn.Add("@TransToShopTime", null);
        para.int_queued = lading.Delay == true ? 1 : 0;
        para.int_trans_to_shop_date = -1;
        para.int_trans_to_shop_time = -1;



        //////if (para.int_group_id == 44) {
        //////    //-> Đơn chưa được chia

        //////    //paramPawn.Add("@Queued", lading.Delay ? 1 : 0);
        //////    //paramPawn.Add("@TransToShopTime", null);
        //////    para.int_queued = lading.Delay == true ? 1 : 0;
        //////    para.int_trans_to_shop_date = -1;
        //////    para.int_trans_to_shop_time = -1;
        //////}
        //////else {
        //////    //-> Đơn đã dc chia đơn từ trên đầu phễu

        //////    //paramPawn.Add("@Queued", null);
        //////    //paramPawn.Add("@TransToShopTime", DateTime.Now);

        //////    para.int_queued = -1; //null
        //////    para.int_trans_to_shop_date = ___convert_datetime_yyyyMMdd();
        //////    para.int_trans_to_shop_time = ___convert_datetime_HHmmss();
        //////}

        //#endregion

        //-------------------------------------------------------------------------------------------------------

        para.asset_type_id = -1;
        var asset_ = _.find(___cache['POL_ASSET_TYPE'], function (o) { return o.str_name == para.str_asset_type_name; });
        if (asset_) { para.asset_type_id = asset_.id; }
        else {
            db___execute_callback(null, null, 'mobile.pol_pol_asset_type_biz_addnew', { str_asset_type_name: para.str_asset_type_name },
                function (r_, m_) {
                    if (m_.ok && m_.data) {
                        para.asset_type_id = m_.data;
                    }
                },
                function (r_, m_) {
                }
            );
        }

        para.channel_id = -1;
        var channel_ = _.find(___cache['POL_CHANNEL'], function (o) { return o.str_name == para.str_channel_name; });
        if (channel_) {
            para.channel_id = channel_.id;
        }
        else {
            db___execute_callback(null, null, 'mobile.pol_pol_channel_biz_addnew', { str_channel_name: para.str_channel_name },
                function (r_, m_) {
                    if (m_.ok && m_.data) {
                        para.channel_id = m_.data;
                    }
                },
                function (r_, m_) {
                }
            );
        }


        para.city_id = -1;
        para.str_city_name = '';
        para.district_id = para.int_region_id;
        para.str_district_name = '';
        var district_ = _.find(___cache['REGION'], function (o) { return o.id == para.int_region_id; });
        if (district_) {
            para.city_id = district_.int_pid;
            para.str_city_name = district_.str_parent_name;
            para.str_district_name = district_.str_name;
        }

        if (para.lng_money == -1) para.lng_money = 0;
        if (para.int_days == -1) para.int_days = 0;

        // Nếu group_id != 44 && group_id > 0 -> đã chia trên đầu phễu
        // Nếu group_id == 44 -> sẽ phải chia tự động
        if (para.int_current_group_id == 44) {
            para.int_queued = 0; // đơn chưa chia
            para.caller_shop_id = -1;
        } else if (para.int_current_group_id != 44 && para.int_current_group_id > 0) {
            para.int_queued = -1; // đơn đã chia cho 1 nhóm nào đó
            para.str_group_ids_reveiced = '' + para.int_current_group_id;

        }

        return para;

    } catch (err_throw) {
        ___log_err_throw('___PAWN_ONLINE_AFFILATE___CONVERT_PARA', err_throw, lading);
    }

    return null;
};
new _JOB('* * * * * *', function () {
    if (___MSG_AFFILATE.length > 0) {
        const m = ___MSG_AFFILATE.shift();
        try {
            if (m) {
                const text = m.text, socket = m.client;
                if (socket && text && text.length > 36) {
                    let lading, para;
                    const type = text[0].charCodeAt(0);

                    savelog_dontupheu(type, text);

                    switch (type) {
                        case 106:
                            //#region [ PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS ]

                            /// <summary>
                            /// Tiếp nhận đơn đầu phễu
                            /// Input: data = new string []{ item_json, ... }
                            /// item_josn = ???????
                            /// Ouput: oResult( ok: true|false; data: [{...}]; là mảng đối tượng { int_customer_id: ..., int_pawn_online_id: ... } )
                            /// </summary>
                            /// PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS = 106

                            lading = JSON.parse(text.substr(37));
                            para = ___PAWN_ONLINE_AFFILATE___CONVERT_PARA(lading);

                            //console.log('PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS lading =', lading);
                            //console.log('PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS para =', para);

                            db___execute_callback(socket, null, 'mobile.pol_pawn_biz_job_PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS', para,
                                function (client, msg_) {
                                    client.write(JSON.stringify(msg_));
                                    client.destroy();
                                },
                                function (client, msg_) {
                                    client.write(JSON.stringify(msg_));
                                    client.destroy();
                                });

                            //#endregion
                            break;
                        case 107:
                            //#region [ PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS ]

                            /// <summary>
                            /// Cập nhật đơn đầu phễu
                            /// Input: data = new string []{ item_json, ... }
                            /// Ouput: oResult( ok: true|false; data: là string thông báo nếu false )
                            /// </summary>
                            /// PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS = 107


                            lading = JSON.parse(text.substr(37));
                            para = ___PAWN_ONLINE_AFFILATE___CONVERT_PARA(lading);

                            //console.log('PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS lading =', lading);
                            //console.log('PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS para =', para);

                            db___execute_callback(socket, null, 'mobile.pol_pawn_biz_job_PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS', para,
                                function (client, msg_) {
                                    client.write(JSON.stringify(msg_));
                                    client.destroy();
                                },
                                function (client, msg_) {
                                    client.write(JSON.stringify(msg_));
                                    client.destroy();
                                });

                            //#endregion
                            break;
                        default:
                            socket.destroy();
                            break;
                    }
                }
            }
        } catch (err_throw) {
            ___log_err_throw('RUN_JOB: ___MSG_AFFILATE', err_throw, m);
        }
    }
}).start();

let ___tokens = {};
const ___MSG_TOKEN = [];
const ___user_build_profile_token = function (user_id, token) {
    const user_ = _.find(___cache['USER'], function (o) { return o.id == user_id; });

    //  console.log('222', user_);
    if (user_) {
        user_.ok = true;
        user_.int_pol_status = 1; // 0: offline; 1: online

        let user = JSON.parse(JSON.stringify(user_));
        delete user['str_password'];

        let cf = {}, acf = (___cache['POS_SYS_CONFIG'] == null ? [] : ___cache['POS_SYS_CONFIG']);
        for (var i = 0; i < acf.length; i++) {
            let o = ___cache['POS_SYS_CONFIG'][i];
            cf[o.str_code] = o.str_value;
        }

        //console.log('LOGIN = ', acf, cf);

        user.pos_sys_config = cf;

        user.ok = true;

        if (token == null || token == undefined) {
            //user.str_token = user___get_token(user.user_id, user.str_user_name, user.scope_ids);
            token = user.user_id + ___base64Random();
        }
        user.str_token = token;

        let scopes = [];
        if (user.scope_ids) {
            if (user.scope_ids == '*') {
                for (const field in _SYS_SCOPE)
                    _SYS_SCOPE[field].forEach(sc => scopes.push(sc));
            } else {
                user.scope_ids.split(',').forEach(field => {
                    if (_SYS_SCOPE[field] && _SYS_SCOPE[field].length > 0)
                        _SYS_SCOPE[field].forEach(sc => scopes.push(sc));
                });
            }
        }

        user.scope_urls = scopes;
        //user.redirect_url = scopes.length == 0 ? '/' : (scopes[0].str_code + '?token=' + user.str_token);
        user.redirect_url = scopes.length == 0 ? '/' : scopes[0].str_code;

        //console.log("LOGIN: OK = ", user);
        return user;
    }

    return { ok: false };
};
new _JOB('* * * * * *', function () {
    if (___MSG_TOKEN.length > 0) {
        const m = ___MSG_TOKEN.shift();
        try {
            if (m) {
                const text = m.text, socket = m.client;
                if (socket && text && text.length > 36) {
                    let user_id, token, key, user;
                    const type = text[0].charCodeAt(0);

                    savelog_pos(type, text);

                    switch (type) {
                        case 1:
                            //TOKEN_RETURN_LOGIN_SUCCESS = 1,
                            user_id = Number(text.substr(37));
                            //console.log('TOKEN_RETURN_LOGIN_SUCCESS = ', user_id);
                            if (isNaN(user_id) == false) {
                                token = user_id + ___base64Random();
                                key = token.substr(0, 36);
                                ___tokens[key] = user_id;
                                socket.write(token);

                                savelog_pos(type, token);

                                socket.destroy();
                            }
                            break;
                        case 2:
                            //TOKEN_VALID = 2,
                            token = text.substr(37);
                            key = token.substr(0, 36);
                            //console.log('TOKEN_VALID = ', token);
                            if (___tokens[key]) {
                                user_id = ___tokens[key];
                                user = ___user_build_profile_token(user_id, token);
                                //console.log(user_id, user);
                                if (user) {
                                    socket.write(JSON.stringify(user));
                                    savelog_pos(type, JSON.stringify(user));
                                }
                            }

                            socket.destroy();
                            break;
                        default:
                            socket.destroy();
                            break;
                    }
                }
            }
        } catch (err_throw) {
            ___log_err_throw('RUN_JOB: ___MSG_TOKEN', err_throw, m);
        }
    }
}).start();

const ___MSG_POS = [];
new _JOB('* * * * * *', function () {
    if (___MSG_POS.length > 0) {
        const m = ___MSG_POS.shift();
        try {
            if (m) {
                const text = m.text, socket = m.client;
                if (socket && text && text.length > 36) {
                    const para = text.substr(37);
                    const type = text[0].charCodeAt(0);

                    savelog_pos(type, para);
                    //  console.log('1111', type, para);

                    let pawn_id;
                    let obj = {}, a = [], arr = [], str = '', ok = false;
                    switch (type) {
                        case 102:
                            //#region [ PAWN_ONLINE_UPDATE_SUCCESS ]

                            arr = para.split('|');
                            if (arr.length > 1) {
                                pawn_id = Number(arr[0]);

                                if (!isNaN(pawn_id)) {

                                    obj = { int_pawn_id: pawn_id };

                                    //console.log('PAWN_ONLINE_UPDATE_SUCCESS obj =', obj);

                                    db___execute_callback(socket, null, 'mobile.pol_pawn_biz_PAWN_ONLINE_POS_PUSH_STATUS_SUCCESS', obj,
                                        function (client, msg_) {
                                            client.write(JSON.stringify(msg_));
                                            savelog_pos(type, JSON.stringify(msg_));
                                            client.destroy();
                                            affilate___fetch_callback('pos', pawn_id);
                                        },
                                        function (client, msg_) {
                                            client.write(JSON.stringify(msg_));
                                            savelog_pos(type, JSON.stringify(msg_));
                                            client.destroy();
                                        });
                                }
                            } else {
                                socket.write(JSON.stringify({ ok: false, message: 'Error: Input data = new string[]{ PawnId, PawnOnlineId } ' }));
                                savelog_pos(type, JSON.stringify({ ok: false, message: 'Error: Input data = new string[]{ PawnId, PawnOnlineId } ' }));
                                socket.destroy();
                            }

                            //#endregion
                            break;
                        case 104:
                            //#region [ PAWN_ONLINE_POS_CHECK_PHONE_LIST_SUCCESS ]

                            /// <summary>
                            /// Thực hiện kiểm tra số điện thoại khi tạo hợp đồng trên POS có trên hệ thống POL ko?
                            /// Input: data = new string[]{ Phone1, yyyyMMdd_1, Phone2, yyyyMMdd_2 ... }
                            /// + Phone là số điện thoại trên hợp đồng đang tạo mới
                            /// + yyyyMMdd là ngày tháng của hợp đồng cuối cùng của số điện thoại trên
                            /// Ouput: oResult( ok: true|false; data: [{...}] là mảng đối tượng { int_pawn_online_id: ..., int_create_date: .... } )
                            /// + int_pawn_online_id là mã đơn online
                            /// + int_create_date là ngày tạo đơn online
                            /// </summary>
                            /// PAWN_ONLINE_POS_CHECK_PHONE_LIST_SUCCESS = 104

                            a = para.split('|');
                            //console.log('1', a);
                            if (a.length > 0 && a.length % 2 == 0) {
                                const phones = _.filter(a, function (o, index_) { return index_ % 2 == 0; });
                                const dates = _.filter(a, function (o, index_) { return index_ % 2 != 0; });

                                //console.log('2', phones, dates);

                                if (phones.length == dates.length) {
                                    const arr_phone_date = _.map(phones, function (o, index_) {
                                        return { phone: o, date: dates[index_] };
                                    });

                                    //console.log('3', arr_phone_date);

                                    let arr_result = [], int_date = 0;
                                    ok = false;
                                    arr_phone_date.forEach(pi => {
                                        ok = false;
                                        if (pi.date.length == 0) {

                                            //console.log(pi.phone)

                                            arr_result = _.filter(___cache['POL_PAWN'],
                                                function (o) {
                                                    return o.___customer != null &&
                                                        o.___customer.str_phone == pi.phone &&
                                                        o.int_status == 2; //[1] tim trong don dang xu ly
                                                });

                                            if (arr_result.length == 0) {
                                                arr_result = _.filter(___cache['POL_PAWN'],
                                                    function (o) {
                                                        //return o.___customer && str.indexOf('|' + o.___customer.str_phone + '|') != -1;
                                                        return o.___customer != null &&
                                                            o.___customer.str_phone == pi.phone &&
                                                            o.int_status == 1;//[2] tim trong don da huy
                                                    });
                                            }

                                            //console.log(pi.phone, arr_result)
                                        } else {
                                            int_date = Number(pi.date);
                                            if (!isNaN(int_date) && pi.date != null && pi.date.length == 8) {

                                                //console.log('4', int_date, pi.phone);

                                                arr_result = _.filter(___cache['POL_PAWN'],
                                                    function (o) {
                                                        //return o.___customer && str.indexOf('|' + o.___customer.str_phone + '|') != -1;
                                                        return o.___customer != null &&
                                                            o.___customer.str_phone == pi.phone &&
                                                            o.int_created_date != null &&
                                                            o.int_created_date >= int_date &&
                                                            o.int_status == 2; //[1] tim trong don dang xu ly
                                                    });

                                                if (arr_result.length == 0) {
                                                    arr_result = _.filter(___cache['POL_PAWN'],
                                                        function (o) {
                                                            //return o.___customer && str.indexOf('|' + o.___customer.str_phone + '|') != -1;
                                                            return o.___customer != null &&
                                                                o.___customer.str_phone == pi.phone &&
                                                                o.int_created_date != null &&
                                                                o.int_created_date >= int_date &&
                                                                o.int_status == 1;//[2] tim trong don da huy
                                                        });
                                                }
                                            }
                                        }

                                        if (arr_result.length > 0) {
                                            arr.push({ phone: pi.phone, date: pi.date, pawns: arr_result });
                                            ok = true;
                                        }

                                        if (ok == false) arr.push({ phone: pi.phone, date: pi.date, pawns: [] });
                                    });
                                    socket.write(JSON.stringify({ ok: true, data: arr }));
                                    savelog_pos(type, JSON.stringify({ ok: true, data: arr }));
                                } else {
                                    socket.write(JSON.stringify({ ok: false, data: 'Dữ liệu sai định dạng data = new string[]{ Phone1, yyyyMMdd_1, Phone2, yyyyMMdd_2 ... } ' }));
                                    savelog_pos(type, JSON.stringify({ ok: false, data: 'Dữ liệu sai định dạng data = new string[]{ Phone1, yyyyMMdd_1, Phone2, yyyyMMdd_2 ... } ' }));
                                }
                            }

                            socket.destroy();

                            //#endregion
                            break;
                        case 105:
                            //#region [ PAWN_ONLINE_POS_PUSH_STATUS_SUCCESS ]

                            /// <summary>
                            /// Cập nhật trạng thái thành công của đơn online đã được tạo
                            /// Input: data = new string[]{ PawnId, PawnOnlineId }
                            /// Ouput: oResult( ok: true|false; data: là dữ liệu thông báo nếu thất bại )
                            /// </summary>
                            /// PAWN_ONLINE_POS_PUSH_STATUS_SUCCESS = 105

                            arr = para.split('|');
                            if (arr.length > 1) {
                                pawn_id = Number(arr[0]);
                                const pawn_online_id = Number(arr[1]);

                                if (!isNaN(pawn_id) && !isNaN(pawn_online_id)) {

                                    obj = { int_pawn_id: pawn_id, int_pawn_online_id: pawn_online_id };

                                    //console.log('PAWN_ONLINE_POS_PUSH_STATUS_SUCCESS obj =', obj);

                                    db___execute_callback(socket, null, 'mobile.pol_pawn_biz_PAWN_ONLINE_POS_PUSH_STATUS_SUCCESS', obj,
                                        function (client, msg_) {
                                            client.write(JSON.stringify(msg_));
                                            savelog_pos(type, JSON.stringify(msg_));
                                            client.destroy();
                                        },
                                        function (client, msg_) {
                                            client.write(JSON.stringify(msg_));
                                            savelog_pos(type, JSON.stringify(msg_));
                                            client.destroy();
                                        });
                                }
                            } else {
                                socket.write(JSON.stringify({ ok: false, message: 'Error: Input data = new string[]{ PawnId, PawnOnlineId } ' }));
                                savelog_pos(type, JSON.stringify({ ok: false, message: 'Error: Input data = new string[]{ PawnId, PawnOnlineId } ' }));
                                socket.destroy();
                            }

                            //#endregion
                            break;
                        case 121:
                            //#region [ PAWN_CREATE_NEW_SUCCESS ]

                            /// <summary>
                            /// Tạo Pawn thành công (bảng pos.Pawn)
                            /// Input:
                            ///     data = new string[]{ PawnId }
                            /// Output:
                            ///     oResult( ok: true|false; data: string thông báo )
                            /// </summary>
                            /// PAWN_CREATE_NEW_SUCCESS = 121


                            //#endregion
                            break;
                        //#region [ PAWN_UPDATE_SUCCESS ]
                        //case 122:
                        //    //#region [ PAWN_UPDATE_SUCCESS ]

                        //    /// <summary>
                        //    /// Thay đổi thông tin Pawn (bảng pos.Pawn)
                        //    ///     + Update thay đổi thông tin các bản ghi của đối tượng Pawn
                        //    ///     + Thay đổi trạng thái Pawn: Khóa, cấm, kích hoạt, duyệt, ...
                        //    /// Input:
                        //    ///     data = new string[]{ PawnId }
                        //    /// Output:
                        //    ///     oResult( ok: true|false; data: string thông báo )
                        //    /// </summary>
                        //    /// PAWN_UPDATE_SUCCESS = 122

                        //    pawn_id = Number(para);

                        //    if (!isNaN(pawn_id)) {
                        //        obj = { int_pos_pawn_id: pawn_id };
                        //        //console.log('PAWN_UPDATE_SUCCESS obj =', obj);

                        //        db___execute_callback(socket,null, 'mobile.pol_pawn_biz_pos_push_status_success', obj,
                        //            function (client, msg_) {
                        //                client.write(JSON.stringify(msg_));
                        //                client.destroy();
                        //            },
                        //            function (client, msg_) {
                        //                client.write(JSON.stringify(msg_));
                        //                client.destroy();
                        //            });
                        //    }

                        //    //#endregion
                        //    break;
                        //#endregion
                        case 122:
                            //#region [ PAWN_UPDATE_SUCCESS ]

                            /// <summary>
                            /// Thay đổi thông tin Pawn (bảng pos.Pawn)
                            ///     + Update thay đổi thông tin các bản ghi của đối tượng Pawn
                            ///     + Thay đổi trạng thái Pawn: Khóa, cấm, kích hoạt, duyệt, ...
                            /// Input:
                            ///     data = new string[]{ PawnId, loan_money_org , is_f88_cus(0|1), pawn_asset_code_pos(000017...)  }
                            /// Output:
                            ///     oResult( ok: true|false; data: string thông báo )
                            /// </summary>
                            /// PAWN_UPDATE_SUCCESS = 122

                            //  pawn_id = Number(para);

                            a = para.split('|');
                            ok = false;
                            switch (a.length) {
                                case 1:
                                    //#region []
                                    pawn_id = Number(a[0]);
                                    if (isNaN(pawn_id)) {
                                        socket.write(JSON.stringify({ ok: false, message: 'Dữ liệu không đúng định dạng data = new string[]{ PawnId }' }));
                                        socket.destroy();
                                    } else {
                                        obj = {
                                            int_pos_pawn_id: pawn_id,
                                            loan_money_org: -1,
                                            is_f88_cus: -1,
                                            asset_code_pos: ''
                                        };

                                        //console.log('PAWN_UPDATE_SUCCESS obj =', obj);
                                        ok = true;
                                    }
                                    //#endregion
                                    break;
                                case 4:
                                    //#region []
                                    pawn_id = Number(a[0]);
                                    const loan_money_org = Number(a[1]);
                                    const is_f88_cus = Number(a[2]);
                                    const pawn_asset_code_pos = a[3];

                                    if (isNaN(pawn_id) || isNaN(loan_money_org) || isNaN(is_f88_cus)) {
                                        socket.write(JSON.stringify({ ok: false, message: 'Dữ liệu không đúng định dạng data = new string[]{ PawnId, loan_money_org , is_f88_cus(0|1), pawn_asset_code_pos(000017...)  }' }));
                                        socket.destroy();
                                    } else {
                                        obj = {
                                            int_pos_pawn_id: pawn_id,
                                            loan_money_org: loan_money_org,
                                            is_f88_cus: is_f88_cus,
                                            asset_code_pos: pawn_asset_code_pos
                                        };

                                        //console.log('PAWN_UPDATE_SUCCESS obj =', obj);
                                        ok = true;
                                    }
                                    //#endregion
                                    break;
                                default:
                                    break;
                            }

                            if (ok) {

                                db___execute_callback(socket, null,
                                    'mobile.pol_pawn_biz_pos_push_status_success',
                                    obj,
                                    function (client, msg_) {
                                        client.write(JSON.stringify(msg_));
                                        savelog_pos(type, JSON.stringify(msg_));
                                        client.destroy();
                                    },
                                    function (client, msg_) {
                                        client.write(JSON.stringify(msg_));
                                        savelog_pos(type, JSON.stringify(msg_));
                                        client.destroy();
                                    });
                            }
                            //#endregion
                            break;
                        case 11:
                            //#region [ USER_CREATE_NEW_SUCCESS ]

                            /// <summary>
                            /// Tạo tài khoản thành công
                            /// Input:
                            ///     data = new string[]{ user_id }
                            /// Output:
                            ///     oResult( ok: true|false; data: string thông báo )
                            /// </summary>
                            /// USER_CREATE_NEW_SUCCESS = 11,

                            if (___cache['USER']) {
                                ___cache['USER'] = [];
                                cache___initFromDB('user.sql');
                                socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                savelog_pos(type, JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                            }
                            socket.destroy();

                            //#endregion
                            break;
                        case 12:
                            //#region [ USER_UPDATE_SUCCESS ]

                            /// <summary>
                            /// Thay đổi thông tin tài khoản thành công
                            ///     + Update thay đổi thông tin các bản ghi của đối tượng tài khoản(user)
                            ///     + Đổi mật khẩu
                            ///     + Update profile
                            ///     + Thay đổi trạng thái: Khóa tài khoản, ...
                            /// Input:
                            ///     data = new string[]{ user_id }
                            /// Output:
                            ///     oResult( ok: true|false; data: string thông báo )
                            /// </summary>
                            /// USER_UPDATE_SUCCESS = 12,

                            if (___cache['USER']) {
                                ___cache['USER'] = [];
                                cache___initFromDB('user.sql');
                                socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                savelog_pos(type, JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                            }
                            socket.destroy();

                            //#endregion
                            break;
                        case 13:
                            //#region [ USER_REMOVE_SUCCESS ]

                            /// <summary>
                            /// Xóa tài khoản thành công
                            /// Input:
                            ///     data = new string[]{ user_id }
                            /// Output:
                            ///     oResult( ok: true|false; data: string thông báo )
                            /// </summary>
                            /// USER_REMOVE_SUCCESS = 13,

                            if (___cache['USER']) {
                                ___cache['USER'] = [];
                                cache___initFromDB('user.sql');
                                socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                savelog_pos(type, JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                            }
                            socket.destroy();

                            //#endregion
                            break;
                        case 21:
                            //#region [ SHOP_CREATE_NEW_SUCCESS ]

                            if (___cache['SHOP']) {
                                ___cache['SHOP'] = [];
                                cache___initFromDB('shop.sql');
                                socket.write(JSON.stringify({ ok: true, message: 'Data shop ' + para + ' sync success' }));
                                savelog_pos(type, JSON.stringify({ ok: true, message: 'Data shop ' + para + ' sync success' }));
                            }
                            socket.destroy();

                            //#endregion
                            break;
                        case 22:
                            //#region [ SHOP_UPDATE_SUCCESS ]

                            if (___cache['SHOP']) {
                                ___cache['SHOP'] = [];
                                cache___initFromDB('shop.sql');
                                socket.write(JSON.stringify({ ok: true, message: 'Data shop ' + para + ' sync success' }));
                                savelog_pos(type, JSON.stringify({ ok: true, message: 'Data shop ' + para + ' sync success' }));
                            }
                            socket.destroy();

                            //#endregion
                            break;
                        case 23:
                            //#region [ SHOP_REMOVE_SUCCESS ]

                            if (___cache['SHOP']) {
                                ___cache['SHOP'] = [];
                                cache___initFromDB('shop.sql');
                                socket.write(JSON.stringify({ ok: true, message: 'Data shop ' + para + ' sync success' }));
                                savelog_pos(type, JSON.stringify({ ok: true, message: 'Data shop ' + para + ' sync success' }));
                            }
                            socket.destroy();

                            //#endregion
                            break;
                        case 31:
                            //#region [ GROUP_CREATE_NEW_SUCCESS ]

                            if (___cache["GROUP"]) {
                                ___cache['GROUP'] = [];
                                cache___initFromDB('group.sql');
                                socket.write(JSON.stringify({ ok: true, message: 'Data group ' + para + ' sync success' }));
                                savelog_pos(type, JSON.stringify({ ok: true, message: 'Data group ' + para + ' sync success' }));
                            }
                            socket.destroy();

                            //#endregion
                            break;
                        case 32:
                            //#region [ GROUP_UPDATE_SUCCESS ]

                            if (___cache["GROUP"]) {
                                ___cache['GROUP'] = [];
                                cache___initFromDB('group.sql');
                                socket.write(JSON.stringify({ ok: true, message: 'Data group ' + para + ' sync success' }));
                                savelog_pos(type, JSON.stringify({ ok: true, message: 'Data group ' + para + ' sync success' }));
                            }
                            socket.destroy();

                            //#endregion
                            break;
                        case 33:
                            //#region [ GROUP_REMOVE_SUCCESS ]

                            if (___cache["GROUP"]) {
                                ___cache['GROUP'] = [];
                                cache___initFromDB('group.sql');
                                socket.write(JSON.stringify({ ok: true, message: 'Data group ' + para + ' sync success' }));
                                savelog_pos(type, JSON.stringify({ ok: true, message: 'Data group ' + para + ' sync success' }));
                            }
                            socket.destroy();

                            //#endregion
                            break;
                        default:
                            socket.destroy();
                            break;
                    }
                }
            }
        } catch (err_throw) {
            ___log_err_throw('RUN_JOB: ___MSG_POS', err_throw, m);
        }
    }
}).start();

// ------------------ chia don, chuyển đơn ---------------------
const ___MSG_CHIADON_TAY = [];
new _JOB('* * * * * *', function () {
    if (___MSG_CHIADON_TAY.length > 0) {
        const m = ___MSG_CHIADON_TAY.shift();
        try {
            if (m) {
                const text = m.text, socket = m.client;
                if (socket && text && text.length > 36) {
                    const s = text.substr(1);

                    if (s[0] == '{' && s[s.length - 1] == '}') {
                        let validJson = false;
                        let validTextCommand = false;
                        let obj;
                        try {
                            obj = JSON.parse(s);
                            if (typeof obj == 'object') validJson = true;
                        } catch (e1) {
                            validJson = false;
                        }
                        if (validJson) {
                            let k = 0, i = 0;
                            let sync_ok = false;

                            let api_name = obj.a;
                            let cache_name = api_name ? api_name.toLocaleUpperCase() : '';

                            const data = obj.d ? obj.d : [];
                            const key = obj.c;
                            const token = obj.t;

                            const master_table = obj.mt;
                            const master_id = obj.mi;
                            const col_update = obj.v;

                            switch (key) {
                                case 'DB_UPDATE':

                                    for (i = 0; i < data.length; i++) {
                                        k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                        if (k != -1) {
                                            data[i] = ___row_changed_update_cache(cache_name, data[i]);
                                            ___cache[cache_name][k] = data[i];
                                            sync_ok = true;
                                        }
                                    }

                                    if (master_table && master_id) {
                                        ___row_changed_update_cache(master_table, master_id);
                                    }

                                    break;
                            }

                            if (sync_ok) {
                                ___job_reduce(cache_name);
                                if (data && data.length > 0) ___notify_write(key, cache_name, data[0]);
                            }

                            //console.log('', cache_name, sync_ok, obj);
                        }
                    }
                }
            }
        } catch (err_throw) {
            ___log_err_throw('RUN_JOB: ___MSG_CHIADON_TAY', err_throw, m);
        }
    }
}).start();

// ------------------ chia don, chuyển đơn ---------------------

// ------------------ NOTIFY ---------------------
const ___MSG_NOTIFY = [];
new _JOB('* * * * * *', function () {
    if (___MSG_NOTIFY.length > 0) {
        const m = ___MSG_NOTIFY.shift();
        try {
            if (m) {
                const text = m.text, socket = m.client;
                if (socket && text && text.length > 36) {
                    const s = text.substr(1);

                    if (s[0] == '{' && s[s.length - 1] == '}') {
                        let validJson = false;
                        let validTextCommand = false;
                        let obj;
                        try {
                            obj = JSON.parse(s);
                            if (typeof obj == 'object') validJson = true;
                        } catch (e1) {
                            validJson = false;
                        }
                        if (validJson) {
                            let k = 0, i = 0;
                            let sync_ok = false;

                            let api_name = obj.a;
                            let cache_name = api_name ? api_name.toLocaleUpperCase() : '';

                            const data = obj.d ? obj.d : [];
                            const key = obj.c;
                            const token = obj.t;

                            const master_table = obj.mt;
                            const master_id = obj.mi;
                            const col_update = obj.v;

                            switch (key) {
                                case 'DB_INSERT':

                                    for (i = 0; i < data.length; i++) {
                                        k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                        if (k == -1) {
                                            data[i].index___ = ___cache[cache_name].length;

                                            data[i] = ___row_changed_update_cache(cache_name, data[i]);

                                            ___cache[cache_name].push(data[i]);
                                            ___index[cache_name][data[i].id] = ___cache[cache_name].length - 1;

                                            sync_ok = true;
                                        }
                                    }

                                    if (master_table && master_id) {
                                        ___row_changed_update_cache(master_table, master_id);
                                    }

                                    break;
                            }

                            if (sync_ok) {
                                ___job_reduce(cache_name);
                                if (data && data.length > 0) ___notify_write(key, cache_name, data[0]);
                            }

                            //console.log('', cache_name, sync_ok, obj);
                        }
                    }
                }
            }
        } catch (err_throw) {
            ___log_err_throw('RUN_JOB: ___MSG_NOTIFY', err_throw, m);
        }
    }
}).start();

// ------------------ NOTIFY ---------------------

const _TCP_SERVER = _NET.createServer(function (socket) {
    //   socket.bufferSize = Number.MAX_SAFE_INTEGER;

    socket.on('error', function (error) {
        ___log_err_throw('_TCP_SERVER: ON_ERROR', error);
    });

    socket.on('data', function (buf) {

        try {

            if (___CACHE_DONE == false || buf.length == 0) {
                socket.destroy();
                return;
            }

            const text = buf.toString('utf8'); //.trim();

            LOG_TCP_FILE.push('BUF ' + new Date().toLocaleString() + ': \t' + text);

            //___log_tcp(text);

            switch (buf[0]) {
                case 33:    //  key store sql = !
                    //___log_tcp_db2cache('UPDATE_CACHE =' + text);

                    savelog_error('TCP___MSG_DB2CACHE ......', new Date().toLocaleString());

                    //if(text.indexOf('POL_PAWN') != -1) console.log('TCP___MSG_DB2CACHE = ',text);

                    ___MSG_DB2CACHE.push({ client: socket, text: text });
                    return;
                case 36:    //  key store sql = $
                    //  console.log('___MSG_CHIADON_TAY = ', text);
                    ___MSG_CHIADON_TAY.push({ client: socket, text: text });
                    return;
                case 37:    //  key store sql = %
                    //console.log('___MSG_NOTIFY = ', text);
                    ___MSG_NOTIFY.push({ client: socket, text: text });
                    return;
                case 1:
                case 2:
                    //TOKEN_RETURN_LOGIN_SUCCESS = 1,
                    //TOKEN_VALID = 2,
                    ___MSG_TOKEN.push({ client: socket, text: text });
                    return;
                case 106:
                case 107:
                case 108:
                    //PAWN_ONLINE_CREATE_BY_AFFILATE_SUCCESS = 106
                    //PAWN_ONLINE_UPDATE_BY_AFFILATE_SUCCESS = 107
                    //PAWN_ONLINE_CHECK_PHONE_AFFILATE_SUCCESS = 108
                    ___MSG_AFFILATE.push({ client: socket, text: text });
                    return;
                case 126: // ~
                    console.log('TCP TEST = ' + text);
                    break;
                default:
                    ___MSG_POS.push({ client: socket, text: text });
                    break;
            }

        } catch (err_throw) {
            socket.destroy();
            ___log_err_throw('_TCP_SERVER: ON_DATA', err_throw);
        }
    });
});
_TCP_SERVER.listen(___PORT_TCP_SERVER, '127.0.0.1');


//#endregion

//#region [ CACHE CONFIG ] 

let pawn_length = 0;
let _CACHE_COUNTER = 0;

const _CACHE_NAME_MAIN = 'POL_PAWN';

const ___cache = { TEST: [] }; // ___cache['CHANNEL'] = [{...},...]
const ___cache_config = {
    POL_PAWN: {
        user_created_id: 'USER',
        cus_created_id: 'POL_CUSTOMER',
        customer_id: 'POL_CUSTOMER',
        caller_shop_id: 'USER',
        caller_online_id: 'USER',
        group_id: 'GROUP'
    }
};
const ___cache_config_ids = {
    POL_PAWN: {
        ___list_support_schedule: 'POL_SUPPORT_SCHEDULE.int_pawn_online_id',
        ___list_online_process: 'POL_PROCESS.int_pol_pawn_id'
    }
};
const ___cache_cols_config = {
    POL_PAWN: {
        ids: ',id,customer_id,int_pawn_id_pos,',
        ascii: ',lng_money,int_days,int_created_date,str_channel_name,',
        utf8: ',str_asset_type_name,str_channel_name,str_city_name,str_district_name,str_description,str_trademark,',
        org: ',str_asset_type_name,'
    },
    POL_CUSTOMER: {
        ids: ',id,',
        ascii: ',str_phone,str_email,int_created_date,str_name,',
        utf8: ',str_name,str_address,',
        org: ',str_name,str_address,'
    },
    POL_CHANNEL: {
        ids: ',id,',
        ascii: ',str_name,',
        utf8: ',str_name,'
    },
    REGION: {
        ids: ',id,',
        ascii: ',str_name,',
        utf8: ',str_name,'
    },
    SHOP: {
        ids: ',id,',
        ascii: ',str_name,',
        utf8: ',str_name,'
    },
    USER: {
        ids: ',id,shop_id,group_id,',
        ascii: ',str_user_name,str_possition,str_shop_name,',
        utf8: ',str_full_name,str_shop_name,'
    },
    GROUP: {
        ids: ',id,',
        ascii: ',str_name,str_code,',
        utf8: ',str_name,str_code,'
    },
    POL_ASSET_TYPE: {
        ids: ',id,',
        ascii: ',str_name,',
        utf8: ',str_name,'
    },
    POL_PRIORITY: {
        ids: ',,',
        ascii: ',str_priority_name,',
        utf8: ',str_priority_name,'
    },
    POL_REASON_FAIL: {
        ids: ',,',
        ascii: ',str_canceled_reason,',
        utf8: ',str_canceled_reason,'
    }
};

const ___index = {};
const ___ids = {};
const ___list_online_process = {};
const ___list_support_schedule = {};

const ___row_changed_update_cache = function (cache_name, item, not_index_ids) {
    try {
        if (typeof item == 'string' || typeof item == 'number') {
            const v = _.find(___cache[cache_name], function (o) { return o.id == item });
            //console.log('$$$$$ = ', cache_name, item, v);
            item = v;
        }

        const vals = [];
        const cf = ___cache_config[cache_name];
        const hasJoin = cf ? true : false;

        let cf_cols = ___cache_cols_config[cache_name];

        const arr_ids = [], arr_ascii = [], arr_utf8 = [], arr_org = [];

        for (const col in item) {
            if (hasJoin && cf[col]) {
                const join_api_name = cf[col];
                const join_id = item[col];
                const join_col = '___' + col.substr(0, col.length - 3);
                item[join_col] = {};

                if (join_id == -1) {
                    ;
                } else {
                    // join 1 -> 1
                    //console.log('1----', hasJoin, join_api_name, join_id, ___index[join_api_name], ___index[join_api_name][join_id]);
                    const join_index = ___index[join_api_name][join_id];
                    if (___cache[join_api_name][join_index]) {
                        const obj_joined = ___cache[join_api_name][join_index];
                        item[join_col] = obj_joined;



                        if (obj_joined['#ids'] && obj_joined['#ids'].length > 0) {
                            arr_ids.push(obj_joined['#ids']);
                        }

                        if (obj_joined['#ascii'] && obj_joined['#ascii'].length > 0) {
                            arr_ascii.push(obj_joined['#ascii']);
                        }

                        if (obj_joined['#utf8'] && obj_joined['#utf8'].length > 0) {
                            arr_utf8.push(obj_joined['#utf8']);
                        }

                        if (obj_joined['#org'] && obj_joined['#org'].length > 0) {
                            arr_org.push(obj_joined['#org']);
                        }
                    }
                }
            }

            //if (item[col]) vals.push(item[col]);
            //if (item[col] && typeof item[col] == 'object' && item[col]['#']) {
            //    vals.push(item[col]['#']);
            //    //delete item[ci]['#'];
            //}

            if (cf_cols) {
                if (cf_cols.ids && cf_cols.ids.indexOf(',' + col + ',') != -1 && item[col] != -1) {
                    arr_ids.push(item[col]);
                }

                if (cf_cols.ascii && cf_cols.ascii.indexOf(',' + col + ',') != -1 && item[col] != -1) {
                    arr_ascii.push(item[col]);
                }

                if (cf_cols.utf8 && cf_cols.utf8.indexOf(',' + col + ',') != -1 && item[col] != -1) {
                    arr_utf8.push(item[col]);
                }

                if (cf_cols.org && cf_cols.org.indexOf(',' + col + ',') != -1 && item[col] != -1) {
                    arr_org.push(item[col]);
                }
            }

            //if (item[col] && item[col] != -1 && typeof item[col] == 'object') {
            //    if (item[col]['#ids'] && item[col]['#ids'].length > 0) {
            //        arr_ids.push(item[col]['#ids']);
            //    }
            //    if (item[col]['#ascii'] && item[col]['#ascii'].length > 0) {
            //        arr_ids.push(item[col]['#ascii']);
            //    }
            //    if (item[col]['#utf8'] && item[col]['#utf8'].length > 0) {
            //        arr_ids.push(item[col]['#utf8']);
            //    }
            //}
        }

        if (not_index_ids != true) {
            //////// join 1 -> n
            //////const cf_ids = ___cache_config_ids[cache_name];
            //////if (cf_ids) {
            //////    for (const col in cf_ids) {
            //////        item[col] = [];
            //////        const a = cf_ids[col].split('.');
            //////        //console.log('$$$$$ col = ', col, a);
            //////        if (a.length == 2) {
            //////            const join_api_name = a[0];
            //////            const join_col = a[1];
            //////            const ja = _.filter(___cache[join_api_name], function (o) { return o[join_col] == item.id; });
            //////            item[col] = ja;
            //////            //console.log('$$$$$ col = ', col, join_api_name, join_col, item.id, ja);
            //////        }
            //////    }
            //////}

            item = ___row_changed_update_cache_ids(cache_name, item);
        }

        //item['#'] = ___convert_unicode_to_ascii(vals.join(' ')) + ' ' + vals.join(' ').toLowerCase();

        //str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        //str = str.replace(/ + /g, " ");

        if (arr_ids.length > 0)
            item['#ids'] = ' ' + arr_ids.join(' ') + ' ';

        if (arr_ascii.length > 0)
            item['#ascii'] = ' ' + ___convert_unicode_to_ascii(arr_ascii.join(' ')) + ' ';

        if (arr_utf8.length > 0)
            item['#utf8'] = ' ' + arr_utf8.join(' ').toLowerCase().replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ").replace(/ + /g, " ") + ' ';

        if (arr_org.length > 0)
            item['#org'] = arr_org.join(' ');

    } catch (err_throw) {
        ___log_err_throw('___row_changed_update_cache', err_throw, cache_name, item);
    }
    return item;
};

const ___row_changed_update_cache_ids = function (cache_name, item) {
    try {

        // join 1 -> n
        const cf_ids = ___cache_config_ids[cache_name];
        if (cf_ids) {
            for (const col in cf_ids) {
                item[col] = [];
                const a = cf_ids[col].split('.');
                //console.log('$$$$$ col = ', col, a);
                if (a.length == 2) {
                    const join_api_name = a[0];
                    const join_col = a[1];
                    const ja = _.filter(___cache[join_api_name], function (o) { return o[join_col] == item.id; });
                    item[col] = ja;
                    //console.log('$$$$$ col = ', col, join_api_name, join_col, item.id, ja);
                }
            }
        }

    } catch (err_throw) {
        ___log_err_throw('___row_changed_update_cache_ids', err_throw, cache_name, item);
    }

    return item;
};

const ___main_CacheSetupDB_Scripts = () => {
    return {
        POL_PAWN: "SELECT " + _sql_select_top + " *,isnull( (select * from [SplitStringToTable](str_url,'&')),'') as str_campaign FROM mobile.pol_pawn order by id asc",
        POL_CUSTOMER: "SELECT " + _sql_select_top + " * FROM mobile.pol_customer order by id desc",
        //POL_CUSTOMER: "SELECT top 5000 * FROM mobile.pol_customer order by id desc",
        GROUP: "SELECT \
                    GroupID as id \
                    ,ParentID as parent_id \
                    ,Code as str_code \
                    ,[Name] as str_name \
                    ,[Status] as int_status \
            FROM [pos].[Group] where IsShop=1 or GroupID=44 or GroupID=58",
        POS_SYS_CONFIG: "SELECT \
                            0 as id \
                        ,[Code] as str_code \
                        ,[Type] as str_type \
                        ,[Value] as str_value \
                        ,[Name] as str_name \
                        ,[Status] as int_status \
                        FROM [pos].[SysConfig] \
                        where Type='PawnOnlineOption'",
        SHOP: "select \
                    shopid as id \
                    , code \
                    , [name] as str_name \
            from pos.shopdetail",
        REGION: "select \
                        [RegionID] as id \
                        ,[Name] as str_name \
                        ,isnull([ParentID],0) as int_pid \
                        , isnull((select [Name] from pos.region as b where b.[RegionID] = a.[ParentID] ),'') as str_parent_name \
                from pos.region as a where [status]=1",
        USER: "SELECT  u.UserID as id, \
                ISNULL(u.CalloutToken,'') as str_call_out_tooken, \
                u.ApproveLevel as int_approve_level, \
                ISNULL(u.UserPosition,0) as str_user_position, \
                ug.GroupID as group_id, \
                u.UserName as str_user_name, \
                        ISNULL( u.[POLStatus],0) as int_pol_status, \
                        ISNULL( [POLRegion],0) as int_pol_region, \
                g.[Name] as str_group_name, \
                u.UserFullName as str_full_name, \
                '12345@abc' as str_pass_word, \
                        u.[UserPass] as str_pass, \
                (CASE \
                        WHEN u.ApproveLevel = 1 AND UserPosition = 4 THEN N'Nhân viên cửa hàng' \
                        WHEN u.ApproveLevel = 1 AND UserPosition = 3 THEN N'Quản lý CH' \
                        WHEN u.ApproveLevel = 2 THEN 'QLKV' END) \
                        as str_possition, \
                    (CASE \
                        WHEN ug.GroupID = 44  THEN N'1' else (select top(1) s.ShopID from pos.[GroupShop] gs  inner JOIN pos.[ShopDetail] s ON gs.ShopCode = s.Code where g.GroupID = gs.GroupID) \
                            end) as shop_id, \
                        (CASE \
                WHEN ug.GroupID = 44  THEN N'Hỗ trợ khách hàng' else  (select top(1) s.[Name] from pos.[GroupShop] gs  inner JOIN pos.[ShopDetail] s ON gs.ShopCode = s.Code where g.GroupID = gs.GroupID) \
                end) as str_shop_name, \
                        (case u.UserID when 617 then 1  when 1810  then 1 when 619 then 1 else 0 end) as bit_admin_caller \
                ,isnull(u.UserEmail,'') as str_user_email \
               ,(CASE\
                WHEN u.ApproveLevel = 2 THEN\
                (STUFF(\
                ',' + (\
                SELECT ',' + CONVERT(NVARCHAR(20), g.GroupID) \
                FROM pos.[User] _u_qlkv\
                INNER JOIN pos.[UserGroup] ug ON ug.UserID = _u_qlkv.UserID\
                INNER JOIN pos.GroupShop gs ON gs.GroupID = ug.GroupID\
                INNER JOIN pos.[Group] g ON gs.ShopCode = g.Code\
                WHERE _u_qlkv.UserID = u.UserID and g.Status = 1\
                FOR xml path('')\
                ) + ','\
                , 1\
                , 1\
                , ''))\
                ELSE '' END)\
                as group_qlkv\
                FROM [pos].[User]  u \
                left JOIN pos.[UserGroup] ug ON ug.UserID = u.UserID \
                left JOIN pos.[Group] g ON ug.GroupID = g.GroupID  AND g.STATUS = 1 \
            where u.Status =1  order by u.UserID asc",

        POL_ASSET_TYPE: "SELECT * FROM mobile.pol_asset",
        POL_AREA: "select  * from mobile.pol_area",
        POL_CHANNEL: "select * from mobile.pol_channel",
        POL_PRIORITY: "SELECT * FROM [mobile].[pol_priority]",
        POL_PROCESS: "SELECT " + _sql_select_top + " * FROM mobile.pol_online_process order by int_pol_pawn_id desc",
        POL_NOTIFY: "SELECT * FROM mobile.pol_notify order by int_date,int_time desc",
        POL_NOTIFY_STATE: "SELECT * FROM mobile.pol_notify_state order by int_date,int_time desc",
        POL_REASON_FAIL: "SELECT  * FROM mobile.pol_reason_fail",
        POL_STEP: "select * from mobile.pol_step",
        POL_SUPPORT_SCHEDULE: "SELECT  * FROM mobile.pol_support_schedule",
        POL_SYS_EMAIL: "SELECT * FROM [mobile].[sys_email]",
        POL_SYS_SMS: "SELECT * FROM [mobile].[sys_sms]",
        POL_PAWN_DETAIL: "SELECT * FROM [mobile].[pol_pawn_detail]"
    };
};

//#endregion

//#region [ CACHE FROM DB ]

const ___main_Start = () => {
    ___log('\nMAIN: Start ...');
    ___thread_initOnMain();
};

const ___main_CacheReady = () => {
    console.log('\nMAIN: Cache ready ...' + new Date().toLocaleString());
    ___main_Start();
};

const cache___initFromDB = async (file_sql_to_cache) => {
    if (file_sql_to_cache == null || file_sql_to_cache.length < 4) return;

    const key_name = file_sql_to_cache.substr(0, file_sql_to_cache.length - 4).toUpperCase();
    return ___main_CacheSetupDB(key_name);
};

const ___main_CacheSetupDB = async (key_name) => {
    try {
        let scripts = ___main_CacheSetupDB_Scripts();

        if (key_name != null) {
            const sql = scripts[key_name];
            scripts = {};
            scripts[key_name] = sql;
        }

        _CACHE_TOTAL = Object.keys(scripts).length;

        //THAY KET NOI O DAY NHE

        const _POOL_AMAZON = new _SQL.ConnectionPool(_DB_CACHE_POS_AMAZON);
        // const _POOL_AMAZON = new _SQL.ConnectionPool(_DB_CACHE_POS_AMAZON_CACHE);
        const _POOL_AMAZON_CONNECT = _POOL_AMAZON.connect();

        const _POOL_123 = new _SQL.ConnectionPool(_DB_CACHE_123);
        // const _POOL_123 = new _SQL.ConnectionPool(_DB_CACHE_123_CACHE);
        const _POOL_123_CONNECT = _POOL_123.connect();

        // ensures that the pool has been created
        await _POOL_AMAZON_CONNECT;
        await _POOL_123_CONNECT;

        let type = '', text_sql = '', request;
        for (let cache_name in scripts) {
            ___log(new Date().toLocaleString() + ' DB -> ' + cache_name + '...');

            if (___cache[cache_name] == null) ___cache[cache_name] = [];
            if (___ids[cache_name] == null) ___ids[cache_name] = [];
            if (___index[cache_name] == null) ___index[cache_name] = {};

            type = 'AMZ';
            if (cache_name.startsWith('POL_')) type = '123';

            text_sql = scripts[cache_name].trim();

            switch (type) {
                case 'AMZ':
                    request = _POOL_AMAZON.request();
                    break;
                case '123':
                    request = _POOL_123.request();
                    break;
            }

            request.stream = true;
            request.query(text_sql);

            request.on('recordset', columns => { });

            request.on('row', row => {
                //___log(cache_name + ': ', row);
                const ix___ = ___cache[cache_name].length;
                row.ix___ = ix___;

                if (cache_name != _CACHE_NAME_MAIN)
                    row = ___row_changed_update_cache(cache_name, row);

                if (cache_name == 'USER') {
                    row.user_id = row.id;
                    row.ref_id = row.id;
                    row.scope_ids = 'pol';
                }

                ___cache[cache_name].push(row);

                ___index[cache_name][row.id] = ix___;

                //___ids[cache_name].push(Number(row.id));

                switch (cache_name) {
                    case 'POL_SUPPORT_SCHEDULE':
                        if (row.int_pawn_online_id) {
                            if (___list_support_schedule[row.int_pawn_online_id] == null)
                                ___list_support_schedule[row.int_pawn_online_id] = [ix___];
                            else
                                ___list_support_schedule[row.int_pawn_online_id].push(ix___);
                        }
                        break;
                    case 'POL_PROCESS':
                        if (row.int_pol_pawn_id) {
                            if (___list_online_process[row.int_pol_pawn_id] == null)
                                ___list_online_process[row.int_pol_pawn_id] = [ix___];
                            else
                                ___list_online_process[row.int_pol_pawn_id].push(ix___);
                        }
                        break;
                }
            });

            request.on('error', err => {
                ___log('ERROR = ' + cache_name, err.toString());
            });

            request.on('done', result => {
                ___log(new Date().toLocaleString() + ' DB ' + type + ' -> ' + cache_name + ' OK \t= ' + result.rowsAffected[0]);

                _CACHE_COUNTER++;
                if (_CACHE_COUNTER == _CACHE_TOTAL) ___main_CacheReady();
            });
        }

    } catch (err_throw) {
        ___log_err_throw('___main_CacheSetupDB', err_throw, key_name);
    }
};

const ___main_Setup = () => {
    ___main_CacheSetupDB();
};

const ___main_cache_IndexsDone = () => {
    ___CACHE_DONE = true;

    ___log('-> CACHE INDEXS DONE ... ' + new Date().toLocaleString());
    console.log('-> CACHE INDEXS DONE ... ' + new Date().toLocaleString());
};

//#endregion


//#region [ HTTP SETUP ]

require('dotenv').config({ path: 'variables.env' });

const _HTTP_EXPRESS = require('express');
const _HTTP_WEB_PUSH = require('web-push');
const _HTTP_BODY_PARSER = require('body-parser');
const _HTTP_CORS = require('cors');
const _HTTP_APP = _HTTP_EXPRESS();

const _HTTP_SERVER = require('http').createServer(_HTTP_APP);
const _IO = require('socket.io')(_HTTP_SERVER);

_HTTP_APP.use(_HTTP_CORS());
_HTTP_APP.use(_HTTP_BODY_PARSER.json());
_HTTP_APP.use((error, req, res, next) => {
    if (___CACHE_DONE == false) {
        return res.json({ ok: false, mesage: 'Api is caching ...' });
    }
    if (error !== null) {
        return res.json({ ok: false, mesage: 'Invalid json ' + error.toString() });
    }
    return next();
});

_HTTP_APP.use(_HTTP_EXPRESS.static(_PATH.join(__dirname, 'www')));
_HTTP_WEB_PUSH.setVapidDetails('mailto:test@example.com', process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);

//#endregion

//#region [ api update chia don ]

let _CONDITIONS_CHIADON = function () { };
const __search_for_job_async = async (cache_name, setting) => {
    //   ___log('__search_for_job_async -----------', cache_name, setting);
    eval('_CONDITIONS_CHIADON = ' + setting);
    let a = [];
    try {
        if (___cache[cache_name]) {
            a = _.filter(___cache[cache_name], _CONDITIONS_CHIADON);
        }
    } catch (err_throw) {
        ___log_err_throw('__search_for_job_async', err_throw, cache_name, setting);
        ___log('show eror -----------', a);
    }
    return a;
};

_HTTP_APP.post('/job-v1-search/:cache_name', async function (req, res) {
    const setting = req.body; // {"conditons":"function(o){ return o.int_pid == 0; }","page_number":1,"page_size":9007199254740991}
    const cache_name = req.params.cache_name.toUpperCase();
    //   ___log('get data email------------', cache_name, setting.conditons);
    try {
        // ___log('show 111 -----------', cache_name);
        __search_for_job_async(cache_name, setting.conditons).then(result => {

            //      ___log('result search = -----------', result);
            console.log('ssccccc==', result.length);
            res.json(result);

        }).catch(err => {
            res.json({ ok: false, message: err.message });
        });
    } catch (err_throw) {
        ___log_err_throw('/job-v1-search/:cache_name', err_throw, req.path);
        res.json({ ok: false, message: e.message });
    }
    
});

_HTTP_APP.post('/job-v1-update/:db_type', async function (req, res) {

    const data = req.body; // [ { ... } ]
    //console.log(data);
    //res.json({ ok: false, data: data });
    var obj1=[],data_=[];
    if (data && data.text) {
        //try {

            obj1 = JSON.parse(data.text);
        
          //  console.log('ssdsadcadsad', obj1);
            data_ = obj1;


        //} catch (e1) {
        //    console.log('ssdsadcsadsad');
        //    res.json({ ok: false, message: ' Data invalid = {text: " { data json ... } " }' });

        //}
    }
    else {
        data_ = data;
    }
   // console.log('data===', data_);
    const db_type = req.params.db_type.toUpperCase(); // DB_INSERT | DB_UPDATE

    try {
        f_____update_cache_memory_by_client(db_type, data_).then(result => {
            console.log('_HTTP_APP.post  resultresult ===', result);
            res.json(result);
        }).catch(err => {
            console.log('_HTTP_APP.post==== err', err);

            res.json(err);
        });

    } catch (err_throw) {
        ___log_err_throw('/job-v1-update/:db_type err_throw ===', err_throw, req.path);
        res.json({ ok: false, message: 'fail api' });
    }
});

const f_____update_cache_memory_by_client = async (db_type, m) => {
    try {
        console.log('11111111111111', db_type, m);
        
        if (m) {
            const text = JSON.stringify(m);
          //  ___log('JOB ___MSG_DB2CACHE____SQL = ', text);
            if (text && text.length > 36) {
                const s = text;

              //  console.log('f_____update_cache_memory_by_client', db_type, s);

                if (s[0] == '{' && s[s.length - 1] == '}') {
                    let validJson = false;
                    let validTextCommand = false;
                    let obj;
                    try {
                        obj = JSON.parse(s);
                        if (typeof obj == 'object') validJson = true;
                    } catch (e1) {
                        validJson = false;
                    }
                    if (validJson) {

                        let k = 0, i = 0;
                        let sync_ok = false;
                        console.log('obj===', obj);
                        console.log('obj==text=', obj.c);
                        let id;
                        let api_name = obj.a;
                        let cache_name = api_name ? api_name.toLocaleUpperCase() : '';

                        const data = obj.d ? obj.d : [];
                        const key = obj.c;
                        const token = obj.t;
                        const user_id = obj.ui;
                        const user_command = obj.uc;
                        const user_para = obj.up;

                        const master_table = obj.mt;
                        const master_id = obj.mi;
                        const col_update = obj.v;
                        console.log('key,key,key,key', key);
                        switch (key) {
                            case 'DB_INSERT':
                                console.log('data,kedata,data,key', data.length);
                                for (i = 0; i < data.length; i++) {
                                    k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                    if (k == -1) {
                                        data[i].index___ = ___cache[cache_name].length;

                                        data[i] = ___row_changed_update_cache(cache_name, data[i]);

                                        ___cache[cache_name].push(data[i]);
                                        ___index[cache_name][data[i].id] = ___cache[cache_name].length - 1;

                                        sync_ok = true;
                                    }
                                }

                                if (master_table && master_id) {
                                    ___row_changed_update_cache(master_table, master_id);
                                }

                                break;
                            case 'DB_UPDATE':
                                for (i = 0; i < data.length; i++) {
                                    k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                    if (k != -1) {
                                        data[i] = ___row_changed_update_cache(cache_name, data[i]);
                                        ___cache[cache_name][k] = data[i];
                                        sync_ok = true;
                                    }
                                }

                                if (master_table && master_id) {
                                    ___row_changed_update_cache(master_table, master_id);
                                }

                                break;
                            case 'DB_UPDATE_V':
                                if (col_update) {

                                    for (i = 0; i < data.length; i++) {
                                        k = _.findIndex(___cache[cache_name], function (o) { return o.id == data[i].id; });
                                        if (k != -1) {
                                            ___cache[cache_name][k][col_update] = data[i]['v'];
                                            if (col_update == 'caller_online_id')
                                                ___cache[cache_name][k].int_queued = -1;
                                            //console.log(key, cache_name, data[i].id);
                                        }
                                    }

                                }
                                break;
                            default:
                                if (key.startsWith('CACHE_ALL_POL_')) {
                                    cache_name = key.substr('CACHE_ALL_'.length);
                                    if (___cache[cache_name]) {
                                        ___cache[cache_name] = [];
                                        cache___initFromDB(cache_name.toLowerCase() + '.sql');
                                        //socket.write(JSON.stringify({ ok: true, message: 'Data user ' + para + ' sync success' }));
                                    }
                                    socket.destroy();
                                }
                                break;
                        }

                      //  ___log(' f_____update_cache_memory_by_client RESULT = ' + key, sync_ok, text);

                        if (sync_ok) {

                          //  ___job_reduce(cache_name);
                            if (data && data.length > 0) ___notify_write(key, cache_name, data[0]);

                          //  ___log(' f_____update_cache_memory_by_client dong bo ok ======= ');

                         //   return json({ ok: true});
                            return { ok: true, message:'ok'};
                        }
                    }
                }
            }
        }
    } catch (e) {
        ___log_err_throw('f_____update_cache_memory_by_client', e, m);
        //return json({ ok: false, message: "fail f_____update_cache_memory_by_client" });
        return { ok: false, message: 'ok' };
    }
};

//#endregion


___main_Setup();

//#region [ API ]

const ___response_write = function (req, res, data) {
    try {
        if (req == null || res == null) {
            console.log('ERROR: ___response_write(req, res ... is NULL');
            return;
        }

        if (data == null || data == undefined) data = {};

        let file, a = [], header = {}, col;
        if (req.query) file = req.query.___file;

        switch (file) {
            case 'csv':
                if (Array.isArray(data) == false) {
                    for (col in data) header[col] = col;
                    a.push(header);
                    a.push(data);
                }
                else {
                    for (col in data) header[col] = col;
                    data.splice(0, 0, header);
                    a = data;
                }
                res.csv(a);
                break;
            default:
                if (typeof data == 'string')
                    res.send(data);
                else
                    res.json(data);
                break;
        }

    } catch (err_throw) {
        ___log_err_throw('___response_write', err_throw, data);
    }
};

const ___response_ok = (request, arr_items, total_items, page_number, page_size) => {
    try {
        if (page_number == null) page_number = 1;
        if (page_size == null) page_size = ___page_size;
        if (arr_items == null) arr_items = [];
        if (request == null) request = {};

        const count_result = arr_items.length;
        let page_total = parseInt((count_result / page_size).toString().split('.')[0]);
        if (count_result % page_size > 0) page_total++;

        var it, min = (page_number - 1) * page_size, max = page_number * page_size;
        if (max > arr_items.length) max = arr_items.length;

        const rs = [];
        if (arr_items.length > 0) {
            for (var k = min; k < max; k++) {
                it = arr_items[k];
                it.index___ = k + 1;
                rs.push(it);
            }
        }

        return {
            ok: true,
            request: request,
            total_items: total_items,
            count_result: count_result,
            page_total: page_total,
            page_number: page_number,
            page_size: page_size,
            result_items: rs
        };
    } catch (err_throw) {
        ___log_err_throw('___response_ok', err_throw);
    }
};
const ___response_fail = (request, message) => { return { ok: false, request: request, message: message }; };

//--------------------------------------------------------------------------
const ___notify_user = {};

const ___notify_send = function (user_id, str_message) {
    try {
        if (___notify_user[user_id])
            ___notify_user[user_id].write('data: ' + str_message + '\n\n');

        if (___users_socketio[user_id])
            //  ___users_socketio[user_id].emit('messages', str_message);
            ___users_socketio[user_id].emit('broadcast', str_message);

    } catch (err_throw) {
        ___log_err_throw('___notify_send', err_throw);
    }
};

const ___notify_write = function (db_action, cache_name, o) {
    try {
        if (db_action && cache_name && o && o.id) {
            const id = o.id;
            let user_id;
            let u;
            let a = [];


           // console.log('___notify_write', db_action, cache_name, o);

            switch (cache_name) {
                case 'POL_PAWN':
                    switch (db_action) {
                        case 'DB_INSERT':
                            user_id = _USER_ID_ADMIN_CALL;
                            ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ALL', data: o }));

                            if (___notify_user[user_id])
                                ___notify_user[user_id].write('data: ' + + '\n\n');

                            user_id = o.caller_online_id;
                            ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ALL', data: o }));

                            user_id = o.caller_shop_id;
                            ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ALL', data: o }));

                            if (o.group_id != 44) {
                                u = _.find('USER', function (x) { return x.group_id == o.group_id && x.int_approve_level == 1 && x.str_user_position == '3'; });
                                if (u) {
                                    user_id = u.id;
                                    ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ALL', data: o }));
                                }
                            }

                            break;
                        default: // DB_UPDATE,DB_UPDATE_V, ...
                            //user_id = _USER_ID_ADMIN_CALL;
                            //___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));

                            //user_id = o.caller_online_id;
                            //___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));

                            //user_id = o.caller_shop_id;
                            //___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));

                            //if (o.group_id != 44) {
                            //    u = _.find('USER', function (x) { return x.group_id == o.group_id && x.int_approve_level == 1 && x.str_user_position == '3'; });
                            //    if (u) {
                            //        user_id = u.id;
                            //        ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));
                            //    }
                            //}

                            //for (const user_id in ___users_socketio) {
                            //    ___notify_send(user_id, JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));
                            //}

                            _IO.emit('broadcast', JSON.stringify({ command: 'PAWN_RELOAD_ID', id: id, data: o }));

                            break;
                    }
                    break;
                case 'POL_NOTIFY':
                    //console.log(o);

                    //_IO.emit('broadcast', JSON.stringify({ command: 'NOTIFY_RELOAD_ALL', id: id, data: o })); 

                    if (o.user_ids && o.user_ids.length > 0) {
                        a = _.filter(o.user_ids.split(','), function (x) { return x.trim().length > 0 && isNaN(Number(x)) == false; });
                        //console.log(o.message, a);
                        if (a.length > 0) {
                            for (var i = 0; i < a.length; i++) {
                                user_id = a[i];
                                ___notify_send(user_id, JSON.stringify({ command: 'NOTIFY_RELOAD_ALL', data: o }));
                            }
                        }
                    }

                    break;
            }
        }
    } catch (err_throw) {
        ___log_err_throw('___notify_write', err_throw);
    }
};

_HTTP_APP.get('/get-test', function (req, res) {
    res.json({ ok: true });
});




//#region [ CONFIG CHIA DON POSMAN ]

_HTTP_APP.get('/j1/config', function (req, res) {
    res.json(J1_CONFIG);
});

_HTTP_APP.post('/j1/config/:id/:token', function (req, res) {
    const data = req.body; // [3,3] or [3,10]
    const id = req.params.id;
    const token = req.params.token;
    try {

        if (token == ___TOKEN_API) {
            J1_CONFIG[id] = data;

            res.json({ ok: true, config: J1_CONFIG });
        } else {
            res.json({ ok: false, config: J1_CONFIG });
        }

    } catch (err_throw) {
        ___log_err_throw('/j1/config/:id/:token', err_throw, req.path, data);
        res.json({ ok: false });
    }
});


_HTTP_APP.get('/user_call/config', function (req, res) {
    res.json(J_CONFIG_ACCOUNT);
});

_HTTP_APP.post('/user_call/config/:token', function (req, res) {
    const data = req.body; //   data =   ',619,707,927,1508,1208,1207,1206,';
    const token = req.params.token;
    //  console.log('data ==', data);
    try {
        if (token == ___TOKEN_API && data && data.toString().length > 0) {
            J_CONFIG_ACCOUNT = data;

            res.json({ ok: true, config: J_CONFIG_ACCOUNT });
        } else {
            res.json({ ok: false, config: J_CONFIG_ACCOUNT });
        }
    } catch (err_throw) {
        ___log_err_throw('/user_call/config/:token', err_throw, req.path, data);
        res.json({ ok: false });
    }
});

//#endregion

_HTTP_APP.get('/get-notify/:user_id', function (req, res) {
    const user_id = req.params.user_id;
    try {
        if (user_id.length > 0) {
            //console.log(user_id);
            res.writeHead(200, {
                'Connection': 'keep-alive',
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache'
            });
            ___notify_user[user_id] = res;
            return;
        }
        res.json({ ok: true });
        //setInterval(function (r_) {
        //    r_.write('data: {"msg":"' + ___guid() + '"}\n\n');
        //}, 1000, res);
    } catch (err_throw) {
        ___log_err_throw('/get-notify/:user_id', err_throw, req.path);
        res.json({ ok: false });
    }
});

//--------------------------------------------------------------------------
let _HTTP_APP_API_SEARCH_DROPDOWN_FUNC_CONDITIONS = function () { return true; };
_HTTP_APP.post('/api/dropdown/search/:token/:api_name', (req, res) => {
    const data = req.body;
    const key = req.params.api_name.toUpperCase();
    try {
        if (___cache[key] && data && data.conditons) {
            eval('_HTTP_APP_API_SEARCH_DROPDOWN_FUNC_CONDITIONS = ' + data.conditons);
            const a = _.filter(___cache[key], _HTTP_APP_API_SEARCH_DROPDOWN_FUNC_CONDITIONS);
            res.json(a);
            return;
        }
    } catch (err_throw) {
        ___log_err_throw('/api/dropdown/search/:token/:api_name', err_throw, req.path, data);
    }
    res.json([]);
});

//--------------------------------------------------------------------------
// LOCAL

_HTTP_APP.get('/api/valid/token/:token', (req, res) => {
    var v = [];
    const token = req.params.token;

    try {
        const api_name = 'USER';
        const key = token.substr(0, 36);
        if (___tokens[key]) {
            const user_id = ___tokens[key];
            let user = ___user_build_profile_token(user_id, token);
            res.json(user);

            return;
        }
    } catch (err_throw) {
        ___log_err_throw('/api/valid/token/:token', err_throw, req.path, token);
    }

    return res.json({ ok: false });
});

// Từ token lấy về profile của user
_HTTP_APP.get('/local/user/profile/:token', (req, res) => {
    var v = [];
    const token = req.params.token;
    const api_name = 'USER';
    try {
        const key = token.substr(0, 36);

        if (___tokens[key]) {
            const user_id = ___tokens[key];

            //console.log(user_id, u);

            if (u) {
                res.json(u);
                return;
            }
        }
    } catch (err_throw) {
        ___log_err_throw('/local/user/profile/:token', err_throw, req.path, token);
    }
    return res.json({ ok: false });
});

_HTTP_APP.get('/local/user/token/:id', (req, res) => {
    var v = [];
    const id = Number(req.params.id);
    const api_name = 'USER';
    try {
        if (___cache[api_name] && id >= -99999) {
            v = _.filter(___cache[api_name], function (o) { return o.id == id; });
            if (v.length > 0) {
                const user = v[0];
                const str_token = user___get_token(user.user_id, user.str_user_name, user.scope_ids);
                return res.status(200).send(str_token);
            }
        }
    } catch (err_throw) {
        ___log_err_throw('/local/user/token/:id', err_throw, req.path);
    }
    return res.status(200).send('');
});

_HTTP_APP.get('/local/:api_name/:id', (req, res) => {
    var v = [];
    const id = Number(req.params.id);
    const api_name = req.params.api_name.toUpperCase();
    try {
        if (___cache[api_name] && id >= -99999) {
            v = _.filter(___cache[api_name], function (o) { return o.id == id; });
            if (v.length > 0) res.json(v[0]);
        }
    } catch (err_throw) {
        ___log_err_throw('/local/:api_name/:id', err_throw, req.path);
    }
    res.json({ id: id });
});

//--------------------------------------------------------------------------

function ___pos_dashboard_date_time(yyyyMMdd, HHmmss) {
    if (yyyyMMdd == -1 || HHmmss == -1 || yyyyMMdd == '-1' || HHmmss == '-1' || yyyyMMdd == null || HHmmss == null) return null;
    return "\/Date(" + yyyyMMdd + HHmmss + ")\/";
}
function ___pos_dashboard_date_time___get_created(yyyyMMdd, HHmmss) {
    //"GetCreated": "20/11/2019 14:38",
    if (yyyyMMdd == -1 || HHmmss == -1 || yyyyMMdd == '-1' || HHmmss == '-1' || yyyyMMdd == null || HHmmss == null) return null;
    return "20/11/2019 14:38";
}

_HTTP_APP.get('/api/pos-dashboard/:shop_id/:group_id/:user_id/:token', (req, res) => {
    const shop_id = Number(req.params.shop_id);
    const group_id = Number(req.params.group_id);
    const user_id = Number(req.params.user_id);
    const begin = Number(req.params.begin);
    const end = Number(req.params.end);
    const token = req.params.token;
    let a = [], items = [], status_text = '';

    //begin=1,
    //end=10,

    //if (!isNaN(begin) && !isNaN(end) && !isNaN(shop_id) && !isNaN(group_id) && !isNaN(user_id) && !isNaN(user_id)) {
    try {
        const u = _.find(___cache['USER'], function (o) { return o.id == user_id; });
        if (u) {
            //const g = _.find(___cache['GROUP'], function (o) { return o.id == group_id; });

            //const is_call_online = u.bit_admin_caller == 1;
            //const is_call_online_employer = u.group_id == 44 && u.bit_admin_caller != 1;
            const is_shop_admin = u.int_approve_level == 1 && u.str_user_position == '3';
            const is_shop_employer = u.int_approve_level == 1 && u.str_user_position == '4';

            a = _.filter(___cache['POL_PAWN'], function (o, index) { return index < 10; });
            //if (is_shop_admin)
            //    a = _.find(___cache['POL_PAWN'], function (o) { return o.group_id == group_id });
            //else if (is_shop_employer)
            //    a = _.find(___cache['POL_PAWN'], function (o) { return o.group_id == group_id && o.caller_shop_id == user_id });


            if (a.length > 0) {
                items = _.map(a, function (o, index) {

                    if (o.int_status == 0) status_text = 'Hủy đăng ký';
                    else if (o.int_status == 1) status_text = 'Chưa tư vấn';
                    else if (o.int_status == 2) status_text = 'Đang chăm sóc';
                    else if (o.int_status == 4) status_text = 'Nhận cầm cố';

                    return {
                        "PawnOnlineID": o.id,
                        "Asset": o.str_asset_type_name,
                        "Trademark": o.str_asset_type_name,
                        "ProductionYear": o.str_product_year,
                        "Description": o.str_description,
                        "Money": o.lng_money,
                        "Days": o.int_days,
                        "Interest": null,
                        "TotalInterest": null,
                        "TotalMoney": null,
                        "Created": ___pos_dashboard_date_time(o.int_created_date, o.int_created_time),
                        "Status": o.int_status,
                        "CustomerID": o.customer_id,
                        "Comment1": null,
                        "Comment2": null,
                        "Comment3": null,
                        "Comment4": null,
                        "ShopID": null,
                        "Note": null,
                        "ReserveTime": null,
                        "PawnID": null,
                        "RejectComment": null,
                        "ToShopDate": null,
                        "Author": null,
                        "CallerId": user_id,
                        "Source": o.str_channel_name,
                        "CurrentGroupID": group_id,
                        "SteepedGroupID": o.str_group_ids_reveiced,
                        "Priority": o.int_priority_id,
                        "UrgentLevel": null,
                        "LastTrans": ___pos_dashboard_date_time(o.int_created_date, o.int_created_time),
                        "Url": "https://camoto30phut.f88.vn",
                        "PaperType": null,
                        "ReferenceId": null,
                        "ReferenceType": o.int_reference_type,
                        "ReCallTime": null,
                        "OrderPriority": o.int_priority_id,
                        "FirstCall": ___pos_dashboard_date_time(o.int_created_date, o.int_created_time),
                        "CurrentGroupState": 0,
                        "AutoCanceled": null,
                        "AutoCanceledAt": null,
                        "Queued": null,
                        "RegisterDate": ___pos_dashboard_date_time(o.int_created_date, o.int_created_time),
                        "CarInBank": null,
                        "Province": null,
                        "County": null,
                        "RegionID": null,
                        "NoContactedAt": null,
                        "ShopCallerId": 0,
                        "TickDate": null,
                        "Duration": null,
                        "Is2Step": null,
                        "TransToShopTime": ___pos_dashboard_date_time(o.int_created_date, o.int_created_time),
                        "FirstShopActionTime": null,
                        "TotalChoXuLy": 0,
                        "TotalDaDangKy": 0,
                        "TotalDaXuLy": 0,
                        "TotalDaChuyenThanhHopDong": 0,
                        "Month": 0,
                        "ShopName": null,
                        "GetCreated": ___pos_dashboard_date_time___get_created(o.int_created_date, o.int_created_time),
                        "GetRecallTime": "",
                        "Background": "red",
                        "CreatePawn": false,
                        "GetReserveTime": "",
                        "Total": a.length,
                        "STT": (index + 1),
                        "CustomerMobile": (o.___customer) ? o.___customer.str_phone : "",
                        "CustomerName": (o.___customer) ? o.___customer.str_name : "",
                        "CustomerAddress": (o.___customer) ? o.___customer.str_address : "",
                        "AuthorFullName": null,
                        "PawnCodeNo": null,
                        "ProductFullName": "  ",
                        "StatusText": status_text,
                        "Contracts": null,
                        "PawnDate": null,
                        "GetPawnDate": "",
                        "PawnMoney": null,
                        "LstProcess": null,
                        "CurrentGroupName": u.str_group_name,
                        "CanceledReason": null,
                        "CanceledContent": null,
                        "Contents": null,
                        "FirstProcShop": null,
                        "CanceledTimeShop": null,
                        "PawnCreated": null,
                        "ten_vv": null,
                        "PawnAssetName": null,
                        "TranShopName": null,
                        "SupportScheduleTime": null,
                        "Region": null,
                        "Campaign": null
                    };
                });
            }
        }
    } catch (err_throw) {
        ___log_err_throw('/api/pos-dashboard/:shop_id/:group_id/:user_id/:token', err_throw, req.path);
    }

    res.json(items);
});

_HTTP_APP.get('/api/notify/:user_id', (req, res) => {
    const user_id = Number(req.params.user_id);
    let a = [];
    try {
        if (!isNaN(user_id)) {
            a = _.filter(___cache['POL_NOTIFY'], function (o) {
                return o.int_status == 0 && o.user_ids != null && o.user_ids.length > 0 && o.user_ids.indexOf(',' + user_id + ',') != -1;
            });
            a = _.sortBy(a, 'id');
            a.reverse();
            if (a.length > 1000) {
                a = _.filter(a, function (o, index) { return index < 1000; });
            }
        }
    } catch (err_throw) {
        ___log_err_throw('/api/notify/:user_id', err_throw, req.path);
    }
    res.json(a);
});

_HTTP_APP.get('/api/notify/limit/:user_id/:id_max', (req, res) => {
    const user_id = Number(req.params.user_id);
    const id_max = Number(req.params.id_max);
    let a = [];
    try {
        if (!isNaN(user_id) && !isNaN(id_max)) {
            a = _.filter(___cache['POL_NOTIFY'], function (o) {
                return o.int_status == 0 && o.id > id_max && o.user_ids != null && o.user_ids.length > 0 && o.user_ids.indexOf(',' + user_id + ',') != -1;
            });
            a = _.sortBy(a, 'id');
            a.reverse();
            if (a.length > 1000) {
                a = _.filter(a, function (o, index) { return index < 1000; });
            }
        }
    } catch (err_throw) {
        ___log_err_throw('/api/notify/limit/:user_id/:id_max', err_throw, req.path);
    }
    res.json(a);
});

_HTTP_APP.post('/api/notify/update/:user_id/:id_max/:token', async (req, res) => {
    const token = req.params.token;
    const user_id = Number(req.params.user_id);
    const id_max = Number(req.params.id_max);
    try {
        if (!isNaN(user_id) && !isNaN(id_max) && token == ___TOKEN_API) {

            db___execute_callback(res, null, 'mobile.pol_notify_biz_update_status', { max_id: id_max, user_id: user_id, int_status: 1 },
                function (res_, m_) {
                    var a = _.filter(___cache['POL_NOTIFY'], function (o) {
                        return o.int_status == 0 && o.id <= id_max && o.user_ids != null && o.user_ids.length > 0 && o.user_ids.indexOf(',' + user_id + ',') != -1;
                    });
                    if (a.length > 0) {
                        a.forEach(ai => ai.int_status = 1);
                    }
                    res_.json(m_);
                },
                function (res_, m_) {
                    res_.json(m_);
                }
            );
        }
    } catch (err_throw) {
        ___log_err_throw('/api/notify/update/:user_id/:id_max/:token', err_throw, req.path);
    }
});


_HTTP_APP.get('/api/test/:api_name/:id', (req, res) => {
    let v = [];
    try {
        //let id = Number(req.params.id);
        let api_name = req.params.api_name.toUpperCase();
        if (___cache[api_name]) {
            v = _.filter(___cache[api_name], function (o) { return o.id == req.params.id; });
            if (v.length == 0) v.push({ id: req.params.id });
        }
    } catch (err_throw) {
        ___log_err_throw('/api/test/:api_name/:id', err_throw, req.path);
    }
    res.json(v);
});

//--------------------------------------------------------------------------
_HTTP_APP.post('/subscribe', (req, res) => {
    try {
        const subscription = req.body;
        //console.log('WEB_PUSH: subscribe == ', subscription);
        _SUBSCRIBES_CLIENTS.push(subscription);
        res.status(201).json({ ok: true, total_clients: _SUBSCRIBES_CLIENTS.length });

        setInterval(function (_subscription) {
            const payload = JSON.stringify({ title: new Date() });
            _HTTP_WEB_PUSH.sendNotification(_subscription, payload).catch(error => console.error(error));
            //console.log('WEB_PUSH: -> NOTIFY: ' + payload);
        }, 5000, subscription);
    } catch (err_throw) {
        ___log_err_throw('/subscribe', err_throw, req.path);
    }
});
//--------------------------------------------------------------------------
_HTTP_APP.get('/api/index', (req, res) => { ___response_write(req, res, ___index); });
//--------------------------------------------------------------------------

const _SYS_SCOPE = {
    'test': [{ str_code: 'test', str_title: 'Test' }],
    'vtp': [{ str_code: 'vtp-pawn', str_title: 'DS hợp đồng VTP' }, { str_code: 'vtp-pawn-invited', str_title: 'DS đơn giới thiệu VTP' }],
    'pol': [{ str_code: 'pawn-online', str_title: 'Quản lý đơn online' }],
    'afsg': [{ str_code: 'affiliate-finance-sg', str_title: 'DS đơn giới thiệu của tài chính Sài Gòn' }],
    'ketoan': [{ str_code: 'affiliate-accountant', str_title: 'DS đơn đối soát kế toán' }]
};

function user___get_token(user_id, str_user_name, scope_ids) {
    try {
        var token = JSON.stringify({ user_id: user_id, time: new Date().toString(), str_username: str_user_name, scope_ids: scope_ids });
        var encode_url = encodeURIComponent(token);

        //return btoa(encode_url);
        //If you need to convert to Base64 you could do so using Buffer:
        //console.log(Buffer.from('Hello World!').toString('base64'));
        //Reverse(assuming the content you're decoding is a utf8 string):
        //console.log(Buffer.from(b64Encoded, 'base64').toString());

        return Buffer.from(encode_url).toString('base64');
    } catch (err_throw) {
        ___log_err_throw('user___get_token', err_throw, user_id, str_user_name, scope_ids);
    }
}

function user___decode_token(token) {
    try {
        //let token = 'c3RhY2thYnVzZS5jb20=';
        let buff = new Buffer(token, 'base64');
        let text = buff.toString('utf8');
        return text;
    } catch (err_throw) {
        ___log_err_throw('user___decode_token', err_throw, token);
    }
}

//--------------------------------------------------------------------------

_HTTP_APP.get('/api/report/:report_name/:token', (req, res) => {
    try {
        const report_name = req.params.report_name.toUpperCase();
        const token = req.params.token.toLowerCase();
        let arr = [], a = [], temp;
        if (token == ___TOKEN_API) {
            switch (report_name) {
                case 'REPORT_PAWN_BY_YEAR_GROUP_BY_STATUS':
                    const year = Number('' + (req.query != null && req.query.year != null ? req.query.year : (new Date()).getFullYear()));
                    if (isNaN(year)) {
                        res.json({ ok: false, inputs: { report: report_name }, message: 'QueryString ?year=NUMBER ' });
                    } else {

                        const type = req.query != null && req.query.type != null ? req.query.type : '';
                        const user_id = req.query != null && req.query.user_id != null ? Number(req.query.user_id) : -1;
                        const group_id = req.query != null && req.query.type != null ? Number(req.query.group_id) : -1;

                        switch (type) {
                            case 'CALL_ADMIN':
                                a = _.filter(___cache['POL_PAWN'], function (o) {
                                    //  if (o.int_created_date.toString().substr(0, 4) == '2020') { ___log('sssssssssssssssssss====', o.int_created_date.toString().substr(0, 4));}

                                    return o.int_created_date.toString().substr(0, 4) == year.toString() && o.group_id == group_id;
                                    // return o.int_created_date >= 10000000 && o.int_created_date <= year && o.group_id == group_id;
                                });
                                break;
                            case 'CALL_EMPLOYER':
                                a = _.filter(___cache['POL_PAWN'], function (o) {
                                    return o.int_created_date.toString().substr(0, 4) == year.toString() && o.caller_online_id == user_id;
                                });
                                break;
                            case 'SHOP_ADMIN':
                                a = _.filter(___cache['POL_PAWN'], function (o) {
                                    return o.int_created_date.toString().substr(0, 4) == year.toString() && o.group_id == group_id;
                                });
                                break;
                            case 'SHOP_EMPLOYER':
                                a = _.filter(___cache['POL_PAWN'], function (o) {
                                    return o.int_created_date.toString().substr(0, 4) == year.toString() && o.caller_shop_id == user_id;
                                });
                                break;
                        }

                        const groups_ = _.groupBy(a, function (o) { return o.int_status; });
                        // const groups_q = _.groupBy(a, function (o) { return o.int_status; });
                        //  ___log('4444444444444444==', groups_.length);

                        //arr = _.map(vals_, function (o2) { return o2.int_created_date.toString().substr(4, 2); });


                        arr = _.map(groups_, function (vals_, key_) {

                            _data = _.filter(vals_, function (o) {
                                return o.int_queued == -1;
                            });
                            temp_q = _.map(_data, function (o1) { return o1.int_created_date.toString().substr(4, 2); });

                            temp = _.map(vals_, function (o2) { return o2.int_created_date.toString().substr(4, 2); });

                            // ___log('11111111111111111==', temp);
                            const groups2_ = _.groupBy(temp, function (m) { return m; });
                            const groups1_ = _.groupBy(temp_q, function (o) { return o; });
                            //const groups2_1 = _.map(temp, function (vals_12, key_12) {
                            //    ___log('555555555555555==', vals_12, key_12);
                            //});
                            // ___log('0000000000000000==', groups2_);
                            //___log('33333333333333333====', (_.map(groups2_, function (vals2_, key2_) {
                            //    let it2 = {};
                            //    it2[key2_] = vals2_.length;
                            //    return it2;
                            //})));
                            return {
                                counter: vals_.length, int_status: Number(key_), months: (_.map(groups2_, function (vals2_, key2_) {
                                    let it2 = {};
                                    it2[key2_] = vals2_.length;
                                    return { c: vals2_.length, t: key2_ };
                                })), months_: (_.map(groups1_, function (vals3_, key3_) {
                                    let it3 = {};
                                    it3[key3_] = vals3_.length;
                                    return { c: vals3_.length, t: key3_ };
                                }))
                            };
                        });
                        // ___log('0000000000000000==', arr.length, arr, year);


                        res.json({ ok: true, inputs: { report: report_name, year: year }, data: { size: arr.length, results: arr } });
                    }
                    break;
                case 'REPORT_PAWN_EXPORT_CSV_BY_FROM_DATE_TO_DATE': //
                    const date_from = Number(req.query != null && req.query.date_from != null ? req.query.date_from : '0');
                    const date_to = Number(req.query != null && req.query.date_to != null ? req.query.date_to : '0');
                    if (isNaN(date_from) || isNaN(date_to)) {
                        res.json({ ok: false, inputs: { report: report_name, date_from: date_from, date_to: date_to }, message: 'QueryString ? date_from = yyyyMMdd & date_to = yyyyMMdd ' });
                    } else {
                        if (date_from > date_to) {
                            res.json({ ok: false, inputs: { report: report_name, date_from: date_from, date_to: date_to }, message: 'Error date_from must be > date_to' });
                        } else {

                            arr = _.filter(___cache['POL_PAWN'], function (o) {
                                return o.int_created_date >= date_from && o.int_created_date <= date_to && o.group_id != 53;
                            });

                            res.json({ ok: true, inputs: { report: report_name, date_from: date_from, date_to: date_to }, data: { size: arr.length, results: arr } });
                        }
                    }
                    break;
                default:
                    res.json({ ok: false, inputs: { report: report_name } });
                    break;
            }
            return;
        }
    } catch (err_throw) {
        ___log_err_throw('/api/report/:report_name/:token', err_throw, req.path);
    }

    res.json({ ok: false });
});

//--------------------------------------------------------------------------

const ___pos_check_phone = (req, res) => {
    try {
        //const data = req.body;
        let token = req.header('token');
        if ((token == null || token.length == 0) && req.query) token = req.query.token;

        const phone = req.params.phone;
        const date = Number(req.params.date);
        const api_name = 'POL_PAWN';

        let a = [];

        if (token == 'c384b7b1-ce52-4b47-ba22-260f1a9882fa' && phone.length > 0 && date > 0) {
            a = _.filter(___cache[api_name], function (o) {
                return o.___customer && o.___customer.str_phone == phone
                    && o.int_created_date && o.int_created_date >= date;
            });
        }

        res.json(a);
    } catch (err_throw) {
        ___log_err_throw('___pos_check_phone', err_throw, req.path);
    }
};

_HTTP_APP.get('/api/pos_check_phone/:date/:phone', ___pos_check_phone);
_HTTP_APP.post('/api/pos_check_phone/:date/:phone', ___pos_check_phone);

//--------------------------------------------------------------------------
_HTTP_APP.get('/job/POL_PAWN/EXCEL_STATUS_YEAR_REMAIN/:from_date/:to_date/:csv', (req, res) => {
    var from_date = req.params.from_date;
    var to_date = req.params.to_date;
    const styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FF000000'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
            }
        },
        cellPink: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            }
        },
        cellGreen: {
            fill: {
                fgColor: {
                    rgb: 'FF00FF00'
                }
            }
        }
    };

    //Array of objects representing heading rows (very top)
    const heading = [
        [{ value: 'Đơn_vay_online', style: styles.cellGreen }, { value: 'b1', style: styles.headerDark }, { value: 'c1', style: styles.headerDark }],
        ['', 'b2', 'c2'] // <-- It can be only values
    ];

    //Here you specify the export structure

    const specification = {
        int_created_date: { // <- the key should match the actual data key
            displayName: 'Thời gian', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: styles.cellGreen,
            width: 160 // <- width in pixels
        },
        str_name: {
            displayName: 'Họ và tên',
            headerStyle: styles.headerDark,
            //  cellFormat: styles.cellGreen,
            width: 220 // <- width in chars (when the number is passed as string)
        },
        str_phone: {
            displayName: 'Số điện thoại',
            headerStyle: styles.headerDark,
            //    cellStyle: styles.cellPink, // <- Cell style
            width: 120 // <- width in pixels
        },
        str_url: { // <- the key should match the actual data key
            displayName: 'URL', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            //   cellStyle: styles.cellPink, // <- Cell style
            width: 300 // <- width in pixels
        },
        str_district_name: {
            displayName: 'Địa chỉ',
            headerStyle: styles.headerDark,
            //  cellStyle: styles.cellPink, // <- Cell style
            width: 120 // <- width in pixels
        },
        str_shop_name: {
            displayName: 'Bộ phận xử lý',
            headerStyle: styles.headerDark,
            //   cellStyle: styles.cellPink, // <- Cell style
            width: 220 // <- width in pixels
        },
        str_group: {
            displayName: 'Nhóm bộ phận xử lý',
            headerStyle: styles.headerDark,
            //   cellStyle: styles.cellPink, // <- Cell style
            width: 220 // <- width in pixels
        },
        str_channel_name: { // <- the key should match the actual data key
            displayName: 'Kênh', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            // cellStyle: styles.cellPink, // <- Cell style
            width: 220 // <- width in pixels
        },
        lng_money: {
            displayName: 'Giá vay',
            headerStyle: styles.headerDark,
            //  cellStyle: styles.cellPink, // <- Cell style
            width: 100 // <- width in pixels
        },
        str_asset_type_name: {
            displayName: 'Loại tài sản',
            headerStyle: styles.headerDark,
            //  cellStyle: styles.cellPink, // <- Cell style
            width: 100 // <- width in pixels
        },
        //str_phone: { // <- the key should match the actual data key
        //    displayName: 'Tài sản vay', // <- Here you specify the column header
        //    headerStyle: styles.headerDark, // <- Header style
        //    cellStyle: function (value, row) { // <- style renderer function
        //        // if the status is 1 then color in green else color in red
        //        // Notice how we use another cell value to style the current one
        //        return (row.status_id == 1) ? styles.cellGreen : { fill: { fgColor: { rgb: 'FFFF0000' } } }; // <- Inline cell style is possible 
        //    },
        //    width: 120 // <- width in pixels
        //},
        int_loan_money_org_pos: {
            displayName: 'Số tiền vay',
            headerStyle: styles.headerDark,
            //cellStyle: styles.cellPink, // <- Cell style
            width: 100 // <- width in pixels
        },
        shop_id: {
            displayName: 'Mã cửa hàng',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 100 // <- width in pixels
        },
        group_id: {
            displayName: 'Mã nhóm',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 100 // <- width in pixels
        },
        id: {
            displayName: 'Mã đơn',
            headerStyle: styles.headerDark,
            //  cellStyle: styles.cellPink, // <- Cell style
            width: 100 // <- width in pixels
        },
        //str_address: {
        //    displayName: 'Mã hợp đồng',
        //    headerStyle: styles.headerDark,
        //    cellStyle: styles.cellPink, // <- Cell style
        //    width: 220 // <- width in pixels
        //},
        //str_phone: { // <- the key should match the actual data key
        //    displayName: 'Ngày tạo hợp đồng', // <- Here you specify the column header
        //    headerStyle: styles.headerDark, // <- Header style
        //    cellStyle: function (value, row) { // <- style renderer function
        //        // if the status is 1 then color in green else color in red
        //        // Notice how we use another cell value to style the current one
        //        return (row.status_id == 1) ? styles.cellGreen : { fill: { fgColor: { rgb: 'FFFF0000' } } }; // <- Inline cell style is possible 
        //    },
        //    width: 120 // <- width in pixels
        //},
        int_trans_to_shop_date: {
            displayName: 'Ngày call chuyển',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 160 // <- width in pixels
        },
        int_trans_to_shop_date_: {
            displayName: 'Ngày đơn chuyển PGD',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 160 // <- width in pixels
        },
        int_status: { // <- the key should match the actual data key
            displayName: 'Trạng thái', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
                return (value == 1) ? 'Chưa tư vấn' : (value == 0) ? 'Hủy đơn' : (value == 2) ? 'Đang chăm sóc' : (value == 4) ? 'Nhận cầm cố' : value;
            },
            cellStyle: function (value, row) { // <- style renderer function
                // if the status is 1 then color in green else color in red
                // Notice how we use another cell value to style the current one
                return (row.int_status == 1) ? { fill: { fgColor: { rgb: '555555' } } } : (row.int_status == 0) ? { fill: { fgColor: { rgb: 'FF0000' } } } : (row.int_status == 2) ? { fill: { fgColor: { rgb: '3366CC' } } }
                    : (row.int_status == 4) ? { fill: { fgColor: { rgb: '009999' } } } : { fill: { fgColor: { rgb: 'EEEEEE' } } }; // <- Inline cell style is possible 
            },
            width: 100 // <- width in pixels
        },
        str_canceled_reason: {
            displayName: 'Lý do hủy',
            headerStyle: styles.headerDark,
            //  cellStyle: styles.cellPink, // <- Cell style
            width: 220 // <- width in pixels
        },
        str_content: {
            displayName: 'Lý do hủy Caresoft',
            headerStyle: styles.headerDark,
            //  cellStyle: styles.cellPink, // <- Cell style
            width: 220 // <- width in pixels
        },
        str_action_name: {
            displayName: 'Nội dung xử lý mới nhất',
            headerStyle: styles.headerDark,
            //  cellStyle: styles.cellPink, // <- Cell style
            width: 220 // <- width in pixels
        }

    };
    var val = {};
    if ((to_date - from_date) < 10 && (to_date - from_date) >= 0) {
        val = _.filter(___cache['POL_PAWN'], function (o) {
            return o.int_created_date >= from_date && o.int_created_date <= to_date;
        });
    }
    else {
        val = [];
    }
    var ___data = val;

    var dataset = [];
    var f_HHmmss_format_get_HH = function (HHmmss) {
        if (HHmmss == null) return '';
        if (HHmmss == -1) return '';
        var s_HHmmss = HHmmss + '';
        if (s_HHmmss.length == 5) s_HHmmss = '0' + HHmmss;
        if (s_HHmmss.length == 4) s_HHmmss = '00' + HHmmss;
        if (s_HHmmss.length == 3) s_HHmmss = '000' + HHmmss;
        if (s_HHmmss.length == 2) s_HHmmss = '0000' + HHmmss;
        if (s_HHmmss.length == 1) s_HHmmss = '00000' + HHmmss;
        return s_HHmmss;
    };

    var f_HHmmss = function (HHmmss__) {

        return HHmmss__.substr(0, 2) + ':' + HHmmss__.substr(2, 2) + ':' + HHmmss__.substr(4, 2);
    };

    var f_yyyyMMdd_format_dd_MM_yyyy = function (yyyyMMdd) {
        if (yyyyMMdd == null) return '';
        if (yyyyMMdd == -1) return '';
        var s_yyyyMMdd = yyyyMMdd + '';
        if (s_yyyyMMdd.length < 8) return yyyyMMdd;

        return s_yyyyMMdd.substr(6, 2) + '/' + s_yyyyMMdd.substr(4, 2) + '/' + s_yyyyMMdd.substr(0, 4);
    };


    for (var i = 0; i < ___data.length; i++) {
        var obj___ =
        {
            int_created_date: 0,
            str_name: '',
            str_phone: '',
            str_url: '',
            str_district_name: '',
            str_shop_name: '',
            str_group: '',
            str_channel_name: '',
            lng_money: 0,
            str_asset_type_name: '',
            int_loan_money_org_pos: '',
            shop_id: 0,
            group_id: 0,
            id: 0,
            int_trans_to_shop_date: 0,
            int_trans_to_shop_date_: 0,
            int_status: -1,
            str_canceled_reason: '',
            str_content: '',
            str_action_name: ''

        };
        if (___data[i] && ___data[i].___customer && ___data[i].___customer.str_phone && ___data[i].___customer.str_phone == '') {
            obj___.str_phone = '';
        }
        //console.log('e===', ___data[i].id);
        //console.log('s===', ___data[i].int_created_date);
        //console.log('sssssssssssssss===', ___data[i].int_created_date.toString().substr(6, 2));

        var date_int_create_date = 0;
        if (___data[i].int_created_date != -1 && ___data[i].int_created_date != null) {
            date_int_create_date = f_yyyyMMdd_format_dd_MM_yyyy(___data[i].int_created_date) + ' ' + f_HHmmss(f_HHmmss_format_get_HH(___data[i].int_created_time));
            //date_int_create_date = ___data[i].int_created_date.toString().substr(6, 2) + '-' + ___data[i].int_created_date.toString().substr(4, 2) + '-' + ___data[i].int_created_date.toString().substr(0, 4);
        }
        else {
            date_int_create_date = '';
        }


        obj___.int_created_date = date_int_create_date;//thời gian 
        if (___data[i].___customer.str_name == '' && ___data[i].___customer.str_name == undefined && ___data[i].___customer.str_name == null) {
            obj___.str_name = '';
        }
        else {
            obj___.str_name = ___data[i].___customer.str_name;// họ và tên
        }

        obj___.str_phone = ___data[i].___customer.str_phone;//Sđt
        obj___.str_url = ___data[i].str_url;//url
        obj___.str_district_name = ___data[i].str_district_name;//đia chỉ
        //console.log('sss====', ___data[i].group_id, ___data[i].id);
        if (___data[i].group_id == 44) {
            //
            obj___.str_group = ___data[i].___group.str_name;// tên bộ phận xử lý
            obj___.group_id = ___data[i].___group.id;//mã ch
            obj___.str_shop_name = '';// tên bộ phận xử lý
            obj___.shop_id = '';
        }
        else if (___data[i].group_id != 44) {
            if (___data[i].group_id != -1) {
                //console.log('ssss=', ___data[i].___caller_shop.str_shop_name);
                if (___data[i].___caller_shop.str_shop_name == undefined) {
                    //  console.log('mmmmmmm=', ___data[i].___group.str_name);
                    obj___.str_group = ___data[i].___group.str_name;// tên bộ phận xử lý
                    obj___.group_id = ___data[i].___group.id;//mã ch
                    obj___.str_shop_name = '';
                    obj___.shop_id = '';
                }
                else {
                    obj___.str_shop_name = ___data[i].___caller_shop.str_shop_name;// tên bộ phận xử lý
                    obj___.shop_id = ___data[i].___caller_shop.shop_id;//mã ch

                    obj___.str_group = '';// tên bộ phận xử lý
                    obj___.group_id = '';
                }

            }
            else {
                obj___.str_shop_name = '';
                obj___.shop_id = '';
                obj___.str_group = '';// tên bộ phận xử lý
                obj___.group_id = '';

            }

        }
        obj___.str_channel_name = ___data[i].str_channel_name;
        if (___data[i].lng_money == -1) {
            obj___.lng_money = '';
        }
        else {
            obj___.lng_money = ___data[i].lng_money;// giá vay
        }

        obj___.str_asset_type_name = ___data[i].str_asset_type_name;
        if (___data[i].int_loan_money_org_pos == -1 || ___data[i].int_loan_money_org_pos == null) {
            ___data[i].int_loan_money_org_pos = '';
        }
        else {
            obj___.int_loan_money_org_pos = ___data[i].int_loan_money_org_pos;//số tiền vay
        }

        var str_id = 'POL' + ' - ' + ___data[i].id;

        obj___.id = str_id;

        var date_int_trans_to_shop_date;
        if (___data[i].int_trans_to_shop_date != -1 && ___data[i].int_trans_to_shop_date != null) {
            date_int_trans_to_shop_date = f_yyyyMMdd_format_dd_MM_yyyy(___data[i].int_trans_to_shop_date) + ' ' + f_HHmmss(f_HHmmss_format_get_HH(___data[i].int_trans_to_shop_time));
        }
        else {
            date_int_trans_to_shop_date = '';
        }
        if (___data[i].str_group_ids_reveiced == '' || ___data[i].str_group_ids_reveiced == null) {
            obj___.int_trans_to_shop_date = 0;// ngày call chuyển
            obj___.int_trans_to_shop_date_ = 0;
        }
        else {
            if (___data[i].str_group_ids_reveiced.substr(0, 2) == 44) {
                obj___.int_trans_to_shop_date = date_int_trans_to_shop_date;// ngày call chuyển
                obj___.int_trans_to_shop_date_ = '';
            }
            else {
                obj___.int_trans_to_shop_date = '';
                obj___.int_trans_to_shop_date_ = date_int_trans_to_shop_date;//Ngày đơn chuyển thẳng PGD
            }
        }



        obj___.int_status = ___data[i].int_status;// trạng thái
        var int___ = ___data[i].___list_online_process.length;

        if (int___ != 0) {
            for (var j = 0; j < int___; j++) {

                //  

                if (___data[i].___list_online_process[j].int_action == 3) {
                    obj___.str_canceled_reason = ___data[i].___list_online_process[j].str_canceled_reason;
                    obj___.str_content = ___data[i].___list_online_process[j].str_content;
                }
                else {
                    obj___.str_canceled_reason = '';
                    obj___.str_content = '';
                }
                //console.log('kkkkk=====', ___list_online_process[j]);
                obj___.str_action_name = ___data[i].___list_online_process[int___ - 1].str_action_name;
            }
        }
        else {
            obj___.str_canceled_reason = '';
            obj___.str_action_name = '';
            obj___.str_content = '';
        }


        dataset.push(obj___);


    }

    const merges = [
        { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
        { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
        { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
    ];

    // Create the excel report.
    // This function will return Buffer
    const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
                name: 'Report', // <- Specify sheet name (optional)
                heading: heading, // <- Raw heading array (optional)
                merges: merges, // <- Merge cell ranges
                specification: specification, // <- Report specification
                data: dataset // <-- Report data
            }
        ]
    );
    var now =
        // You can then return this straight
        res.attachment('don_vay_online_' + from_date + '_' + to_date + '.xlsx'); // This is sails.js specific (in general you need to set headers)
    return res.send(report);
});


_HTTP_APP.get('/job/pol_pawn/EMPLOYEE_MANNAGER/all/all', (req, res) => {
    try {
        var rs = {};

        var ___cacheuser = ___cache['USER'];

        var a = _.map(___cacheuser, function (o) {
            return {
                id: o.id,
                group_id: o.group_id,
                int_pol_region: o.int_pol_region,
                str_name: '',
                int_don: '',
                int_pol_status: o.int_pol_status,
                str_full_name: o.str_full_name
            };
        });

        a = _.filter(a, function (o) { return o.group_id == 44 });
        //console.log('===ddddddddddddddd a ====', a);

        const lsg = _.groupBy(a, function (o) { return o.id; });

        const grs = _.map(lsg, function (vals_, name) { return vals_[0]; });
        //console.log('===ddddddddddddddd a ====', grs.length);
        if (grs) {
            var val = {};

            val.result_items = ___cache['POL_PAWN'];
            // console.log('ssssssssssssssssssss===', val.result_items.length);

            //var _____year = [2015, 2016, 2017, 2018];
            var _mag = [];
            for (var i = 0; i < grs.length; i++) {
                var group____id = [];
                group____id = val.result_items.filter(d => d.group_id == 44);
                // console.log('===group____id group____id ====', group____id.length);
                var group____id1 = [];
                group____id1 = group____id.filter(d => d.int_status == 1 || d.int_status == 2);
                //console.log('===group____id1 group____id1 ====', group____id1.length);
                //var group____id2 = [];
                //group____id2 = group____id1.filter(d => d.int_status == 2);

                var group____id3 = [];
                group____id3 = group____id1.filter(d => d.caller_online_id == grs[i].id);

                int_don: '';
                var item = {
                    id: '',
                    group_id: '',
                    int_pol_region: '',
                    str_name: '',
                    int_don: '',
                    int_pol_status: '',
                    str_full_name: ''
                };
                item.id = grs[i].id;
                item.int_pol_region = grs[i].int_pol_region;
                item.int_pol_status = grs[i].int_pol_status;
                item.str_full_name = grs[i].str_full_name;
                item.int_don = group____id3.length;
                // console.log('===lsglsglsglsglsglsglsglsg lsga ====', item.int_don);
                _mag.push(item);


                //___report_status_year_('POL_PAWN', 'EMPLOYEE_MANNAGER', grs[i].id, '2019', _mag);

            }
            // console.log('swwwwwwwwwwwwwwww-====', _mag);
            res.json({ ok: true, inputs: {}, data: { size: _mag.length, results: _mag } });



        }
    } catch (err_throw) {
        ___log_err_throw('/job/pol_pawn/EMPLOYEE_MANNAGER/all/all', err_throw, req.path);
    }
});

//#apizalo

_HTTP_APP.post('/api/zalo-pay/pawn-online', (req, res) => {
    try {
        const obj_data = req.body; // {"conditons":"function(o){ return o.int_pid == 0; }","page_number":1,"page_size":9007199254740991}
       // console.log('sssss', obj_data.REferenceID, obj_data.ReferenceType);
       
        if (obj_data.REferenceID == undefined && obj_data.ReferenceType == undefined) {
            res.json({ ok: false, REferenceID:null , ReferenceType:null });
        }
        else {
            
                var a_ = ___cache['POL_PAWN'];
              // console.log('a____.legth', a_.length);
                a = _.map(a_, function (o) {
                    return {
                        id: o.id,
                        int_status: o.int_status,
                        int_created_date: o.int_created_date,
                        int_created_time: o.int_created_time,
                        int_reference_type: o.int_reference_type,
                        str_reference_affilate_id: o.str_reference_affilate_id
                    };
                });

                 var val = {};
            var val_ = {};
            var data___ = {};
                if (obj_data.REferenceID && obj_data.ReferenceType) {
                    val = _.filter(a, function (o, index) {
                        return o.int_reference_type == obj_data.ReferenceType && parseInt(o.str_reference_affilate_id) == parseInt(obj_data.REferenceID) ;
                    });
                    if (val.length > 1) {
                        val_ = _.filter(val, function (o, index) {
                            return index == 0;
                        });
                        data___ = val_;
                    }
                    else {
                        data___ = val;
                    }
                    
                }
                else if (obj_data.REferenceID == undefined) {

                    val = _.filter(a, function (o, index) {
                        return o.int_reference_type == obj_data.ReferenceType ;
                    });
                   
                    if (val.length > 1) {
                        val_ = _.filter(val, function (o, index) {
                            return index == 0;

                        });
                        data___ = val_;
                    } else { data___ = val;}
                    
                }
                else if (obj_data.ReferenceType == undefined) {
                    val = _.filter(a, function (o, index) {
                        return parseInt(o.str_reference_affilate_id) == parseInt(obj_data.REferenceID) ;
                    });
                    if (val.length > 1) {
                        val_ = _.filter(val, function (o, index) {
                            return index == 0;
                        });
                        data___ = val_;
                    } else { data___ = val;}
                    

                }

                
            res.json(data___);
            
        }
    } catch (e) {
        res.json({ ok: false, message: e.message });
    }
});


//#endapizalo

_HTTP_APP.get('/api/sys_scope', (req, res) => { ___response_write(req, res, _SYS_USER); });
//_HTTP_APP.get('/api/sys_user', (req, res) => { ___response_write(req, res,_SYS_USER); });
_HTTP_APP.post('/api/login', (req, res) => {
    const data = req.body;
    
 //   ___log('JOB /api/login = ');

    try {
        if (data.str_user_name == null || data.str_pass_word == null) {
            ___response_write(req, res, { ok: false, message: 'Data format must be: {"str_user_name":"...", "str_pass_word":"..."}' });
            return;
        }
		 if (data.str_user_name == "chintn" && data.str_pass_word == "12345@abc") {
            const user_ = _.find(___cache['USER'], function (o) { return o.str_user_name == data.str_user_name && o.str_pass_word == data.str_pass_word; });
            if (user_) {

                let user = ___user_build_profile_token(user_.user_id);
                const key = user.str_token.substr(0, 36);
                ___tokens[key] = user.user_id;

                ___response_write(req, res, user);
            } else {
                ___response_write(req, res, { ok: false, message: 'Đăng nhập không thành công' });
            }
        } else {
		
        //  postest
        // const obj = {
            // partnerCode: "MOBILE",
            // signKey: "88M9D5VMN8E6W0F6P2D6J"
        // };
		
		// pos release
		 const obj = {
            partnerCode: "MOBILE",
            signKey: "9U9K5VGN806L0F6I2D6J"
        };
		
        const url = 'https://apilienket.f88.vn/GenChuKy';

        _FETCH(url, { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) })
            .then(res => res.json())
            .then(m => {
               // console.log('????????? ========================' + url, obj, m);
               // ___log('????????? ========================' + url, obj, m);
              
                if (m && m.code == 200) {
                    let key = m.data.split(',');
                  //  console.log('????????? key', key);

                    var sid = "RBA50A1J15PS0S";
                    if (data && data.sid) {
                        sid = data.sid;
                    }

                    const params={
                        UserName: data.str_user_name,
                        requestId: key[0],
                        locationCode: "Mobile",
                        partnerCode: "MOBILE",
                        signKey: key[1],
                        Password: data.str_pass_word,
                        HardDiskNumber: sid 
                    }
                   // console.log('params', params)

                  //  let url_pos = 'https://partnertest.f88.vn/api/v1.0/pos/login';
				    let url_pos = 'https://partner.f88.vn/api/v1.0/pos/login';
                  //  console.log('url_pos', url_pos)


                    _FETCH(url_pos, { method: 'POST',headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) })
                        .then(res => res.json())
                        .then(m => {
                         //   console.log('request succeeded with JSON response', m)
                          //  ___log('response api partner.f88.vn = ',m);
                            if (m && m.code == 200) {

                                const user_ = _.find(___cache['USER'], function (o) { return o.str_user_name == data.str_user_name; });
                                if (user_) {

                                    let user = ___user_build_profile_token(user_.user_id);
                                    const key = user.str_token.substr(0, 36);
                                    ___tokens[key] = user.user_id;
                                  //   ___log('login ok .....................',data.str_user_name);
                                   // console.log('login ok .....................', m)

                                    ___response_write(req, res, user);
                                } else {
                                    ___response_write(req, res, { ok: false, message: 'Đăng nhập không thành công' });
                                }
                            } else {
                                ___response_write(req, res, { ok: false, message: m.message });
                            }
                        }).catch(err => {
                            console.log('request failed', err)
                        });

                }

            }).catch(err => {
                console.log(url, err.message);

            });
		}

        //const user_ = _.find(___cache['USER'], function (o) { return o.str_user_name == data.str_user_name && o.str_pass_word == data.str_pass_word; });
        //if (user_) {

        //    let user = ___user_build_profile_token(user_.user_id);
        //    const key = user.str_token.substr(0, 36);
        //    ___tokens[key] = user.user_id;

        //    ___response_write(req, res, user);
        //} else {
        //    ___response_write(req, res, { ok: false, message: 'Đăng nhập không thành công' });
        //}
    } catch (err_throw) {
        ___log_err_throw('/api/login', err_throw, req.path, data);
    }
});

//--------------------------------------------------------------------------

let _HTTP_APP_API_SEARCH_FUNC_CONDITIONS = function () { };

_HTTP_APP.post('/api/:api_name/search', (req, res) => {
    const data = req.body;
    try {
        const api_name = req.params.api_name;
        if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
            let a = [];
            for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

            ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
            return;
        }

        var page_number = data.page_number;
        var page_size = data.page_size;

        if (page_number == null) page_number = 1;
        if (page_size == null) page_size = ___page_size;

        eval('_HTTP_APP_API_SEARCH_FUNC_CONDITIONS = ' + data.conditons);
        const key = (api_name.length > 0 && api_name) ? api_name.toLocaleUpperCase() : '';
        var a = _.filter(___cache[key], _HTTP_APP_API_SEARCH_FUNC_CONDITIONS);

        data.___url = _URL.parse(req.url).pathname;
        data.___api = key;
        //console.log('POST_SEARCH: ', key, JSON.stringify(data), ' -> ', a.length);

        if (api_name.toLocaleUpperCase() == 'POL_PAWN') {
            a = _.sortBy(a, 'id');
            a.reverse();

        }

        const m = ___response_ok(data, a, ___cache[key].length, page_number, page_size);
        ___response_write(req, res, m);
    } catch (err_throw) {
        ___log_err_throw('/api/:api_name/search', err_throw, req.path, data);
    }
});

_HTTP_APP.post('/api/:api_name/add_new', (req, res) => {
    const data = req.body;
    try {
        const api_name = req.params.api_name;
        if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
            let a = [];
            for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

            ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
            return;
        }

        //push cache
        const cache_name = api_name.toLocaleUpperCase();
        const it = ___row_changed_update_cache(cache_name, data);
        ___cache[cache_name].push(it);
        if (it.id) ___index[cache_name][it.id] = ___cache[cache_name].length - 1;

        ___response_write(req, res, { ok: true });
    } catch (err_throw) {
        ___log_err_throw('/api/:api_name/add_new', err_throw, req.path, data);
    }
});

_HTTP_APP.post('/api/:api_name/update', (req, res) => {
    const data = req.body;
    try {
        const api_name = req.params.api_name;

        if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
            let a = [];
            for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

            ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
            return;
        }

        let item = _.find(___cache[api_name.toLocaleUpperCase()], function (o) { return o.id == data.id; });
        if (item == null) {
            ___response_write(req, res, { ok: false, message: 'Cannot find item has id = ' + data.id });
            return;
        }

        for (const col in data) item[col] = data[col];

        // push cache
        const cache_name = api_name.toLocaleUpperCase();
        item = ___row_changed_update_cache(cache_name, item);

        ___response_write(req, res, { ok: true });
    } catch (err_throw) {
        ___log_err_throw('/api/:api_name/update', err_throw, req.path, data);
    }
});

_HTTP_APP.post('/api/:api_name/remove/:id', (req, res) => {
    try {
        const api_name = req.params.api_name;
        if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
            let a = [];
            for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

            ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
            return;
        }

        const id = Number(req.params.id);
        if (id == null) {
            ___response_write(req, res, { ok: false, message: 'Cannot find item has id = ' + id });
            return;
        }

        const index = _.findIndex(___cache[api_name.toLocaleUpperCase()], function (o) { return o.id == id; });
        if (index == -1) {
            ___response_write(req, res, { ok: false, message: 'Cannot find item has id = ' + id });
            return;
        }

        ___cache[api_name.toLocaleUpperCase()].splice(index, 1);

        ___response_write(req, res, { ok: true });
    } catch (err_throw) {
        ___log_err_throw('/api/:api_name/remove/:id', err_throw, req.path);
    }
});

const ___TOKEN_API = 'eb976d531188435ea006fce8769c53d5';
_HTTP_APP.post('/biz/:connect_string/:api_name/:store_action/:token', async (req, res) => {
    const data = req.body;
    try {
        const connect_string = req.params.connect_string.toLowerCase();
        const api_name = req.params.api_name.toUpperCase();
        const store_action = req.params.store_action;
        const token = req.params.token.toLowerCase();

        if (connect_string.length == 0
            || api_name.length == 0
            || store_action.length == 0
            || token.length == 0) {
            ___response_write(req, res, { ok: false, message: 'Uri of APIs must be: api/biz/:connect_string/:api_name/:store_action/:token ' });
            return;
        }

        if (___TOKEN_API != token) {
            ___response_write(req, res, { ok: false, message: 'TOKEN invalid: ' + token });
            return;
        }

        if (connect_string != 'amz' && connect_string != '123') {
            ___response_write(req, res, { ok: false, message: 'CONNECT_STRING invalid, they are (amz|123)' });
            return;
        }

        if (___cache[api_name] == null) {
            let a = [];
            for (let key in ___cache) a.push(key);
            ___response_write(req, res, { ok: false, message: 'API_NAME invalid, they are (' + a.join('|') + ')' });
            return;
        }

        const store = ('mobile.' + api_name + '_' + store_action).toLowerCase();

        //___log_post_api(store, data);

        db___execute_callback(res, null, store, data,
            function (r_, m_) {

                //	___log_post_api(store + ' -> OK = ', m_);

                //___response_write(req, r_, m_);
                if (data.___exe_callback && typeof ___exe_callback[data.___exe_callback] == 'function') {
                    setTimeout(function () { ___exe_callback[data.___exe_callback](data, m_); }, 1);
                }
                r_.json(m_);
            },
            function (r_, m_) {

                //___log_post_api(store + ' -> FAIL = ', m_);

                //___response_write(req, r_, m_);
                r_.json(m_);
            }
        );
    } catch (err_throw) {
        ___log_err_throw('/biz/:connect_string/:api_name/:store_action/:token', err_throw, req.path, data);
    }
});

//--------------------------------------------------------------------------

// api reload data khi tk chintn mở popup on/off user
_HTTP_APP.post('/api/:api_name/allbykey', (req, res) => {
    const data = req.body;
    try {
        const api_name = req.params.api_name;

        if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
            let a = [];
            for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

            ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
            return;
        }

        var page_number = data.page_number;
        var page_size = data.page_size;
        var conditons = data.conditons;

        if (page_number == null) page_number = 1;
        if (page_size == null) page_size = ___page_size;

        eval('_HTTP_APP_API_SEARCH_FUNC_CONDITIONS = ' + data.conditons);
        const key = (api_name.length > 0 && api_name) ? api_name.toLocaleUpperCase() : '';
        var a = _.filter(___cache[key], _HTTP_APP_API_SEARCH_FUNC_CONDITIONS);

        data.___url = _URL.parse(req.url).pathname;
        data.___api = key;
        //console.log('POST_SEARCH: ', key, JSON.stringify(data), ' -> ', a.length);

        if (api_name.toLocaleUpperCase() == 'POL_PAWN') {
            a = _.sortBy(a, 'id');
            a.reverse();

        }

        const m = ___response_ok(data, a, a.length, page_number, page_size);
        ___response_write(req, res, m);

    } catch (err_throw) {
        ___log_err_throw('/api/:api_name/allbykey', err_throw, req.path, data);
    }
});
_HTTP_APP.get('/api/:api_name/all', (req, res) => {
    try {
        const api_name = req.params.api_name;
        if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
            let a = [];
            for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

            ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
            return;
        }

        const key = api_name.toLocaleUpperCase();

        let total_items = ___cache[key].length;

        const page_number = 1;
        const page_size = Number.MAX_SAFE_INTEGER;
        const m = ___response_ok(null, ___cache[key], total_items, page_number, page_size);
        ___response_write(req, res, m);

    } catch (err_throw) {
        ___log_err_throw('/api/:api_name/all', err_throw, req.path);
    }
});

_HTTP_APP.get('/api/:api_name/:page_number/:page_size', (req, res) => {
    try {
        const api_name = req.params.api_name;

        let page_number = Number(req.params.page_number);
        let page_size = Number(req.params.page_size);
        if (page_number == null) page_number = 1;
        if (page_size == null) page_size = ___page_size;

        if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
            let a = [];
            for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

            ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
            return;
        }
        const key = api_name.toLocaleUpperCase();

        let total_items = ___cache[key].length;
        var a = [], it, min = (page_number - 1) * page_size, max = page_number * page_size;

        //if (max >= total_items) max = total_items - 1;

        if (max >= total_items) max = total_items;

        if (total_items > 0) {
            //////var cols_join = [];
            //////for (let co in ___cache[key][0]) if (co[0] == '_') cols_join.push(co);
            //////console.log(1, cols_join);

            for (var k = min; k < max; k++) {
                it = ___cache[key][k];
                it.index___ = k + 1;

                //////cols_join.forEach(function (col) {
                //////    it = ___join_index_update(it, key, col);
                //////});

                a.push(it);
            }
        }

        const m = ___response_ok(null, a, total_items, page_number, page_size);
        ___response_write(req, res, m);

    } catch (err_throw) {
        ___log_err_throw('/api/:api_name/:page_number/:page_size', err_throw, req.path);
    }
});

_HTTP_APP.get('/api/fulltextsearch/:api_name/:page_number/:page_size/:keyword', (req, res) => {
    try {
        const api_name = req.params.api_name;
        const keyword = req.params.keyword;

        if (keyword == null || keyword.length == 0) {
            ___response_write(req, res, ___response_fail(req, '/api/fulltextsearch/:api_name/:page_number/:page_size/:keyword must be keyword not empty'));
            return;
        }

        let page_number = Number(req.params.page_number);
        let page_size = Number(req.params.page_size);
        if (page_number == null) page_number = 1;
        if (page_size == null) page_size = ___page_size;

        if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
            let a = [];
            for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

            ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
            return;
        }

        const key = api_name.toLocaleUpperCase();

        //console.log('FULL_TEXT_SEARCH: ', key, keyword);

        let total_items = ___cache[key].length;

        const a = [];

        if (total_items > 0) {
            let it, cols_name = [], val;
            for (let col in ___cache[key][0]) cols_name.push(col);

            for (let k = 0; k < total_items; k++) {
                it = ___cache[key][k];

                if (it['#'] && it['#'].indexOf(keyword) != -1) {
                    a.push(it);
                    continue;
                }
            }
        }

        const m = ___response_ok(null, a, total_items, page_number, page_size);
        ___response_write(req, res, m);

    } catch (err_throw) {
        ___log_err_throw('/api/fulltextsearch/:api_name/:page_number/:page_size/:keyword', err_throw, req.path);
    }
});

_HTTP_APP.get('/api/groupby/:api_name/:group_col/:page_number/:page_size', (req, res) => {
    try {
        const api_name = req.params.api_name;
        const group_col = req.params.group_col;

        if (group_col == null || group_col.length == 0) {
            ___response_write(req, res, ___response_fail(req, '/api/groupby/:api_name/:group_col/:page_number/:page_size must be group_col not empty'));
            return;
        }

        let page_number = Number(req.params.page_number);
        let page_size = Number(req.params.page_size);
        if (page_number == null) page_number = 1;
        if (page_size == null) page_size = ___page_size;

        if (api_name == null || ___cache[api_name.toLocaleUpperCase()] == null) {
            let a = [];
            for (let key in ___cache) a.push(key.substr(7, key.length - 7).toLocaleLowerCase());

            ___response_write(req, res, { ok: false, message: 'APIs must be:' + a.join(',') });
            return;
        }

        const key = api_name.toLocaleUpperCase();

        //console.log('GROUP_BY: ', key, group_col);

        let total_items = ___cache[key].length;

        let a = [];
        if (total_items > 0) {
            const ag1 = _.groupBy(___cache[key], function (o) { return o[group_col]; });
            //console.log('1111=', JSON.stringify(ag1));
            a = _.map(ag1, function (vals, name) { return { key: name, item: vals[0], counter: vals.length }; });
            //console.log('22222222=', JSON.stringify(a));
        }

        const m = ___response_ok(null, a, total_items, page_number, page_size);
        ___response_write(req, res, m);

    } catch (err_throw) {
        ___log_err_throw('/api/groupby/:api_name/:group_col/:page_number/:page_size', err_throw, req.path);
    }
});

//--------------------------------------------------------------------------

_HTTP_APP.get('/users/state', function (req, res) { res.json(___users_online); });

_HTTP_SERVER.listen(___PORT_API);

const ___users_online = {};
const ___users_socketio = {};

const USER_ON_OFF = {};
const USER_ON_OFF_TIMMER = {};

_IO.on('connection', client => {
    let user_id;
    let status;

    if (client.handshake && client.handshake.query && client.handshake.query.user_id) {
        user_id = client.handshake.query.user_id;
        status = client.handshake.query.status;

      //  console.log('socket user_id = ', user_id, status);

         client.on('push', data => {
          //  console.log('socket connectting ..... before diss = ', USER_ON_OFF[user_id]);
            USER_ON_OFF[user_id] = 1;
        });

        client.on('disconnect', (data) => {
           // console.log('USER -> disconnect = ', user_id);

            if (USER_ON_OFF[user_id] == 1) {
              //  console.log('USER -> online -> disconnect -> timmer re-connect ? = ', user_id);
                // Connecting before that -> timeout will checked disconnect after 15s
                USER_ON_OFF_TIMMER[user_id] = setTimeout(function (uid) {

                    if (USER_ON_OFF[uid] == 1) {
                       // console.log('USER -> online -> disconnect -> timmer re-connect ? = ', user_id, ' -> F555555 ');
                    } else if (USER_ON_OFF[uid] == 0) {
                        USER_ON_OFF[uid] = null;
                      //  console.log('USER -> online -> disconnect -> timmer re-connect ? = ', user_id, ' -> Close browser (event DB)');


                        db___execute_callback(null, null, 'mobile.user_biz_update_user', {
                            user_id: user_id,
                            int_type: 1,
                            int_pol_status: 0,
                            int_pol_region: 0,
                            int_user_create: user_id
                        }, function (m_) {
                        }, function (m_) {
                        });
                    }

                    clearTimeout(USER_ON_OFF_TIMMER[uid]);

                }, 5000, user_id);
            }

            USER_ON_OFF[user_id] = 0;
        });

        if (USER_ON_OFF[user_id] == null) {
           // console.log('USER -> First access = (event DB) ', user_id);
            //First access
            USER_ON_OFF[user_id] = 1;

            if (___CACHE_DONE == false) return;

            try {
                db___execute_callback(null, null, 'mobile.user_biz_update_user', {
                    user_id: user_id,
                    int_type: 1,
                    int_pol_status: status,
                    int_pol_region: 0,
                    int_user_create: user_id
                }, function (m_) {
                }, function (m_) {
                });

            } catch (err_throw) {
                ___log_err_throw('SOCKET_IO ON_PUSH', err_throw, user_id, data);
            }

        } else if (USER_ON_OFF[user_id] == 0) {
           // console.log('USER -> new connect = ', user_id);
            USER_ON_OFF[user_id] = 1;
        }

    } else {
        client.disconnect(true);
    }
});



//#endregion

//#region [ JOB J1: SHARED PAWNS FOR CALLER ONLINE ]

//-------------------------------------------- start chia don
let J1_EXECUTING = false;
let J1_COUNTER_RESET = 5;//Khoảng thời gian ngắt sau mỗi lần chia đơn
let J1_COUNTER = 0;
var J1_SIZE = 0;
let J1_TIME_CHECK = '0 */1 * * * *'; // 1 minu

let J1_CONFIG = {
    '1': [3, 2],   // don, phut
    '2': [6, 2],   // don, phut
    '3': [6, 2],  // don, phut
    '4': [2, 2]    // don, phut
};

// 619- Nguyễn Hải Yến - yennh
// 707- Phạm Ngọc Ánh - anhpn
// 927- Nguyễn Thị Nhung - nhungnt
// 1508- Võ Thị Đài Trang - trangvtd
// 1208- Cao Thị Trang - trangct
// 1207- Nguyễn Thị Mỹ Tâm - tamntm
// 1206- Lê Vũ Thúy Uyên - uyenlvt
// 1786- Nguyễn Thị Phương Huyền - huyenntp
// 1809- Nguyễn Minh Thư - thunm


// ',619,707,927,1508,1208,1207,1206,1786,1809,';

let J_CONFIG_ACCOUNT = {
    "id": ",619,707,927,1508,1208,1207,1206,1786,1809,"
};
console.log('config ', J_CONFIG_ACCOUNT);




//#region [ JOB CHIA DON MOI ]

new _JOB(J1_TIME_CHECK, function () {
    // console.log(new Date().toLocaleString());
    try {
        if (!___CACHE_DONE) return;
        if (J1_EXECUTING) return;
        //------------------------------------------------------------------------------------

        const d_ = new Date(), m_ = d_.getMinutes(), h_ = d_.getHours();
        var now = parseInt(d_.getHours() + (m_ < 10 ? '0' : '') + m_ + '00');


        //    console.log('now ==', now);

        if (now >= 83000 && now < 103000) //lấy 120 đơn để chia
        {
            J1_SIZE = J1_CONFIG['1'][0];
            J1_COUNTER_RESET = J1_CONFIG['1'][1];

        }
        else if (now >= 103000 && now < 133000) //lấy 180 đơn để chia
        {
            J1_SIZE = J1_CONFIG['2'][0];
            J1_COUNTER_RESET = J1_CONFIG['2'][1];

        }
        else if (now >= 133000 && now < 173000) //lấy 480 đơn để chia
        {
            J1_SIZE = J1_CONFIG['3'][0];
            J1_COUNTER_RESET = J1_CONFIG['3'][1];

        }
        else if (now >= 173000 && now < 193000) //lấy 80 đơn để chia
        {
            J1_SIZE = J1_CONFIG['4'][0];
            J1_COUNTER_RESET = J1_CONFIG['4'][1];
        }
        else {
            return;
        }

        if (J1_COUNTER == 0) {
            //------------------------------------------------------------------------------------
            J1_EXECUTING = true;

            const call_chiadon = 696;  // id tai khoan call_chiadon
            const app_kh = 1535;  // id tai khoan app_kh
            const hangdt = 694;

            let rs = [], _users = [], _pawns = [];
            const lsg = _.groupBy(___cache['USER'], function (o) { return o.id; });
            const grs = _.map(lsg, function (vals_) { return vals_[0]; });

            //_users = _.filter(grs, function (o) { return o.group_id == 44 && o.int_pol_status == 1 && (o.id != 617 && o.id != call_chiadon && o.id != app_kh && o.id != hangdt); });

            _users = _.filter(grs, function (o) { return o.group_id == 44 && o.int_pol_status == 1 && J_CONFIG_ACCOUNT.id.indexOf("," + o.id + ",") != -1; });
            //danh sach call user bo tk chintn va call_chiadon,app_kh
            //     console.log(_users);
            if (_users.length > 0) {   // neu co nhan vien online
                _pawns = _.filter(___cache['POL_PAWN'], function (o) { return o.group_id == 44 && o.int_status == 1 && ((o.int_queued != -1) || (o.int_queued == -1 && o.caller_online_id == call_chiadon)); });
                //lấy các đơn chưa chia tại call o.int_queued != -1 va status = 1 hoặc các đơn dc chia cho tk call_chiadon và trạng thái khác 0: huy,4:nhận cầm cố

                let _d_bac = 0, _d_nam = 0, _d_other = 0;

                if (_pawns.length > 0) {

                    let us_sort = [], us = [], ps = [], k = 0, p1 = [], p2 = [], min = 0, max = 0;
                    let _lst_pawn_sort = [];

                    // CHIA NHÓM USER: BẮC = (BẮC + OTHER <> 0,-1 ) VÀ NAM (1)
                    const _users_bac = _.filter(_users, function (o) { return o.int_pol_region != 1 }); // hiện tại để mặc định user tất cả(-1 sẽ ở cả miền bắc)
                    const _users_nam = _.filter(_users, function (o) { return o.int_pol_region == 1; });


                    // Lấy về các đơn đã chia cho call và đang chờ tư vấn
                    const _sort_pawns_users = _.filter(___cache['POL_PAWN'], function (o) { return o.int_queued == -1 && o.group_id == 44 && o.caller_online_id > 0 && o.int_status == 1; });

                    const _group_pawns_users = _.groupBy(_sort_pawns_users, function (o) { return o.caller_online_id; });

                    let _group_users = _.map(_group_pawns_users, function (vals_, key_name) { return { user_id: Number(key_name), counter: vals_.length }; });

                    _group_users = _.sortBy(_group_users, function (o) { return o.counter; });

                    _lst_pawn_sort = _.sortBy(_pawns, function (o) { return o.id; });

                    if (_lst_pawn_sort.length > 0) {


                        //#region [ tinh toan so don dc chia tai moi mien ]


                        for (var i = 0; i < Number(J1_SIZE); i++) {
                            if (_d_bac < _d_nam) {
                                _d_bac++;
                            } else if (_d_nam < _d_bac) {
                                _d_nam++;
                            } else {
                                _d_bac++;
                            }
                        }
                        if (_users_bac.length == 0) {
                            _d_nam = Number(J1_SIZE);
                            _d_bac = 0;
                        }
                        if (_users_nam.length == 0) {
                            _d_bac = Number(J1_SIZE);
                            _d_nam = 0;
                        }

                        //#endregion

                        let _scope = '';

                        //--------------------------------------------------------------------------------

                        _scope = 'BAC';
                        us = _users_bac;

                        if (us.length > 0) { // nếu có user online thì chia cho user

                            // nếu có user thì load cả all đơn bao gồm đơn dc chia cho call_chiadon và đơn mới

                            if (_lst_pawn_sort.length > 0 && _lst_pawn_sort.length > _d_bac) {
                                ps = _.filter(_lst_pawn_sort, function (o, ix) { return ix >= 0 && ix < _d_bac; });
                            } else {
                                ps = _lst_pawn_sort;
                            }


                            if (ps.length > 0) {
                                //---------------------------------------------
                                //clone + sort
                                us_sort = JSON.parse(JSON.stringify(us));
                                us_sort.forEach(u1 => {
                                    const u3 = _.find(_group_users, function (u2) { return u2.user_id == u1.id; });
                                    if (u3) u1.counter = u3.counter;
                                    else u1.counter = 0;
                                });
                                us_sort = _.sortBy(us_sort, function (o) { return o.counter; });
                                us = us_sort;

                                //--------------------------------------------

                                for (i = 0; i < ps.length; i++) {

                                    us_sort = _.sortBy(us_sort, function (o) { return o.counter; });
                                    us = us_sort;
                                    rs.push({ u: us[0].id, p: ps[i].id });
                                    us[0].counter += 1;

                                    _lst_pawn_sort = _.reject(_lst_pawn_sort, function (el) { return el.id === ps[i].id; });

                                }
                            }

                        }
                        //--------------------------------------------------------------------------------

                        _scope = 'NAM';
                        us = _users_nam;

                        if (us.length > 0) { // nếu có user online thì chia cho user

                            // nếu có user thì load cả all đơn bao gồm đơn dc chia cho call_chiadon và đơn mới
                            if (_lst_pawn_sort.length > 0 && _lst_pawn_sort.length > _d_nam) {
                                ps = _.filter(_lst_pawn_sort, function (o, ix) { return ix >= 0 && ix < _d_nam; });
                            } else {
                                ps = _lst_pawn_sort;
                            }

                            if (ps.length > 0) {
                                //---------------------------------------------
                                //clone + sort
                                us_sort = JSON.parse(JSON.stringify(us));
                                us_sort.forEach(u1 => {
                                    const u3 = _.find(_group_users, function (u2) { return u2.user_id == u1.id; });
                                    if (u3) u1.counter = u3.counter;
                                    else u1.counter = 0;
                                });
                                us_sort = _.sortBy(us_sort, function (o) { return o.counter; });
                                us = us_sort;

                                //--------------------------------------------

                                for (i = 0; i < ps.length; i++) {

                                    us_sort = _.sortBy(us_sort, function (o) { return o.counter; });
                                    us = us_sort;
                                    rs.push({ u: us[0].id, p: ps[i].id });
                                    us[0].counter += 1;

                                    _lst_pawn_sort = _.reject(_lst_pawn_sort, function (el) { return el.id === ps[i].id; });
                                }
                            }
                        }
                        //--------------------------------------------------------------------------------
                    }

                } //end shared
            }

            else {   // khong co nhan vien online thi chia cho tk call_chiadon

                _pawns = _.filter(___cache['POL_PAWN'], function (o) { return o.group_id == 44 && o.int_queued != -1 && o.int_status == 1; }); //Get all pawns do not share for call online and shops

                if (_pawns.length > 0) {
                    //--------------------------------------------------------------------------------

                    //#region [ chia don call_online moi ]

                    let ps = [];

                    _lst_pawn_sort = _.sortBy(_pawns, function (o) { return o.id; });


                    if (_lst_pawn_sort.length > 0 && _lst_pawn_sort.length > J1_SIZE) {
                        ps = _.filter(_lst_pawn_sort, function (o, ix) { return ix >= 0 && ix < J1_SIZE; });
                    }
                    else {
                        ps = _lst_pawn_sort;
                    }
                    if (ps.length > 0) {
                        for (i = 0; i < ps.length; i++) {
                            rs.push({ u: call_chiadon, p: ps[i].id });
                            _lst_pawn_sort = _.reject(_lst_pawn_sort, function (el) { return el.id === ps[i].id; });
                        }
                    }
                    //#endregion

                } //end shared
            }

            if (rs.length > 0) {

                db___execute_callback(null, null, 'mobile.pol_pawn_biz_job_SET_PAWNS_FOR_CALLER_ONLINE', { ups: JSON.stringify(rs) },
                    function (r_, m_) {
                        J1_EXECUTING = false;
                        rs = [];
                    },
                    function (r_, m_) {
                        J1_EXECUTING = false;
                        rs = [];
                    }
                );
            }
            else {
                J1_EXECUTING = false;
                J1_COUNTER = J1_COUNTER_RESET;
            }
        }

        if (J1_COUNTER >= J1_COUNTER_RESET) J1_COUNTER = 0;
        else J1_COUNTER++;
    } catch (err_throw) {
        ___log_err_throw('JOB_RUN: J1_TIME_CHECK', err_throw);
    }
}).start();

//#endregion

// ----------------------------------------------end chia don

// start send sms ------------------------------------------------------
let TIME_JOB_SMS = '0 */1 * * * *'; // 1 minu
var SIZE_SEND = 1;
let SMS_EXECUTING = false;
let SMS_COUNTER_RESET = 2;//Khoảng thời gian ngắt sau mỗi lần gửi
let SMS_COUNTER = 0;

//TIME_JOB_SMS = '* * * * * *';

new _JOB(TIME_JOB_SMS, function () {
    // console.log('job=',new Date().toLocaleString());
    try {
        if (!___CACHE_DONE) return;
        if (SMS_EXECUTING) return;
        const { execFile } = require('child_process');

        if (SMS_COUNTER == 0) {

            SMS_EXECUTING = true;
            //console.log('gogogogog');

            let _sys_sms = [], _sys_sms_sort = [], lst = [];
            _sys_sms = _.filter(___cache['POL_SYS_SMS'], function (o) { return o.int_status == 0; });  // lấy các tin chưa gửi 

            if (_sys_sms && _sys_sms.length > 0) {
                _sys_sms_sort = _.sortBy(_sys_sms, function (o) { return o.id; });
                _sys_sms_sort = _sys_sms_sort.reverse();

                lst = _.filter(_sys_sms_sort, function (o, ix) { return ix >= 0 && ix < SIZE_SEND; });  // gửi 10 tin nhăn 1 lần

                var count_setting = 0;

                for (i = 0; i < lst.length; i++) {

                    let _phone = lst[i].str_phones;
                    let _message = lst[i].str_message;
                    let _id = lst[i].id;

                    count_setting++;

                    db___execute_callback(null, null, 'mobile.pol_sys_sms_update_send', { id: _id, int_status: 1 },
                        function (r_, m_) {
                            if (m_.ok) {
                                const child = execFile('SendSMS.exe', [_phone, _message, _id], (error, stdout, stderr) => {
                                    if (error) {
                                        //  throw error;
                                        console.log("error send sms !!");
                                    }
                                    SMS_EXECUTING = false;
                                });
                            }
                        },
                        function (r_, m_) {
                            SMS_EXECUTING = false;
                            console.log('error send sms', r_);
                        }
                    );
                }

                if (count_setting == lst.length) {
                    SMS_EXECUTING = false;
                    SMS_COUNTER = SMS_COUNTER_RESET;
                }

            } else {
                SMS_EXECUTING = false;
                SMS_COUNTER = SMS_COUNTER_RESET;
            }
        }

        if (SMS_COUNTER >= SMS_COUNTER_RESET) SMS_COUNTER = 0;
        else SMS_COUNTER++;
    } catch (err_throw) {
        ___log_err_throw('JOB_RUN: TIME_JOB_SMS', err_throw);
    }
}).start();

// end send sms


// start send email ------------------------------------------------------
let TIME_JOB_EMAIL = '0 */1 * * * *'; // 1 minu
var SIZE_SEND_EMAIL = 2;
let EMAIL_EXECUTING = false;
let EMAIL_COUNTER_RESET = 2;//Khoảng thời gian ngắt sau mỗi lần gửi
let EMAIL_COUNTER = 0;

//TIME_JOB_EMAIL = '* * * * * *'; 

new _JOB(TIME_JOB_EMAIL, function () {
    try {
        if (!___CACHE_DONE) return;
        if (EMAIL_EXECUTING) return;
        const { execFile } = require('child_process');

        if (EMAIL_COUNTER == 0) {

            EMAIL_EXECUTING = true;
            // console.log('gogogogog EMAIL');

            let _sys_email = [], _sys_email_sort = [], lst = [];
            _sys_email = _.filter(___cache['POL_SYS_EMAIL'], function (o) { return o.int_status == 0; });  // lấy các tin chưa gửi 

            if (_sys_email && _sys_email.length > 0) {
                _sys_email_sort = _.sortBy(_sys_email, function (o) { return o.id; });
                _sys_email_sort = _sys_email_sort.reverse();

                lst = _.filter(_sys_email_sort, function (o, ix) { return ix >= 0 && ix < SIZE_SEND_EMAIL; });  // gửi 10 tin nhăn 1 lần

                var count_setting = 0;

                for (i = 0; i < lst.length; i++) {

                    let _email = lst[i].str_emails;
                    let _message = lst[i].str_message;
                    let _id = lst[i].id;
                    let _id_pawn = lst[i].ref_ids;
                    count_setting++;

                    db___execute_callback(null, null, 'mobile.POL_SYS_EMAIL_UPDATE_SEND', { id: _id, int_status: 1 },
                        function (r_, m_) {
                            if (m_.ok) {
                                const child = execFile('SendEmail.exe', [_email, _message, _id, _id_pawn], (error, stdout, stderr) => {
                                    if (error) {
                                        // throw error;
                                        console.log("error send email !!");
                                    }

                                });
                            }
                        },
                        function (r_, m_) {
                            // EMAIL_EXECUTING = false;
                            console.log('error send emaillllll', r_);
                        }
                    );
                }
                if (count_setting == lst.length) {
                    EMAIL_EXECUTING = false;
                    EMAIL_COUNTER = EMAIL_COUNTER_RESET;
                }

            } else {
                EMAIL_EXECUTING = false;
                EMAIL_COUNTER = EMAIL_COUNTER_RESET;
            }
        }

        if (EMAIL_COUNTER >= EMAIL_COUNTER_RESET) EMAIL_COUNTER = 0;
        else EMAIL_COUNTER++;
    } catch (err_throw) {
        ___log_err_throw('JOB_RUN: TIME_JOB_EMAIL', err_throw);
    }
}).start();
// end send email

//#endregion

//#region [ THREAD ]

const _threads = [];
let _thread_blob_size = require('os').cpus().length;
let _thread_record_total = 0;
let _thread_page_total = 0;

let _threads_queues = [];
let _threads_counter = 0;
let _threads_max = 0;

const ___thread_cacheIndexs_CompleteAll = () => {
    ___log('-> CACHE INDEXS OK ...' + new Date().toLocaleString());
    console.log('-> CACHE INDEXS OK ...' + new Date().toLocaleString());
    ___CACHE_DONE = true;
    console.log('\n' + new Date().toLocaleString() + '\n');
};

const ___thread_initOnMain = () => {
    try {
        console.log('\nIndexing ...' + new Date().toLocaleString());

        _thread_record_total = ___cache[_CACHE_NAME_MAIN].length;
        _thread_page_total = Number((_thread_record_total / _thread_page_size).toString().split('.')[0]);
        if (_thread_record_total % _thread_page_size != 0) _thread_page_total++;

        _thread_blob_total = Number((_thread_page_total / _thread_blob_size).toString().split('.')[0]);
        if (_thread_page_total % _thread_blob_size != 0) _thread_blob_total++;

        ___log('\n-> blob_total = ' + _thread_blob_total + '; blob_size = ' + _thread_blob_size + '; page_total = ' + _thread_page_total + '; page_size = ' + _thread_page_size);

        let min = 0, max = 0;
        for (let b = 0; b < _thread_blob_total; b++) {
            for (let p = _thread_blob_size * b; p < _thread_blob_size * (b + 1); p++) {
                min = _thread_page_size * p;
                max = _thread_page_size * (p + 1);
                if (max > _thread_record_total) max = _thread_record_total;

                if (p >= _thread_page_total) break;
                //___log('\nB_' + b + '_P_' + p+ ': start = ' + min + '; end = ' + max);
                _threads_queues.push({ blob_index: b, page_index: p, min: min, max: max });
            }
        }

        //___log(_threads_queues);
        ___thread_start();
    } catch (err_throw) {
        ___log_err_throw('___thread_initOnMain', err_throw);
    }
};

const ___thread_start = () => {
    try {
        if (_threads_queues.length > 0) {
            _threads_counter = 0;

            const a = _.filter(_threads_queues, function (x, i_) { return i_ < _thread_blob_size; });
            _threads_queues = _.filter(_threads_queues, function (x, i_) { return i_ >= _thread_blob_size; });
            _threads_max = a.length;

            a.forEach((it_) => {
                //___log(it_);

                const worker = new Worker('./index.js', { workerData: it_ });
                worker.on('message', (message) => { ___thread_onMessage_cacheObject(message); });
                const cacheChannel = new MessageChannel();
                worker.postMessage({ cache_port: cacheChannel.port1 }, [cacheChannel.port1]);
                cacheChannel.port2.on('message', (m_) => { ___thread_cacheRequest(m_); });
                _threads.push({ worker: worker, cache_channel: cacheChannel });
            });
        } else {
            ___thread_cacheIndexs_CompleteAll();
        }
    } catch (err_throw) {
        ___log_err_throw('___thread_start', err_throw);
    }
};

const ___thread_onMessage_cacheObject = (p) => {
    try {
        if (Number.isInteger(p.___customer)) p.___customer = ___cache['POL_CUSTOMER'][p.___customer];
        if (Number.isInteger(p.___caller_shop)) p.___caller_shop = ___cache['USER'][p.___caller_shop];
        if (Number.isInteger(p.___caller_online)) p.___caller_online = ___cache['USER'][p.___caller_online];
        if (Number.isInteger(p.___group)) p.___group = ___cache['GROUP'][p.___group];

        //p.___list_support_schedule = _.filter(___cache['POL_SUPPORT_SCHEDULE'], function (x) { return x.int_pawn_online_id == p.id; });
        //p.___list_online_process = _.filter(___cache['POL_PROCESS'], function (x) { return x.int_pol_pawn_id == p.id; });

        p.___list_support_schedule = _.map(___list_support_schedule[p.id], function (x) { return ___cache['POL_SUPPORT_SCHEDULE'][x]; });
        p.___list_online_process = _.map(___list_online_process[p.id], function (x) { return ___cache['POL_PROCESS'][x]; });

        ___cache[_CACHE_NAME_MAIN][p.ix___] = p;

        //if (___list_online_process[p.id] && ___list_online_process[p.id].length > 0) ___log(p.id);
    } catch (err_throw) {
        ___log_err_throw('___thread_onMessage_cacheObject', err_throw);
    }
};

const ___thread_cacheRequest = (m) => {
    try {
        if (m && m.command) {
            m.ok = false;
            const t = _threads[m.page_index];
            if (t) {
                let indexs = m.indexs, datas = [], a = [];
                switch (m.command) {
                    case 'M1_GET_PAWN_BY_MIN_MAX':
                        const min = m.min;
                        const max = m.max;
                        a = _.filter(___cache[_CACHE_NAME_MAIN], function (o, index_) { return index_ >= min && index_ < max; });
                        //___log('\nM1_' + m.page_index + ': min = ' + min + '; max = ' + max + '; pawns = ' + a.length);
                        m.data = a;
                        m.ok = true;
                        t.worker.postMessage(m);
                        break;
                    case 'M2_GET_INDEX11_DATA':
                        //___log('M2: ' + JSON.stringify(indexs));
                        for (const col in indexs) {
                            const cache_name = indexs[col][0];
                            const ids = indexs[col][1];
                            a = _.map(ids, function (id_) {
                                if (id_ == -1) return null;
                                let it = ___cache[cache_name][___index[cache_name][id_]];
                                if (it) return it;
                                it = _.find(___cache[cache_name], function (o_) { return o_.id == id_; });
                                if (it) return it;
                                return null;
                            });
                            //___log(cache_name, a);
                            indexs[col].push(a);
                        }
                        m.ok = true;
                        t.worker.postMessage(m);
                        break;
                    case 'M3_OK':
                        const blob_index = m.blob_index;
                        const page_index = m.page_index;
                        //  ___log(page_index);

                        _threads[page_index].cache_channel.port1.close();
                        _threads[page_index].cache_channel.port2.close();
                        _threads[page_index].worker.terminate();

                        _threads_counter++;
                        if (_threads_counter == _threads_max) {
                            // ___log('->' + blob_index + '\n\n');
                            ___thread_start();
                        }
                        break;
                }
            }
        }
    } catch (err_throw) {
        ___log_err_throw('___thread_cacheRequest', err_throw);
    }
};

//#endregion


