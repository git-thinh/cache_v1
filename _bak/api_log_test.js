
const log = require('./api_log.js');
log.start();

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
            console.clear();
            log.write('LOG_TEST', { data: text, time: new Date().toLocaleString() });
            break;
    }
});