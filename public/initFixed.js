// eslint-disable-next-line no-extend-native
Number.prototype.toFixed = function (s) {
  var that = this, changenum, index;

  // 负数
  if (this < 0) {
    that = -that;
  }

  changenum = (parseInt(that * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();

  index = changenum.indexOf(".");

  if (index < 0 && s > 0) {

    changenum = changenum + ".";

    for (var i = 0; i < s; i++) {
      changenum = changenum + "0";
    }

  } else {

    index = changenum.length - index;

    for (var i = 0; i < (s - index) + 1; i++) {
      changenum = changenum + "0";
    }
  }

  if (this < 0) {
    return -changenum;
  } else {
    return changenum;
  }
}