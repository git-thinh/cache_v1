function(api, req, res) {
    if (api == null || req == null || res == null) return null;

    let str_api, str_action;
    if (req.query && req.query.api && req.query.action) {
        str_api = req.query.api;
        str_action = req.query.action;
    }

    if (str_api == null || str_api.length == 0 ||
        str_action == null || str_action.length == 0)
        return res.json({ ok: false, message: 'URI must be format is /?api=...&action=...', time: new Date().toLocaleString() });

    func = (str_api + '___' + str_action).toLowerCase();
    if (api[func] == null)
        return res.json({ ok: false, message: 'Cannot find API: ' + func, time: new Date().toLocaleString() });

    try {
        api[func](api, req, res);
    } catch (err) {
        return res.json({ ok: false, message: 'ERROR_EXECUTE_API: ' + err.message, time: new Date().toLocaleString() });
    }
}