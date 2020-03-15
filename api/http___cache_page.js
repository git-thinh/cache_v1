﻿function(api, req, res, config) {
    if (api == null || req == null || res == null || config == null) return null;
    const LOG_KEY = config.cache + '.' + config.action;    
    const request = { config: config };
    const api_name = config.cache;



    api.___log_key(LOG_KEY, request);

    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: request, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    const fn = new Function('o', ' return true;');
    let m = { ok: false, message: '' };
    try {
        m = api.cache[api_name].search(fn, 15);
    } catch (e1) {
        m.message = e1.message;
    }
    return res.json(m);

    //res.json({ ok: true, time: new Date().toLocaleString() });
    //res.json({ data: Object.keys(api.cache) });
    //res.json(api.cache[api_name].items);
    //res.json(api.cache[api_name].get_config());
}