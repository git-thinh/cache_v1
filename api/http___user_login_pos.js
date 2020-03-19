function(api, req, res, config, body, callback) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    api.___log_key(LOG_KEY, config);

    if (body == null || body.str_user_name == null || body.str_pass_word == null) {
        res.json({ ok: false, message: 'Data format must be: { str_user_name:..., str_pass_word:...}' });
        return;
    }

    let m = { ok: false, code: '', message: '', request: config, data: [] };
    try {
        api['user_login___pos'](api, req, res, config, body, (u) => {
            //console.log('?????????? u = ', u);
            m = u;
            //m.request = config;
            res.json(m);
        });
    } catch (e1) {
        m.message = e1.message;
        res.json(m);
    }
}