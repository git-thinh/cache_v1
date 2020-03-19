function(api, req, res, config, body, callback) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    api.___log_key(LOG_KEY, config);

    const _self = api.cache[api_name];

    let m = { ok: false, code: '', message: '', request: config, data: [] };
    try {
        m.request = config;
        _self.busy = _self.busy ? false : true;
        m.data = _self.get_config();
    } catch (e1) {
        m.message = e1.message;
    } 
    return res.json(m);

    //res.json({ ok: true, time: new Date().toLocaleString() });
    //res.json({ data: Object.keys(api.cache) });
    //res.json(api.cache[api_name].items);
    //res.json(api.cache[api_name].get_config());
}