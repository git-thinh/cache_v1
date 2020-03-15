function(api, col, obj, val) {
    if (col && obj && obj[col] && obj[col].length > 0) return '';
    return 'Value of ' + col + ' is not empty';
}