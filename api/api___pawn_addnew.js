function(api, req, res, config, body, callback) {
    if (api == null || req == null || res == null || config == null) 
        return { ok: false, message: 'api or req or res or config or body is null' };

    try {
        const api_name = config.cache;
        const _self = api.cache[api_name];
        const LOG_KEY = api_name + '_' + config.action;
        if (_self == null)
            return { ok: false, request: config, time: new Date().toLocaleString(), message: 'Cannot find cache ' + config.cache };

        if (body == null || Object.keys(body).length == 0)
            return { ok: false, message: 'Data body is null' };

        const client = _self.get_client();
        const db = _self.get_client();
        const ready = _self.ready;
        const busy = _self.busy;

        if (ready == false)
            return { ok: false, message: api_name + ' is not ready' };

        if (busy)
            return { ok: false, message: api_name + ' is busy' };

        const cf = _self.get_config();
        if (cf == null || cf.config == null)
            return { ok: false, message: api_name + '.config is null' };

        const schema = cf.config.schema;
        if (schema == null)
            return { ok: false, message: api_name + '.config.schema is null' };
        
        const o = JSON.parse(JSON.stringify(schema));
        for (var col in body) {
            if (o.hasOwnProperty(col) == false)
                return { ok: false, message: col + ' is not exist', data: o };

            if (body[col] == null)
                return { ok: false, message: 'Value of ' + col + ' is null', data: o };

            if (typeof body[col] != typeof o[col])
                return { ok: false, message: 'Data type of ' + col + ' is wrong', data: o };

            o[col] = body[col];
        }

        for (var col in o) {
            const v_ = o[col];
            switch (v_) {
                case '-1|yyMMdd':
                    break;
                case '-1|yyyyMMdd':
                    break;
                case '-1|hhmmss':
                    break;
                case '-1|yyyyMMddhhmmss':
                    break;
                case '-1|yyMMddhhmmss':
                    break;
                case 'yyyyMMdd':
                    break;
                case 'yyMMdd':
                    break;
                case 'hhmmss':
                    break;
                case 'yyMMddhhmmss':
                    break;
                case 'KEY_IDENTITY':
                    break;
                default:

                    break;
            }
        }

        const m = { ok: false, data: o };
        return m;

    } catch (e) {
        return { ok: false, message: e.message, err: e };
    }
}