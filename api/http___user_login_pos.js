function(api, req, res, config, body) {
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

    const _self = api.cache[api_name];
    config.fn_conditions = function (o) { return o.str_user_name == body.str_user_name; }

    let m = { ok: false, code: '', message: '', request: config, data: [] };
    try {
        const rs = _self.search_by_config(config);
        if (rs.ok && rs.data.length > 0) {
            const user_ = rs.data[0];
            let user = ___user_build_profile_token(user_.id);
            const key = user.str_token.substr(0, 36);
            //___tokens[key] = user.user_id;

            api.___log_key('LOGIN_DEV_OK', user);

            m = user;
        }
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