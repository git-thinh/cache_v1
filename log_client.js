let log_client = function grpc_client() {
    let LOG_READY = false;
    let LOG_PORT = 19000;

    let CLIENT;
    let BUF = [];
    let BUSY = false;

    const REDIS = require("redis");
    const JOB = require('cron').CronJob;

    let TSL = 3; //1s
    this.start = function (port, tls) {
        const _self = this;

        if (port && port > 0) {
            LOG_PORT = port;
            TSL = tls;
        }
        if (TSL == null || TSL < 3) TSL = 3;

        CLIENT = REDIS.createClient({ port: LOG_PORT });
        CLIENT.on("error", function (error) {
            LOG_READY = false;
            console.log('LOG_CLIENT:', error);
        });
        CLIENT.on("end", function (error) {
            LOG_READY = false;
            console.log('LOG_CLIENT \t-> end');
        });
        CLIENT.on("ready", function (error) {
            LOG_READY = true;
            console.log('LOG_CLIENT \t-> ready');
        });
        CLIENT.on("connect", function (error) {
            LOG_READY = true;
            console.log('LOG_CLIENT \t-> connect');
        });

        new JOB('*/' + TSL + ' * * * * *', _self.save_log).start();
    };

    this.save_log = function () {
        if (CLIENT == null) return;
        if (BUSY) return;

        if (BUF.length > 0) {
            BUSY = true;
            const multi = CLIENT.multi();
            while (BUF.length > 0) {
                const m = BUF.shift();
                multi.hset(m.a, m.d + '' + m.t, JSON.stringify(m));
                //console.log('SAVE = ', m);
            }
            multi.exec(function (err, replies) {
                //console.log('MULTI got ' + replies.length + ' replies');
                BUSY = false;
            });
        }
    };

    this.write = function (scope, ...agrs) {
        if (scope == null || agrs.length == 0) return;
        const m = {
            a: scope,
            d: Number(new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 8)),
            t: Number(new Date().toTimeString().split(' ')[0].replace(/\D/g, '')),
            l: agrs
        };
        if (agrs.length == 1) m.l = agrs[0];
        BUF.push(m);
    };
};

log_client.instance = null;
log_client.getInstance = function () {
    if (this.instance === null) this.instance = new log_client();
    return this.instance;
};
module.exports = log_client.getInstance();
