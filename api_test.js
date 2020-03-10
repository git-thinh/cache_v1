﻿console.log('\n');
const FS = require('fs');
const _ = require('lodash');
const HTTP_PORT = 20000;

//#region [ API ]

let API = {
    id___: 100,
    busy: false
};

const api___reset = (callback) => {
    API.busy = true;

    if (FS.existsSync('./api/')) {
        FS.readdir('./api/', (e1_, files_) => {
            if (e1_) {
                console.log('API_INSTALL: ', e1_);
                callback();
            } else {
                const temp___ = {
                    id___: 100,
                    busy: false
                };
                files_.forEach(file => {
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
                                        fc(temp___, null);
                                    } else if (f.startsWith('http___')) {
                                        fc = new Function('api', 'req', 'res', js);
                                        fc(temp___, null, null);
                                    } else if (f.startsWith('valid___')) {
                                        fc = new Function('api', 'col', 'obj', 'val', js);
                                        fc(temp___, null, null, null);
                                    } else {
                                        fc = new Function('api', 'obj', js);
                                        fc(temp___, null);
                                    }
                                    temp___[f.substr(0, f.length - 3).trim()] = fc;
                                    console.log('-> API: ', file, ' done');
                                } catch (efc) {
                                    console.log('\n API: ', file, efc);
                                }
                            }
                        }
                    }
                });
                API = temp___;
                console.log('\n----> API: complete ...\n');
                callback();
            }
        });
    }
    callback();
}

api___reset(() => { API.busy = false; });

//#endregion

//#region [ DB CACHE ]

const CFS_DB = require('./config_db.js').get_config();

const install_db = (callback) => {
    if (CFS_DB.length == 0) return callback();
    const cf = CFS_DB.shift();
    API[cf.name] = require('./api.js');
    API[cf.name].API = API;
    API[cf.name].start(cf, () => {
        console.log('-> %s = READY ... \n\n', cf.name.toUpperCase());
        install_db(callback);
    });
};

install_db(() => {
    console.log('\n CACHE ALL DONE ...');
    main___ready();
});

//#endregion

const http = require('./http.js');
const main___ready = () => {
    http.API = API;
    http.start({ port: HTTP_PORT }, () => {

        console.log('\n----> MAIN READY: ' + HTTP_PORT);
    });
};

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
        case 'reload':
            console.clear();
            api___reset(() => { API.busy = false; });
            break;
        default:
            console.log('\n', API['PAWN'].valid_add({
                //id: 123,
                //int_status: 1,
                //int_status: '1',
                //int_cancel_time: null,
                //int_cancel_time: 'asdasd',
                int_cancel_time: 'hhmmss',
                //int_cancel_time: 123,
                //col_wrong: 9999,

                int_days: 30,
                lng_money: 1000000,
                asset_type_id: 1,
                city_id: 1,
                district_id: 1
            }));


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