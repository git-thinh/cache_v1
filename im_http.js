let im_http = function im_http() {
    let config = {
        port: 20000,
        ip: '127.0.0.1',
        uri_start: '/pol/api'
    };

    const HTTP_EXPRESS = require('express');
    const HTTP_BODY_PARSER = require('body-parser');
    const HTTP_COOKIE_PARSER = require('cookie-parser');
    const HTTP_APP = HTTP_EXPRESS();
    const HTTP_SERVER = require('http').createServer(HTTP_APP);

    HTTP_APP.use(HTTP_COOKIE_PARSER());
    HTTP_APP.use(HTTP_BODY_PARSER.json());

    this.start = function (config_, callback) {
        const _self = this;
        if (config_) for (var key in config_) config[key] = config_[key];

        HTTP_APP.use((error, req, res, next) => {
            if (error !== null) {
                return res.json({ ok: false, mesage: 'Invalid json ' + error.toString() });
            }
            return next();
        });

        HTTP_APP.get('/', (req, res) => _self.API.http___(_self.API, req, res, {}, req.body, null));
        HTTP_APP.post('/', (req, res) => _self.API.http___(_self.API, req, res, {}, req.body, null));

        HTTP_SERVER.listen(config.port, config.ip, callback);
    };
};

im_http.instance = null;
im_http.getInstance = function () {
    if (this.instance === null) this.instance = new im_http();
    return this.instance;
};
module.exports = im_http.getInstance();