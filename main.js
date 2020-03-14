const FS = require('fs');
const _ = require('lodash');

const ___SCOPE = 'MAIN';
const ___CLEAN_LOG = true;
const API = { id___: 100, config: null, busy: false };

const im_config = require('./im_config.js');
const im_http = require('./im_http.js');
const HTTP_PORT = 20000;

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
                        if (f.startsWith('___')) {
                            fc = new Function('api', 'obj', js);
                            fc(API, null);
                        } else if (f.startsWith('http___')) {
                            fc = new Function('api', 'req', 'res', js);
                            fc(API, null, null);
                        } else if (f.startsWith('valid___')) {
                            fc = new Function('api', 'col', 'obj', 'val', js);
                            fc(API, null, null, null);
                        } else {
                            fc = new Function('api', 'obj', js);
                            fc(API, null);
                        }
                        console.log('-> API: ', file, ' done');

                        if (fc)
                            API[f.substr(0, f.length - 3).trim()] = fc;

                        return fc;
                    } catch (efc) {
                        console.log('\n API: ', file, efc);
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

//#region [ APP START ]

const app___start = () => {
    const LOG_KEY = 'START';

    const p1 = new Promise(function (resolve, reject) {
        api___reset_all(() => {
            console.log('Load API done ...');
            ___log_key(LOG_KEY, 'API', Object.keys(API));
            resolve({ ok: true });
        });
    });

    const p2 = new Promise(function (resolve, reject) {
        im_config.get().then(cfs => {
            API.config = cfs;
            console.log('Load config done ...');
            ___log_key(LOG_KEY, 'load config', cfs);
            resolve({ ok: true, data: cfs });
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
        app___start_callback(ok);
    });
};

const app___start_callback = (ok) => {
    const LOG_KEY = 'START';
    if (!ok) return;
    console.log('START = ', ok);
    ___log_key(LOG_KEY, 'start success = ' + ok);

};

//#endregion

//#region [ READLINE ]

const READ_LINE = require("readline");
const RL = READ_LINE.createInterface({ input: process.stdin, output: process.stdout });
RL.on("line", function (text) {
    const a = text.split(' ');
    let cmd = a[0].toLowerCase();
    switch (cmd) {
        case 'exit':
            process.exit();
            break;
        case 'cls':
            console.clear();
            break;
        case 'api.keys':
            console.clear();
            console.log(_.sortBy(Object.keys(API)));
            break;
        case 'bgsave':
            console.clear();
            API['USER'].send_command('BGSAVE', function (err, reply) {
                console.log(err);
                console.log(reply);
            });
            break;
        case 'reload':
            console.clear();
            if (a.length > 1) {
                const file = a[1].toLowerCase();
                API.busy = true;
                api___init_file(file);
                API.busy = false;

            } else {
                api___reset_all(() => {
                    console.log('RESET ALL API done ...');
                });
            }
            break;
        default:
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
