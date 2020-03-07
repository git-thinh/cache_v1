let api_notify_monitor = function api_notify_monitor() {
    let READY = false;
    let PORT = 10000;

    let CLIENT;
    const REDIS = require("redis");

    this.on_message = function (m) { };

    this.start = function (port) {
        const _self = this;

        if (port && port > 0) PORT = port;

        CLIENT = REDIS.createClient({ port: PORT });
        CLIENT.on("error", function (error) {
            READY = false;
            console.log('API_NOTIFY_MONITOR:', error);
        });
        CLIENT.on("end", function (error) {
            READY = false;
            console.log('API_NOTIFY_MONITOR \t-> end');
        });
        CLIENT.on("ready", function (error) {
            READY = true;
            console.log('API_NOTIFY_MONITOR \t-> ready');
        });
        CLIENT.on("connect", function (error) {
            READY = true;
            console.log('API_NOTIFY_MONITOR \t-> connect');
        });


        CLIENT.monitor(function (err, res) {
            console.log('API_NOTIFY_MONITOR: Entering monitoring mode.');
        });

        CLIENT.on('monitor', function (time, args) {
            if (args && args.length > 1 && args[0] == 'hset')
                setTimeout(function () {
                    try {
                        const m = JSON.parse(args[args.length - 1]);
                        _self.on_message(m);
                    } catch (e1) { ; }
                }, 1);
        });
    };
     
};

api_notify_monitor.instance = null;
api_notify_monitor.getInstance = function () {
    if (this.instance === null) this.instance = new api_notify_monitor();
    return this.instance;
};
module.exports = api_notify_monitor.getInstance();
