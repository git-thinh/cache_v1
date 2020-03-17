function(api, req, res, config, body) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    if (api.cache[api_name] == null)
        return { ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache };

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

    let m = { ok: false, message: '', request: config, data: [] };
    try {
        m = api.cache[api_name].search_by_config(config);
    } catch (e1) {
        m.message = e1.message;
    }

    return m;
}