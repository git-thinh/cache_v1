function(api, req, res) {
    if (api == null || req == null || res == null) return null;

    const data = req.body;
    const api_name = req.params.api_name.toUpperCase();

    if(res) res.json({ ok: true, time: new Date().toLocaleString() });
}