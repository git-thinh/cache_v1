function(api, req, res, config, body) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    const request = { config: config };
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: request, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    api.___log_key(LOG_KEY, request);

    let m = { ok: false, message: '', request: request, config: {} };
    try {
        m.config = api.cache[api_name].get_config();
        m.ok = true;
    } catch (e1) {
        m.message = e1.message;
        api.___log_key(LOG_KEY, 'ERR_1', e1.message);
    }
    res.json(m);
}