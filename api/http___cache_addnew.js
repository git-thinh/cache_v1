function(api, req, res, config, body) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    const request = { config: config };
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: request, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    if (body == null || Object.keys(body).length == 0) return res.json({ ok: false, message: 'Data body is null' });

    api.___log_key(LOG_KEY, request);

    //return res.json({ data: data });

    let m = { ok: false, message: '', request: request };
    try {
        api.cache[api_name].addnew(body, function (m_) {
            m_.request = request;
            res.json(m_);
        });
    } catch (e1) {
        m.message = e1.message;
        api.___log_key(LOG_KEY, 'ERR_1', e1.message);
        res.json(m);
    }
}