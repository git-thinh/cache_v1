function(api, req, res, config, body) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action; 
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    api.___log_key(LOG_KEY, config);

    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });
    
    let m = { ok: false, code: '', message: '', request: config, data: [] };    
    try {
        m = api.cache[api_name].search_by_config(config);
        m.request = config;
    } catch (e1) {
        m.code = 'ERR_CALL_GET_ALL';
        m.message = e1.message;
    }
    res.json(m);
}