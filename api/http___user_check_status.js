function(api, req, res, config, body) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    api.___log_key(LOG_KEY, config);

    if (body == null || body.user_id == null) {
        res.json({ ok: false, message: 'Data format must be: { user_id:...}' });
        return;
    }
     
    let m = { ok: false, data: 0 };
    try {
        const r = api.cache[api_name].get_by_id(body.user_id);
        if (r) {
            m.ok = true;
            m.data = r.int_pol_status;
        }
        //m.request = config;
    } catch (e1) {
        m.message = e1.message;
    } 
    res.json(m);
}