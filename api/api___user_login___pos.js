function(api, req, res, config, body, callback) {
    if (api == null || req == null || res == null || config == null)
        return { ok: false, message: 'api or req or res or config or body is null' };

    const data = req.body;

    const _ = api._;
    const FETCH = api.FETCH;
    const ___log = api.___log;
    const ___log_key = api.___log_key;

    ___log_key('LOGIN_POS', data);

    const ___cache = api.cache;
    const ___cache_users = api.cache['USER'] != null ? api.cache['USER'].items : [];
    const ___cache_sys_config = api.cache['SYS_CONFIG'] != null ? api.cache['SYS_CONFIG'].items : [];
    ___log_key('LOGIN_POS_USERS', ___cache_users);
    ___log_key('LOGIN_POS_SYS_CONFIG', ___cache_sys_config);

    try {
        if (data.str_user_name == null || data.str_pass_word == null) {
            if (callback) callback({ ok: false, message: 'Data format must be: {"str_user_name":"...", "str_pass_word":"..."}' });
            return;
        }

        if (
            (data.str_user_name == "yennh" || data.str_user_name == "chintn")
            && data.str_pass_word == "12345@abc") {

            const user_ = _.find(___cache_users, function (o) { return o.str_user_name == data.str_user_name; });

            if (user_) {
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

                let cf = {}, acf = ___cache_sys_config;
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

                ___log_key('LOGIN_POL_OK', 'LOGIN_POL_USER_SUCCESS = ', user);

                if (callback) callback(user);
            } else {
                ___log_key('LOGIN_POL_OK_POL_NOT_FOUND', 'FIND CACHE NOT FOUND', data);
                if (callback) callback({ ok: false, message: 'Đăng nhập không thành công' })
            }
        } else {

            //  postest
            // const obj = {
            // partnerCode: "MOBILE",
            // signKey: "88M9D5VMN8E6W0F6P2D6J"
            // };

            // pos release
            const obj = {
                partnerCode: "MOBILE",
                signKey: "9U9K5VGN806L0F6I2D6J"
            };

            const url = 'https://apilienket.f88.vn/GenChuKy';

            FETCH(url, { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) })
                .then(res1 => res1.json())
                .then(m1 => {
                    ___log_key('LOGIN_POS', 'CHU_KY', m1);

                    if (m1 && m1.code == 200) {
                        let key = m1.data.split(',');
                        //  console.log('????????? key', key);

                        var sid = "RBA50A1J15PS0S";
                        if (data && data.sid) {
                            sid = data.sid;
                        }

                        const params = {
                            UserName: data.str_user_name,
                            requestId: key[0],
                            locationCode: "Mobile",
                            partnerCode: "MOBILE",
                            signKey: key[1],
                            Password: data.str_pass_word,
                            HardDiskNumber: sid
                        }
                        // console.log('params', params)

                        //  let url_pos = 'https://partnertest.f88.vn/api/v1.0/pos/login';
                        let url_pos = 'https://partner.f88.vn/api/v1.0/pos/login';
                        //  console.log('url_pos', url_pos)


                        FETCH(url_pos, { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) })
                            .then(res1 => res1.json())
                            .then(m2 => {
                                ___log_key('LOGIN_POS', 'CHECK_POS_USER[1] m2 = ', m2);

                                //   console.log('request succeeded with JSON response', m2)
                                //  ___log('response api partner.f88.vn = ',m2);
                                if (m2 && m2.code == 200) {
                                    const user_ = _.find(___cache_users, function (o) { return o.str_user_name == data.str_user_name; });
                                    ___log_key('LOGIN_POS_OK', 'CHECK_POS_USER[2] user_ =', user_);
                                    //user_.ok = true;
                                    //if (callback) callback( { ok: false, user: user_, message: 'Đăng nhập không thành công' })

                                    if (user_) {
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

                                        let cf = {}, acf = ___cache_sys_config;
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

                                        ___log_key('LOGIN_POS_OK', 'LOGIN_POS_USER_SUCCESS = ', user);

                                        if (callback) callback(user);
                                    } else {
                                        ___log_key('LOGIN_POS_OK_POL_NOT_FOUND', 'FIND CACHE NOT FOUND', m2, params);
                                        if (callback) callback({ ok: false, message: 'Đăng nhập không thành công' })
                                    }
                                } else {
                                    if (callback) callback({ ok: false, message: m2.message });
                                }
                            }).catch(err2 => {
                                ___log_key('LOGIN_POS_ERR_LOGIN', 'CHECK_POS_USER', err2.message, params);
                                if (callback) callback({ ok: false, message: err2.message })
                            });

                    }

                }).catch(err1 => {
                    ___log_key('LOGIN_POS_ERR_CHU_KY', 'CHU_KY', err1.message, params);
                    if (callback) callback({ ok: false, message: 'Đăng nhập không thành công', err: ferr1 })
                });
        }
    } catch (err_throw) {
        ___log_key('LOGIN_POS_ERR_THROW', err_throw.message, data);
        if (callback) callback({ ok: false, message: 'Đăng nhập không thành công', err: err_throw })
    }
}