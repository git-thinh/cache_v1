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

    const ___cache = api.cache;
    const _self = ___cache[api_name];

    config.fn_conditions = function (o) { return o.str_user_name == body.str_user_name; }

    let m = { ok: false, code: '', message: '', request: config, data: [] };
    try {
        const rs = _self.search_by_config(config);
        if (rs.ok && rs.data.length > 0) {
            const user_ = rs.data[0];
            user_.int_pol_status = 1; // 0: offline; 1: online


            user_.str_token = user_.id + '12345xxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxxxxxxxxxxxxx4xxxxyxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });;
            user_.user_id = user_.id;
            user_.ref_id = user_.id;
            user_.scope_ids = 'pol';

            
            let user = JSON.parse(JSON.stringify(user_));
            user.ok = true;
            delete user['str_password'];

            let cf = {}, acf = (___cache['SYS_CONFIG'] == null ? [] : ___cache['SYS_CONFIG'].items);
            for (var i = 0; i < acf.length; i++) {
                let o = acf[i];
                cf[o.str_code] = o.str_value;
            }
            user.pos_sys_config = cf;

            const _SYS_SCOPE = {
                'test': [{ str_code: 'test', str_title: 'Test' }],
                'vtp': [{ str_code: 'vtp-pawn', str_title: 'DS hợp đồng VTP' }, { str_code: 'vtp-pawn-invited', str_title: 'DS đơn giới thiệu VTP' }],
                'pol': [{ str_code: 'pawn-online', str_title: 'Quản lý đơn online' }],
                'afsg': [{ str_code: 'affiliate-finance-sg', str_title: 'DS đơn giới thiệu của tài chính Sài Gòn' }],
                'ketoan': [{ str_code: 'affiliate-accountant', str_title: 'DS đơn đối soát kế toán' }]
            };
            let scopes = [];
            if (user.scope_ids) {
                if (user.scope_ids == '*') {
                    for (const field in _SYS_SCOPE)
                        _SYS_SCOPE[field].forEach(sc => scopes.push(sc));
                } else {
                    user.scope_ids.split(',').forEach(field => {
                        if (_SYS_SCOPE[field] && _SYS_SCOPE[field].length > 0)
                            _SYS_SCOPE[field].forEach(sc => scopes.push(sc));
                    });
                }
            }

            user.scope_urls = scopes;
            //user.redirect_url = scopes.length == 0 ? '/' : (scopes[0].str_code + '?token=' + user.str_token);
            user.redirect_url = scopes.length == 0 ? '/' : scopes[0].str_code;


            //let user = ___user_build_profile_token(user_.id);
            //const key = user.str_token.substr(0, 36);
            //___tokens[key] = user.user_id;

            api.___log_key('LOGIN_DEV_OK', user);

            m = user;
        } else {
            m.ok = false;
            m.message = 'Đăng nhập không thành công';
        }
        m.request = config;
    } catch (e1) {
        m.message = e1.message;
    }

    res.json(m);

    //res.json({ ok: true, time: new Date().toLocaleString() });
    //res.json({ data: Object.keys(api.cache) });
    //res.json(api.cache[api_name].items);
    //res.json(api.cache[api_name].get_config());
}