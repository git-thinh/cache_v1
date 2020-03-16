function(api, req, res, config, body) {
    if (api == null || req == null || res == null || config == null) return null;
    const LOG_KEY = config.cache + '.' + config.action;    
    const api_name = config.cache;

    api.___log_key(LOG_KEY, config);

    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    let m = { ok: false, message: '' };
    try {
        m = api.cache[api_name].search_by_config(config);
    } catch (e1) {
        m.message = e1.message;
    }
    return res.json(m);

    //res.json({ ok: true, time: new Date().toLocaleString() });
    //res.json({ data: Object.keys(api.cache) });
    //res.json(api.cache[api_name].items);
    //res.json(api.cache[api_name].get_config());
}