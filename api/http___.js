function(api, req, res, config, body) {
    if (api == null || req == null || res == null) return null;

    let str_api, str_action;
    if (req.query && req.query.api && req.query.action) {
        str_api = req.query.api.toUpperCase();
        str_action = req.query.action.toLowerCase();
    }

    if (str_api == null || str_api.length == 0 ||
        str_action == null || str_action.length == 0)
        return res.json({ ok: false, message: 'URI must be format is /?api=...&action=...', time: new Date().toLocaleString() });

    let a = [];
    let k, v, pos = -1;

    const query = {};
    //#region [ PATH, QUERY ]

    let path = req.originalUrl;
    if (path.startsWith('/?')) path = path.substr(2);
    path = path.split('&&').join('^^');

    a = path.split('&');
    for (var i = 0; i < a.length; i++) {
        pos = a[i].indexOf('=');
        if (pos > 0) {
            k = a[i].substr(0, pos);
            v = a[i].substr(pos + 1, a[i].length - pos - 1);
            v = v.split('^^').join('&&');
            v = decodeURIComponent(v);
            query[k] = v;
        }
    }

    //#endregion

    let fn_conditions;
    //#region [ FN_CONDITIONS ]

    let str_conditions;
    if (query && query.fn_conditions) conditions = query.fn_conditions;
    if (str_conditions == null || conditions.length == 0) str_conditions = null;
    if (body && body.fn_conditions) str_conditions = body.fn_conditions;

    if (str_conditions) {
        try {
            fn_conditions = new Function('o', str_conditions);
            fn_conditions(null);
            fn_conditions({});
        } catch (e1) {
            fn_conditions = null;
            res.json({ ok: false, code: 'ERR_CREATE_FN_CONDITIONS', message: e1.message, err: e1 });
            return;
        }
    }

    //#endregion
       
    let fn_map;
    //#region [ FN_MAP ]

    let str_map;
    if (query && query.fn_map) str_map = query.fn_map;
    if (str_map == null || str_map.length == 0) str_map = null;
    if (body && body.fn_map) str_map = body.fn_map;
    //console.log('str_map === ', str_map);    

    if (str_map) {
        try {
            fn_map = new Function('o', str_map);
            fn_map(null);
            fn_map({});
        } catch (e1) {
            fn_map = null;
            res.json({ ok: false, code: 'ERR_CREATE_FN_MAP', message: e1.message, err: e1 });
            return;
        }
    }

    //#endregion

    let page_number = 1;
    //#region [ page_number ]

    let v_page_number;
    if (query && query.page_number) v_page_number = query.page_number;
    if (v_page_number == null || v_page_number.length == 0) v_page_number = null;
    if (body && body.page_number) v_page_number = body.page_number;

    if (v_page_number) {
        v_page_number = v_page_number.toString().trim().split('.')[0].trim();
        if (v_page_number.length > 0) {
            const n_page_number = Number(v_page_number);
            if (isNaN(n_page_number) || n_page_number < 1) {
                res.json({ ok: false, code: 'ERR_CONFIG_PAGE_NUMBER', message: 'Config page_number must be > 0' });
                return;
            } else {
                page_number = n_page_number;
            }
        }
    }

    //#endregion

    let page_size = api.page_size == null ? 0 : api.page_size;
    //console.log('api.page_size === ', api.page_size);
    //#region [ page_size ]

    let v_page_size;
    if (query && query.page_size) v_page_size = query.page_size;
    if (v_page_size == null || v_page_size.length == 0) v_page_size = null;
    if (body && body.page_size) v_page_size = body.page_size;
    //console.log('v_page_size === ', v_page_size);

    if (v_page_size) {
        v_page_size = v_page_size.toString().trim().split('.')[0].trim();
        if (v_page_size.length > 0) {
            const n_page_size = Number(v_page_size);
            if (isNaN(n_page_size) || n_page_size < 1) {
                res.json({ ok: false, code: 'ERR_CONFIG_PAGE_NUMBER', message: 'Config page_size must be > 0' });
                return;
            } else if (n_page_size > 0) {
                //console.log('n_page_size === ', n_page_size);
                page_size = n_page_size;
            }
        }
    }

    //#endregion

    const config_ = {
        cache: str_api,
        action: str_action,
        path: path,
        query: query,
        page_number: page_number,
        page_size: page_size,
        body: body,
        fn_map: fn_map,
        fn_conditions: fn_conditions
    };

    func = 'http___' + str_api.toLowerCase() + '_' + str_action;
    if (api[func] == null && api['http___cache_' + str_action]) func = 'http___cache_' + str_action;

    if (api[func] == null)
        return res.json({ ok: false, message: 'Cannot find API: ' + func + ', http___cache_' + str_action, time: new Date().toLocaleString() });
    try {
        api[func](api, req, res, config_, body);
    } catch (err) {
        return res.json({ ok: false, message: 'ERROR_EXECUTE_API: ' + err.message, time: new Date().toLocaleString() });
    }
}