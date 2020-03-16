function(api, req, res, config, body) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const _self = api.cache[api_name];
    const LOG_KEY = api_name + '_' + config.action;
    if (_self == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    if (body == null || Object.keys(body).length == 0)
        return res.json({ ok: false, message: 'Data body is null' });
    
    const fn_addnew = api_name.toLowerCase() + '_addnew';
    if (api[fn_addnew] == null) {
        res.json({ ok: false, message: 'Cannot find ./api/api___' + fn_addnew + '.js', data: Object.keys(api) });
        return;
    }

    api.___log_key(LOG_KEY, config);

    let m = { ok: false, message: '', request: config };
    try {
        m = api[fn_addnew](api, req, res, config, body);
        m.request = config;
    } catch (e1) {
        m.message = e1.message;
        api.___log_key(LOG_KEY, 'ERR_1', e1.message);
    }
    res.json(m);
}