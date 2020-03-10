function(api, col, obj, val) {
    //console.log(col, val, obj);
    if (col && obj && obj[col]) {
        const v = obj[col];
        if (isNaN(Number(v))) return col + ': Vui lòng nhập số';
        if (Number(v) < val) return col + ': Giá trị phải >= ' + val;
    }
    return '';
}