const ___SCOPE = 'MAIN';
const ___ENVIRONMENT_DEV = true;
const ___CLEAN_LOG = true;

const im_config = require('./im_config.js');

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

    console.log('LOG ready ...');
    app___start();
});

//#endregion

const app___start = () => {
    im_config.get().then(cfs => {
        ___log_key('CONFIG', cfs);
    });
};





//#region [ READLINE ]

const READ_LINE = require("readline");
const RL = READ_LINE.createInterface({ input: process.stdin, output: process.stdout });
RL.on("line", function (text) {
    switch (text) {
        case 'exit':
            process.exit();
            break;
        case 'cls':
            console.clear();
            break;
        case 'test':

            ////const url = HOST_POS_BASE_URI + 'job-v1-update/DB_UPDATE';
            ////const data1 = {
            ////    id: 1,
            ////    name: "long",
            ////    class: {
            ////        id: 1,
            ////        name: "a1"
            ////    }
            ////};

            ////_FETCH(url, { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(data1) })
            ////    .then(res => res.json())
            ////    .then(m => {
            ////        console.log('f_____update_cache_memory result', m);
            ////    }).catch(err => {
            ////        console.log('f_____update_cache_memory result error ', err);
            ////    });

            break;
        default:
            break;
    }
});

//#endregion
