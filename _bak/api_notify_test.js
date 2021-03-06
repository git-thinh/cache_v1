﻿
const api = require('./api_notify.js');
api.start();

const api_notify_monitor = require('./api_notify_monitor.js');
api_notify_monitor.on_message = (m) => {
    console.log('NOTIFY_MESSAGE=', m);
};
api_notify_monitor.start();

const READ_LINE = require("readline");
const RL = READ_LINE.createInterface({ input: process.stdin, output: process.stdout });
RL.on("line", function (text) {
    const a = text.split(' ');
    const cmd = a[0].toLowerCase();
    switch (cmd) {
        case 'exit':
            process.exit();
            break;
        case 'cls':
            console.clear();
            break;
        default:
            //console.clear();
            //console.log('??????? = ', a);

            if (a.length == 1) {
                api.send('1', { data: text, time: new Date().toLocaleString() }, function (err, res) {
                    console.log('OK = ', res);
                });
            } else {
                api.send(a[0], { data: text.substr(a[0].length, text.length - a[0].length), time: new Date().toLocaleString() }, function (err, res) {
                    console.log('OK = ', res);
                });
            }
            break;
    }
});