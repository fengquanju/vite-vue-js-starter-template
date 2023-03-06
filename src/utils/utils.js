import sha1 from 'js-sha1';
import md5 from 'js-md5';
export function RandomString(len) {
  len = typeof len !== 'undefined' ? len : 32;
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = chars.length;
  var tmp = '';
  for (var i = 0; i < len; i++) {
    var index = Math.floor(Math.random() * maxPos);
    tmp += chars.charAt(index);
  }
  return tmp;
}
export function createSign(obj) {
  // 处理时间
  if (obj.timestamp) obj.timestamp = parseInt(obj.timestamp / 1000);

  var arr = [];
  for (var item in obj) {
    arr.push(obj[item]);
    arr.sort();
  }
  var arrString = arr.join('');
  var sha1Str = sha1(arrString);
  var md5Str = md5(sha1Str);
  var signStr = md5Str.toUpperCase();
  return signStr;
}
