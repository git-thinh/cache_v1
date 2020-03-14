let im_cache = function api() {
    let client;
    const redis = require("redis");
    const _ = require('lodash');

    this.ok = false;
    this.message = '';
    this.ready = false;

    this.config = {
        id: 0,
        name: '',
        port: 0,
        schema: null,
        cmd_install: '',
        sql_scope: null,
        sql_select: null,
        sql_connect: null,
        valid_add: null
    };
    
    this.init = function (config_) {
        const _self = this;
        if (config_) for (var key in config_) _self.config[key] = config_[key];

        return new Promise(function (resolve, reject) {
            const config = _self.config;

            if (config.name == null || config.name.length == 0 || config.port == 0) {
                _self.message = 'Config of name or schema is null or port = 0';
                return resolve(_self);
            }

            client = redis.createClient({ port: config.port });
            client.on("error", function (error) {
                if (_self.ready) {
                    _self.ready = false;
                    _self.message = error.message;
                    console.log('API_' + config.name + ':', error);
                } else if (_self.message != error.message) {
                    console.log('API_' + config.name + ':', error);
                    _self.message = error.message;
                    return resolve(_self);
                }
            });
            client.on("end", function (error) {
                _self.ready = false;
                console.log('API_' + config.name + ': \t-> end');
            });
            client.on("ready", function (error) {
                _self.ready = true;
                _self.ok = true;
                return resolve(_self);
            });
            client.on("connect", function (error) {
                _self.ready = true;
                //console.log('API_' + config.name + ': \t-> connect');
            });
        });
    };
};

im_cache.instance = null;
im_cache.getInstance = function () {
    if (this.instance === null) this.instance = new im_cache();
    return this.instance;
};
module.exports = im_cache.getInstance();
