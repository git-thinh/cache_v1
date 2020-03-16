function(api, req, res, config, body) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    api.___log_key(LOG_KEY, config);


    config.page_size = 2000;
    config.fn_conditions = function (o) { return o != null && o.group_id == 44; }
    config.fn_map = function (o) {
        if (o) return {
            id: o.id,
            int_don: o.int_don,
            int_pol_region: o.int_pol_region,
            int_pol_status: o.int_pol_status,
            str_user_name: o.str_user_name,
            str_full_name: o.str_full_name
        }; else return null;
    }

    //let m = { ok: false, code: '', message: '', request: config, data: [] };
    let m = { ok: false, inputs: {}, data: { size: 0, results: [] } };
    try {
        const r = api.cache[api_name].search_by_config(config);
        m.ok = r.ok;
        let a = r.ok && r.data ? r.data : [];
        a = api._.sortBy(a, 'id');

        m.data.size = a.length;
        m.data.results = a;
        m.request = config;
    } catch (e1) {
        m.message = e1.message;
    } 
    return res.json(m);

    //res.json({ ok: true, time: new Date().toLocaleString() });
    //res.json({ data: Object.keys(api.cache) });
    //res.json(api.cache[api_name].items);
    //res.json(api.cache[api_name].get_config());
}