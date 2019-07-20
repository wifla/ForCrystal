function commentTimeHandle(dateStr) {
  let publishTime = dateStr / 1000,
    date = new Date(dateStr),
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  if (M < 10) {
    M = '0' + M;
  }
  if (D < 10) {
    D = '0' + D;
  }
  if (H < 10) {
    H = '0' + H;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }
  var nowTime = new Date().getTime() / 1000,
    diffValue = nowTime - publishTime,
    diff_days = parseInt(diffValue / 86400),
    diff_hours = parseInt(diffValue / 3600),
    diff_minutes = parseInt(diffValue / 60),
    diff_secodes = parseInt(diffValue);

  if (diff_days > 0 && diff_days < 3) {
    return diff_days + "天前";
  } else if (diff_days <= 0 && diff_hours > 0) {
    return diff_hours + "小时前";
  } else if (diff_hours <= 0 && diff_minutes > 0) {
    return diff_minutes + "分钟前";
  } else if (diff_secodes < 60) {
    if (diff_secodes <= 0) {
      return "刚刚";
    } else {
      return diff_secodes + "秒前";
    }
  } else if (diff_days >= 3 && diff_days < 30) {
    return M + '-' + D + ' ' + H + ':' + m;
  } else if (diff_days >= 30) {
    return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
  }
}

module.exports = {
  timeHandle: commentTimeHandle
}