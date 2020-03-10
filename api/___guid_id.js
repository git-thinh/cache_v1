function (api, obj) {
    if (api == null || obj == null) return null;

    let api_id = obj;
    if (api_id == null || api_id == 0) api_id = 99;

    api.id___++;
    if (api.id___ > 999) api.id___ = 100;

    const d = new Date();
    const id = api_id + '' +
        d.toISOString().slice(-24).replace(/\D/g, '').slice(2, 8) + '' +
        d.toTimeString().split(' ')[0].replace(/\D/g, '') + '' + api.id___;

    return Number(id);
}