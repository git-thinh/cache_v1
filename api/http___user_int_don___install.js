function(api, req, res, config, body, callback) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    api.___log_key(LOG_KEY, config);

    if (body == null || Object.keys(body).length == 0) {
        res.json({ ok: false, message: 'Data format must be: { key:...}' });
        return;
    }

    const ___cache = api.cache;
    const _self = ___cache[api_name];

    let m = { ok: false, code: '', message: '', request: config, data: [] };
    try {
        _self.update_object_for_all({ int_don: 0 }, (r1) => {
            //console.log(r1);
            m = r1;
            m.request = config;
            res.json(m);
        });
    } catch (e1) {
        m.message = e1.message;
        res.json(m);
    }
}