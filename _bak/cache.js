const CACHE_DATA_PORT = 11000;
const CACHE_JOB_PORT = 12000;
const CACHE_NOTIFY_PORT = 15000;


//#region [ CHILD_PROCESS ]

const CHILD_PROCESS = require('child_process');

CHILD_PROCESS.exec('redis-server.exe redis.windows.conf --port ' + CACHE_DATA_PORT, { cwd: './cache/data/' }, function (error, stdout, stderr) {
    console.log('CACHE_DATA: %s RUNNING ...', CACHE_DATA_PORT);
    console.log(stdout);
});

CHILD_PROCESS.exec('redis-server.exe redis.windows.conf --port ' + CACHE_JOB_PORT, { cwd: './cache/job/' }, function (error, stdout, stderr) {
    console.log('CACHE_JOB: %s RUNNING ...', CACHE_JOB_PORT);
    console.log(stdout);
});

CHILD_PROCESS.exec('redis-server.exe redis.windows.conf --port ' + CACHE_NOTIFY_PORT, { cwd: './cache/notify/' }, function (error, stdout, stderr) {
    console.log('CACHE_NOTIFY: %s RUNNING ...', CACHE_NOTIFY_PORT);
    console.log(stdout);
});

//#endregion

let CACHE_DATA_READY = false;
let CACHE_JOB_READY = false;
let CACHE_NOTIFY_READY = false;

//#region [ REDIS CLIENT ]

const REDIS = require("redis");

const CLIENT_DATA = REDIS.createClient({ port: CACHE_DATA_PORT });
CLIENT_DATA.on("error", function (error) {
    CACHE_DATA_READY = false;
    console.log('CACHE_DATA:', error);
});
CLIENT_DATA.on("end", function (error) {
    CACHE_DATA_READY = false;
    console.log('CACHE_DATA \t-> end');
});
CLIENT_DATA.on("ready", function (error) {
    CACHE_DATA_READY = true;
    console.log('CACHE_DATA \t-> ready');
});
CLIENT_DATA.on("connect", function (error) {
    CACHE_DATA_READY = true;
    console.log('CACHE_DATA \t-> connect');
});


const CLIENT_JOB = REDIS.createClient({ port: CACHE_JOB_PORT });
CLIENT_JOB.on("error", function (error) {
    CACHE_JOB_READY = false;
    console.log('CACHE_JOB:', error);
});
CLIENT_JOB.on("end", function (error) {
    CACHE_JOB_READY = false;
    console.log('CLIENT_JOB \t-> end');
});
CLIENT_DATA.on("ready", function (error) {
    CACHE_JOB_READY = true;
    console.log('CLIENT_JOB \t-> ready');
});
CLIENT_DATA.on("connect", function (error) {
    CACHE_JOB_READY = true;
    console.log('CLIENT_JOB \t-> connect');
});


const CLIENT_NOTIFY = REDIS.createClient({ port: CACHE_NOTIFY_PORT });
CLIENT_NOTIFY.on("error", function (error) {
    CACHE_NOTIFY_READY = false;
    console.log('CACHE_NOTIFY:', error);
});
CLIENT_NOTIFY.on("end", function (error) {
    CACHE_NOTIFY_READY = false;
    console.log('CLIENT_NOTIFY \t-> end');
});
CLIENT_DATA.on("ready", function (error) {
    CACHE_NOTIFY_READY = true;
    console.log('CLIENT_NOTIFY \t-> ready');
});
CLIENT_DATA.on("connect", function (error) {
    CACHE_NOTIFY_READY = true;
    console.log('CLIENT_NOTIFY \t-> connect');
});


//#endregion

const _READ_LINE = require("readline");
const _RL = _READ_LINE.createInterface({ input: process.stdin, output: process.stdout });
_RL.on("line", function (text) {
    const a = text.split(' ');
    const cmd = a[0].toLowerCase();
    switch (cmd) {
        case 'exit':
            process.exit();
            break;
        case 'cls':
            console.clear();
            break;
        case 'info':
            console.clear();
            console.log('-> CACHE_DATA\t%s = %s \n-> CACHE_JOB\t%s = %s \n-> CACHE_NOTIFY\t%s = %s \n',
                CACHE_DATA_PORT, CACHE_DATA_READY, CACHE_JOB_PORT, CACHE_JOB_READY, CACHE_NOTIFY_PORT, CACHE_NOTIFY_READY);
            break;
        default:
            break;
    }
});