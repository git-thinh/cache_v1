function(api, req, res, config) {
    if (api == null || req == null || res == null) return null;

    let str_api, str_action;
    if (req.query && req.query.api && req.query.action) {
        str_api = req.query.api;
        str_action = req.query.action.toLowerCase();
    }

    if (str_api == null || str_api.length == 0 ||
        str_action == null || str_action.length == 0)
        return res.json({ ok: false, message: 'URI must be format is /?api=...&action=...', time: new Date().toLocaleString() });

    const config_ = {
        cache: str_api.toUpperCase(),
        action: str_action
    };

    func = 'http___' + str_api + '_' + str_action;
    if (str_action == 'search') func = 'http___cache_search';

    func = func.toLowerCase();
    if (api[func] == null)
        return res.json({ ok: false, message: 'Cannot find API: ' + func, time: new Date().toLocaleString() });

    try {
        api[func](api, req, res, config_);
    } catch (err) {
        return res.json({ ok: false, message: 'ERROR_EXECUTE_API: ' + err.message, time: new Date().toLocaleString() });
    }
}