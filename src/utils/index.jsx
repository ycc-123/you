export const queryString = () => {
    let _queryString = {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [ _queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};


/**
 * [GetQueryString description]   获取url字符串的参数
 * @param {[type]} url:       String        [description]
 * @param {[type]} name:      String        [description]
 */
export const GetQueryString = (url, name) => {
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = url.match(reg);
    if(r!=null)return unescape(r[2]); 
    return null;
}


//清除cookie函数
export const clearAllCookie = () => {
    document.cookie = 'JSESSIONID=0;expires=' + new Date(0).toUTCString()
}
