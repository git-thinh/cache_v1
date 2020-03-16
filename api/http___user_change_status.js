function(api, req, res, config, body) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    api.___log_key(LOG_KEY, config);

    if (body == null || body.int_pol_status == null || body.user_id == null) {
        res.json({ ok: false, message: 'Data format must be: { user_id:..., int_pol_status:...}' });
        return;
    }

    const ___cache = api.cache;
    const _self = ___cache[api_name];

    config.fn_conditions = function (o) { return o.id == body.user_id; }

    let m = { Ok: false, code: '', message: '', request: config, data: [] };
    try {
        const rs = _self.search_by_config(config);
        if (rs.ok && rs.data.length > 0) {
            const user = rs.data[0];
            user.int_pol_status = body.int_pol_status;

            api.___log_key('LOGIN_DEV_OK', user);

            m.data = user;
            m.Ok = true;
        } else {
            m.message = 'Đăng nhập không thành công';
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