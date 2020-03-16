const { inspect } = require('util');
const FS = require('fs');
const _ = require('lodash');
const URL = require('url');

const ___SCOPE = 'MAIN';
const ___CLEAN_LOG = true;
const API = { page_size: 15, config: null, busy: false, message: '', busy_func: {}, cache: {} };

const im_config = require('./im_config.js');
const im_http = require('./im_http.js');
const HTTP_PORT = 12345;

//#region [ LOG ]

let ___log = (...agrs) => console.log(...agrs);
let ___log_key = (key, ...agrs) => console.log(key, ...agrs);
let ___log_err_throw = (func_name, err_throw, para1, para2, para3) => console.log('ERR_THROW', func_name, err_throw, para1, para2, para3);
const LOG = require('./im_log.js');
LOG.start(0, ___SCOPE, () => {
    if (___CLEAN_LOG) LOG.delete_all();
    ___log = (...agrs) => LOG.write(...agrs);
    ___log_key = (key, ...agrs) => LOG.write_key(key, ...agrs);
    ___log_err_throw = (func_name, err_throw, para1, para2, para3) => LOG.write(___SCOPE + '.ERR_THROW', func_name, err_throw, para1, para2, para3);

    API.___log = ___log;
    API.___log_key = ___log_key;
    API.___log_err_throw = ___log_err_throw;

    console.log('LOG ready ...');
    app___start();
});

//#endregion

//#region [ API ]

const api___init_file = (file) => {
    if (file) {
        const f = file.toLowerCase();
        if (f.endsWith('.js')) {
            const s = FS.readFileSync('./api/' + file, 'utf-8').trim();
            if (s.startsWith('function') && s.endsWith('}')) {
                let pos = s.indexOf('{');
                let js;
                if (pos > 0) {
                    pos++;
                    js = s.substr(pos, s.length - pos - 1).trim();
                    try {
                        let fc;
                        let api_name = f.substr(0, f.length - 3).trim();

                        if (f.startsWith('___')) {
                            fc = new Function('api', 'obj', js);
                            fc(API, null);
                        } else if (f.startsWith('http___')) {
                            fc = new Function('api', 'req', 'res', 'config', 'body', js);
                            fc(API, null, null, null, null);
                        } else if (f.startsWith('api___')) {
                            fc = new Function('api', 'req', 'res', 'config', 'body', js);
                            fc(API, null, null, null, null);
                            api_name = api_name.substr(6);
                        } else if (f.startsWith('valid___')) {
                            fc = new Function('api', 'col', 'obj', 'val', js);
                            fc(API, null, null, null);
                        } else {
                            fc = new Function('api', 'obj', js);
                            fc(API, null);
                        }
                        console.log('-> API: ' + api_name + ' done');

                        if (fc) API[api_name] = fc;

                        return fc;
                    } catch (efc) {
                        console.log('\n-> ERR: ', file, efc.message, '\n');
                    }
                }
            }
        }
    }

    return null;
};

const api___load_dir = (callback) => {
    if (FS.existsSync('./api/')) {
        FS.readdir('./api/', (e1_, files_) => {
            if (e1_) {
                console.log('API_INSTALL: ', e1_);
                callback();
            } else {
                files_.forEach(file => {
                    api___init_file(file);
                });
                console.log('\n----> API: complete ...\n');
                callback();
            }
        });
    }
    callback();
};

const api___reset_all = (callback) => {
    API.busy = true;
    api___load_dir(() => {
        API.busy = false;
        callback();
    });
};

//#endregion

//#region [ APP START, INIT CACHE ]

const CACHE = require('./im_cache.js');

const app___init_cache = (configs, callback) => {

    if (configs.length == 0) return callback();

    let k = configs.length;
    for (var i = 0; i < configs.length; i++) {
        const cf = configs[i];
        const cache = new CACHE(cf);
        cache.start((_cache) => {
            k--;
            API.cache[_cache.config.name] = _cache;
            if (_cache) _cache.API = API;
            console.log(_cache.config.name + ' = ', _cache != null);
            if (k == 0) {
                console.log('-> CACHE_START OK ...');
                callback();
            }
        });
    }
};

const app___start = () => {
    const LOG_KEY = 'START';

    const p1 = new Promise(function (resolve, reject) {
        im_config.get().then(cfs => {
            API.config = cfs;
            console.log('Load config done ...');
            ___log_key(LOG_KEY, 'load config', cfs);
            resolve({ ok: true, data: cfs });
        });
    });

    const p2 = new Promise(function (resolve, reject) {
        api___reset_all(() => {
            console.log('Load API done ...');
            ___log_key(LOG_KEY, 'API', Object.keys(API));
            resolve({ ok: true });
        });
    });

    const p3 = new Promise(function (resolve, reject) {
        im_http.API = API;
        im_http.start({ port: HTTP_PORT }, () => {
            console.log('\n----> HTTP ' + HTTP_PORT + ' ready...');
            ___log_key(LOG_KEY, 'start HTTP_PORT = ' + HTTP_PORT);
            resolve({ ok: true });
        });
    });

    Promise.all([p1, p2, p3]).then(rs => {
        const ok = rs.length == 3 && rs[0].ok && rs[1].ok && rs[2].ok;
        app___init_cache(rs[0].data, () => {
            app___start_callback(ok);
        });
    });
};

const app___start_callback = (ok) => {
    const LOG_KEY = 'START';
    if (!ok) return;
    console.log('-> APP_START = ', ok);
    ___log_key(LOG_KEY, 'start success = ' + ok);
};

const app___cache_reset = (cache_name, callback) => {

};
const app___cache_reset_all = (callback) => {
    API.busy = true;
    API.message = 'All cache reseting';

    for (var c in API.cache) API.cache[c].destroy();

    im_config.get().then(cfs => {
        API.config = cfs;
        console.log('Load config done ...');
        ___log_key(LOG_KEY, 'load config', cfs);
        resolve({ ok: true, data: cfs });
    });
};

//#endregion

//#region [ READLINE ]

const READ_LINE = require("readline");
const RL = READ_LINE.createInterface({ input: process.stdin, output: process.stdout });
RL.on("line", function (line) {
    let text = line.trim();
    const has_pushLog = text.endsWith('?log');
    if (has_pushLog) text = text.substr(0, text.length - 4).trim();
    const a = text.split(' ');
    let cmd = a[0].toLowerCase();
    switch (cmd) {
        case 'exit':
            process.exit();
            break;
        case '-help':
        case '--help':
            console.clear();
            const helps = [
                '- ?log = push to redis log at port 11111 on key MAIN.???',

                '- cls|clear|clean = Clean terminal console.log',

                '- config = Display config',

                '- api.key = Display keys of object API',
                '- api.reload (|file_api.js) = Reload all script | reload only a file_api.js',

                '- cache.reload = Reset cache engine (all | by cache_name)',
                '- cache.key = Display keys of Cache Engine',
                '- cache.load_db KEY = Load DB into cache engin by KEY',
                '- cache.load_redis = Load Redis into cache engin by KEY',
            ];
            console.log('Help input command:\n\t', helps.join('\n\t'));
            break;
        case 'cls':
        case 'clear':
            console.clear();
            break;
        case 'config':
            console.clear();
            if (has_pushLog)
                ___log_key(cmd, API.config);
            else
                console.log(inspect(API.config));
            break;
        case 'api.keys':
            console.clear();
            if (has_pushLog)
                ___log_key(cmd, _.sortBy(Object.keys(API)));
            else
                console.log(_.sortBy(Object.keys(API)));
            break;
        case 'api.reload':
            console.clear();
            if (a.length > 1) {
                const file = a[1].toLowerCase();
                API.busy_func[file] = true;
                api___init_file(file);
                API.busy_func[file] = false;
            } else {
                api___reset_all(() => {
                    console.log('RESET ALL API done ...');
                });
            }
            break;
        case 'cache.reload':
            console.clear();
            if (a.length > 1) {
                const cache_name = a[1].trim().toUpperCase();
                app___cache_reset(cache_name, () => {
                    console.log('Cache ' + cache_name + ' reset -> done ...');
                });
            } else {
                app___cache_reset_all(() => {
                    console.log('All Cache reset -> done ...');
                    console.log(Object.keys(API.cache));
                });
            }
            break;
        case 'cache.key':
            console.clear();
            if (has_pushLog)
                ___log_key(cmd, _.sortBy(Object.keys(API.cache)));
            else
                console.log(_.sortBy(Object.keys(API.cache)));
            break;
        case 'cache.sync_db':
            console.clear();
            if (a.length > 1 && API.cache[a[1].toUpperCase()]) {
                const cache = API.cache[a[1].toUpperCase()];
                cache.sync_db(m => {
                    console.log(m);
                });
            }
            break;
        case 'cache.sync_redis':
            console.clear();
            if (a.length > 1 && API.cache[a[1].toUpperCase()]) {
                const cache = API.cache[a[1].toUpperCase()];
                cache.sync_redis(m => {
                    console.log(m);
                });
            }
            break;
        case 'cache.config':
            console.clear();
            if (a.length > 1 && API.cache[a[1].toUpperCase()]) {
                const cache = API.cache[a[1].toUpperCase()];
                console.log(cache.get_config);
            }
            break;
        case 'bgsave':
            console.clear();
            API['USER'].send_command('BGSAVE', function (err, reply) {
                console.log(err);
                console.log(reply);
            });
            break;
        default:
            API.cache['USER'].sync_db(r1 => {
                console.log(r1);
                if (r1.ok) {
                    API.cache['USER'].sync_redis(r2 => {
                        console.log(r2);
                    });
                }
            });

            //console.log('\n', API['PAWN'].valid_add({
            //    //id: 123,
            //    //int_status: 1,
            //    //int_status: '1',
            //    //int_cancel_time: null,
            //    //int_cancel_time: 'asdasd',
            //    int_cancel_time: 'hhmmss',
            //    //int_cancel_time: 123,
            //    //col_wrong: 9999,

            //    int_days: 30,
            //    lng_money: 1000000,
            //    asset_type_id: 1,
            //    city_id: 1,
            //    district_id: 1
            //}));


            //if (a.length > 1 && API[cmd] && API[cmd][a[1]]) {
            //    switch (a[1]) {
            //        case 'load_db':
            //        case 'delete_all':
            //        case 'index':
            //            API[cmd][a[1]](res => {
            //                console.log('RESULT: ' + cmd + '.' + a[1] + ' = ', res);
            //            });
            //            break;
            //    }
            //}
            break;
    }
});

//#endregion
