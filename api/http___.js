function(api, req, res, config) {
    if (api == null || req == null || res == null) return null;

    let str_api, str_action;
    if (req.query && req.query.api && req.query.action) {
        str_api = req.query.api.toUpperCase();
        str_action = req.query.action.toLowerCase();
    }

    if (str_api == null || str_api.length == 0 ||
        str_action == null || str_action.length == 0)
        return res.json({ ok: false, message: 'URI must be format is /?api=...&action=...', time: new Date().toLocaleString() });


    let path = req.originalUrl;
    if (path.startsWith('/?')) path = path.substr(2);
    path = path.split('&&').join('^^');

    const a = path.split('&');
    const query = {};
    let k, v, pos = -1;
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

    const config_ = {
        cache: str_api,
        action: str_action,
        path: path,
        query: query
    };

    func = 'http___' + str_api.toLowerCase() + '_' + str_action;
    if (api[func] == null && api['http___cache_' + str_action]) func = 'http___cache_' + str_action;

    if (api[func] == null)
        return res.json({ ok: false, message: 'Cannot find API: ' + func + ', http___cache_' + str_action, time: new Date().toLocaleString() });
    try {
        api[func](api, req, res, config_);
    } catch (err) {
        return res.json({ ok: false, message: 'ERROR_EXECUTE_API: ' + err.message, time: new Date().toLocaleString() });
    }
}