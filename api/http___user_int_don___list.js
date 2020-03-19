function(api, req, res, config, body, callback) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    api.___log_key(LOG_KEY, config);
    
    //let m = { ok: false, code: '', message: '', request: config, data: [] };
    let m = { ok: false, inputs: {}, data: { size: 0, results: [] } };
    try {
        const r = api['user_int_don___list'](api, req, res, config, body, null);;
        m.ok = r.ok;
        let a = r.ok && r.data ? r.data : [];
        a = api._.sortBy(a, 'id');

        m.data.size = a.length;
        m.data.results = a;
        m.request = config;
    } catch (e1) {
        m.message = e1.message;
    } 
    res.json(m);
}