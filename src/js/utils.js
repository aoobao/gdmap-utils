/**
 * 如果value为undefined则返回ifundefineValue,否则返回value
 * @param {*} value 传入值
 * @param {*} ifundefineValue 默认值
 */
export function getDefaultByundefined(value, ifundefineValue) {
  return value === undefined ? ifundefineValue : value
}

/**
 * 将字符串形式经纬度网格转为数组形式
 * x1,y1;x2,y2,..|xn,yn;xn+1,yn+1..
 * @param {String} coordinate 
 * @param {String} sep
 * @returns {Array}[[[x1,y1],[x2,y2],...],[[xn,yn],[xn+1,yn+1],...]]
 */
export function transposePolyrect(coordinate, sep = '|') {
  var arr = []
  let pattern = /\d+(\.\d+)?/g
  if (typeof coordinate === 'string') {
    let temp = coordinate.split(sep)
    temp.forEach(t => {
      if (t) {
        let re = [];
        let mat = t.match(pattern);
        for (var i = 1; i < mat.length; i += 2) {
          var x = parseFloat(mat[i - 1]);
          var y = parseFloat(mat[i]);
          re.push([x, y]);
        }
        arr.push(re)
      }
    })
  } else {
    console.warn('经纬度格式有误:', coordinate)
  }
  return arr;
}
/**
 * 获取字符串的宽度
 * @param {String} str 
 */
export function getTextWidth(str, fontSize = 20) {
  if (!str) return 0;
  let temp = str.replace(/[^\\x00-\\xff]/g, 'aa')
  return (temp.length * fontSize) / 2
}

/**
 * 筛选出修改目标opt的不相同的属性
 * @param {Object} targetOpt 目标opt
 * @param {Object} changeOpt 需要改变的opt
 * @returns {Object} 返回差异对象(changeopt中的属性值和targetOpt中相同时返回null)
 */
export function getDiffObject(targetOpt, changeOpt) {
  let rst = {}
  let changeFlag = false
  for (let key in changeOpt) {
    let targetValue = targetOpt[key]
    if (targetValue === undefined) {
      console.warn('目标对象未找到该参数:' + key)
    }
    let value = changeOpt[key]
    if (targetValue !== value) {
      rst[key] = value
      changeFlag = true
    }
  }
  return changeFlag ? rst : null
}
/**
 * 返回两个区域的交集
 * @param {*} parentMin 
 * @param {*} parentMax 
 * @param {*} min 
 * @param {*} max 
 */
export function getIntersection(parentMin, parentMax, min, max) {
  let minZoom = parentMin < min ? min : parentMin
  let maxZoom = parentMax > max ? max : parentMax
  return {
    minZoom,
    maxZoom
  }
}
// 合并obj
export function getMergeObject(...objs) {
  let rst = objs.reduce((pre, sur) => {
    if (!sur) return pre
    return {
      ...pre,
      ...sur
    }
  }, {})
  return rst
}

// 求角度
export function getAngle(px, py, mx, my) {
  var x = Math.abs(px - mx);
  var y = Math.abs(py - my);
  var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  if (z == 0) return 0;
  var cos = y / z;
  var radina = Math.acos(cos); //用反三角函数求弧度

  var angle = 180 * radina / Math.PI; //将弧度转换成角度
  //因为算出来的值是[0,90),需要转成[0,360)
  if (mx >= px) {
    if (my >= py) {
      angle = 90 - angle;
    } else {
      angle = 270 + angle;
    }
  } else {
    if (my >= py) {
      angle = 90 + angle;
    } else {
      angle = 270 - angle;
    }
  }
  return angle;
}


export function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}