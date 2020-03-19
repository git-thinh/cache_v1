function(api, req, res, config, body, callback) {
    if (api == null || req == null || res == null || config == null) return null;
    const api_name = config.cache;
    const LOG_KEY = api_name + '_' + config.action;
    if (api.cache[api_name] == null)
        return res.json({ ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache });

    api.___log_key(LOG_KEY, config);

    if (body == null || Array.isArray(body) == false) {
        res.json({ ok: false, message: 'Data format must be: [{ id:..., int_don:...}]' });
        return;
    }

    const FETCH = api.FETCH;
    const IO_PORT = api.IO_PORT;

    const ___cache = api.cache;
    const _self = ___cache[api_name];

    let m = { ok: false, code: '', message: '', request: config, data: [] };
    try {
        _self.update_array_objects_by_id(body, (r1) => {
            //console.log(r1);
            m = r1;
            m.request = config;
            //res.json(m);

            if (m.ok) {

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
        });
    } catch (e1) {
        m.message = e1.message;
        res.json(m);
    }
}
