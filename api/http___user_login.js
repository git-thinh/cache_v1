﻿function(api, req, res, config, body) {
    const LOG_KEY = 'user_login';
    if (api == null || req == null || res == null) return null;

    console.log(LOG_KEY, new Date().toLocaleString());

    if (res)
        res.json({ ok: true, time: new Date().toLocaleString() });
}