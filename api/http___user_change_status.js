function(api, req, res, config, body) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    api.___log_key(LOG_KEY, config);

    if (body == null || body.int_pol_status == null || body.user_id == null) {
        res.json({ ok: false, message: 'Data format must be: { user_id:..., int_pol_status:..., int_user_create:...}' });
        return;
    }

    const FETCH = api.FETCH;
    const IO_PORT = api.IO_PORT;

    const _ = api._;
    const ___cache = api.cache;
    const _self = ___cache[api_name];

    let m = { ok: false, code: '', message: '', request: config };
    try {
        const index = _.findIndex(_self.items, function (o_) { return o_.id == body.user_id; });
        if (index != -1) {
            _self.items[index].int_pol_status = body.int_pol_status;

            m = api['user_int_don___list'](api, req, res, config, body);
            m.command = 'BROAD_CAST_USER_TLS';

            FETCH('http://127.0.0.1:' + IO_PORT + '/api-v1/push-notify', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(m)
            }).then(res1 => res1.json()).then(m1 => {
                api.___log_key('BROAD_CAST_USER_TLS', m);
                m.ok = m1.ok;
                res.json(m);
            }).catch(e1 => {
                m.message = e1.message;
                m.err = e1;
                res.json(m);
            });
        }
    } catch (e) {
        m.message = e.message;
        api.___log_key(LOG_KEY, m);
        res.json(m);
    }
}