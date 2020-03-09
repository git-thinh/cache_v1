console.log('\n');

const API = {};

//#region [ DB CACHE ]

const CFS_DB = require('./config_db.js').get_config();
console.log(CFS_DB.length);

const install_db = (callback) => {
    if (CFS_DB.length == 0) return callback();
    const cf = CFS_DB.shift();
    API[cf.name] = require('./api.js').start(cf, () => {
        console.log('-> %s = READY ... \n\n', cf.name.toUpperCase());
        install_db(callback);
    });
};

install_db(() => {

    console.log('\n CACHE ALL DONE ...');
    main___ready();

    //if (API['PAWN'] && API['PAWN'].indexs)
    //    API['PAWN'].indexs(() => {
    //        console.log('\n INDEX DONE ...');
    //        main___ready();
    //    });
    //else
    //    main___ready();
});

//#endregion

const main___ready = () => {
    console.log('\n MAIN READY ...');
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
        //case 'delete_all':
        //    console.clear();
        //    //api.delete_all(function (res) {
        //    //    console.log(res);
        //    //});
        //    break;
        //case 'load':
        //    console.clear();
        //    //if (a.length > 1) {
        //    //    if (fs.existsSync(a[1])) {
        //    //        fs.readFile(a[1], (err, buf_file) => {
        //    //            if (err) {
        //    //                console.log('ERROR: ' + a[1], err);
        //    //                return;
        //    //            }
        //    //            console.log('BUF ' + a[1] + ' = ', buf_file.length);
        //    //            const o = JSON.parse(buf_file.toString('utf8'));
        //    //            if (o.POL_PROCESS) {
        //    //                console.log('JSON = ', o.POL_PROCESS.length);
        //    //                //console.log('JSON = ', o.POL_PROCESS);

        //    //                const _start = stopWatch();
        //    //                api.update(o.POL_PROCESS, function (res) {
        //    //                    console.log('??? = ', res);
        //    //                });

        //    //                const _end = stopWatch();
        //    //                console.log('time = ' + (_end - _start).toFixed(3) + ' s');
        //    //            }
        //    //        });
        //    //    } else {
        //    //        console.log('Cannot find ' + a[1]);
        //    //    }
        //    //}
        //    break;
        default:
            //console.clear();
            //api.add({ time: new Date().getTime() }, function (res) {
            //    console.log(res);
            //});
            if (a.length > 1) {
                let api = cmd;
                cmd = a[1].toLowerCase();
                let data = a.length > 2 ? a[2] : '';
                switch (api) {
                    case 'notify':
                        switch (cmd) {
                            case 'info':
                                console.log(noti.info());
                                break;
                            case 'add':
                                if (data.length > 0) {
                                    noti.add(data, (m_) => {
                                        console.log('-> ', api, cmd, m_);
                                    });
                                }
                                break;
                            case 'delete':
                                if (data.length > 0) {
                                    noti.delete(data, (m_) => {
                                        console.log('-> ', api, cmd, m_);
                                    });
                                }
                                break;
                        }
                        break;
                }
            }
            break;
    }
});