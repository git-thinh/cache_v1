const fs = require('fs');
const stopWatch = require("performance-now");

const api = require('./api_process.js');
api.start();



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
        case 'delete_all':
            console.clear();
            api.delete_all(function (res) {
                console.log(res);
            });
            break;
        case 'load':
            console.clear();
            if (a.length > 1) {
                if (fs.existsSync(a[1])) {
                    fs.readFile(a[1], (err, buf_file) => {
                        if (err) {
                            console.log('ERROR: ' + a[1], err);
                            return;
                        }
                        console.log('BUF ' + a[1] + ' = ', buf_file.length);
                        const o = JSON.parse(buf_file.toString('utf8'));
                        if (o.POL_PROCESS) {
                            console.log('JSON = ', o.POL_PROCESS.length);
                            //console.log('JSON = ', o.POL_PROCESS);

                            const _start = stopWatch();
                            api.update(o.POL_PROCESS, function (res) {
                                console.log('??? = ', res);
                            });

                            const _end = stopWatch();
                            console.log('time = ' + (_end - _start).toFixed(3) + ' s');
                        }
                    });
                } else {
                    console.log('Cannot find ' + a[1]);
                }
            }
            break;
        default:
            console.clear();
            //api.add({ time: new Date().getTime() }, function (res) {
            //    console.log(res);
            //});             
            break;
    }
});