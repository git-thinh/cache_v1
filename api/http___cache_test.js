function(api, req, res, config) {
    const LOG_KEY = 'api_test';
    if (api == null || req == null || res == null) return null;

    console.log(LOG_KEY, new Date().toLocaleString());

    if (res)
        res.json({ ok: true, time: new Date().toLocaleString() });
}