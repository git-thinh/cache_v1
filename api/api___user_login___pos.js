function(api, req, res, config, body) {
    if (api == null || req == null || res == null || config == null) 
        return { ok: false, message: 'api or req or res or config or body is null' };

    const data = req.body;

    const ___log = api.___log;
    const ___log_key = api.___log_key;
    const ___log_err_throw = api.___log_err_throw;

    ___log_key('LOGIN_POS', data);

    try {
        if (data.str_user_name == null || data.str_pass_word == null)
            return { ok: false, message: 'Data format must be: {"str_user_name":"...", "str_pass_word":"..."}' };

        if (data.str_user_name == "chintn" && data.str_pass_word == "12345@abc") {
            const user_ = _.find(___cache['USER'], function (o) { return o.str_user_name == data.str_user_name && o.str_pass_word == data.str_pass_word; });
            if (user_) {

                let user = ___user_build_profile_token(user_.user_id);
                const key = user.str_token.substr(0, 36);
                ___tokens[key] = user.user_id;

                return user);
            } else {
                return { ok: false, message: 'Đăng nhập không thành công' };
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

            _FETCH(url, { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) })
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


                        _FETCH(url_pos, { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) })
                            .then(res1 => res1.json())
                            .then(m2 => {
                                ___log_key('LOGIN_POS', 'CHECK_POS_USER', m2);

                                //   console.log('request succeeded with JSON response', m2)
                                //  ___log('response api partner.f88.vn = ',m2);
                                if (m2 && m2.code == 200) {

                                    const user_ = _.find(___cache['USER'], function (o) { return o.str_user_name == data.str_user_name; });
                                    if (user_) {

                                        let user = ___user_build_profile_token(user_.user_id);
                                        const key = user.str_token.substr(0, 36);
                                        ___tokens[key] = user.user_id;
                                        //   ___log('login ok .....................',data.str_user_name);
                                        // console.log('login ok .....................', m)

                                        ___log_key('LOGIN_POS_OK', 'CHECK_POS_USER', user);
                                        return user;
                                    } else {
                                        ___log_key('LOGIN_POS_NG', 'CHECK_POS_USER', m2, params);
                                        return { ok: false, message: 'Đăng nhập không thành công' };
                                    }
                                } else {
                                    return { ok: false, message: m2.message };
                                }
                            }).catch(err2 => {
                                ___log_key('LOGIN_POS_ERR', 'CHECK_POS_USER', err2.message, params);
                                ___log_err_throw('LOGIN_POS', 'CHECK_POS_USER', err2.message, params);
                            });

                    }

                }).catch(err1 => {
                    //console.log(url, err.message); 
                    ___log_key('LOGIN_POS', 'CHU_KY', err1.message, params);
                    ___log_err_throw('LOGIN_POS', 'CHU_KY', err1.message, params);
                }).catch(ferr1 => {
                    ___log_key('LOGIN_POS_ERR', 'CHU_KY', ferr1.message);
                    return { ok: false, message: 'Đăng nhập không thành công', err: ferr1 };
                });
        }
    } catch (err_throw) {
        ___log_key('LOGIN_POS_ERR', err_throw.message, data);
        ___log_err_throw('LOGIN_POS_ERR', err_throw.message, data);
        //___log_err_throw('/api/login', err_throw, req.path, data);
        return { ok: false, message: 'Đăng nhập không thành công', err: err_throw };
    }
}