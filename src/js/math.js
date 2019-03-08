/**
 * 3个数中取中位数
 * @param {Number} a 
 * @param {Number} b 
 * @param {Number} c 
 */
export function getMedian(a, b, c) {
  if ((b - a) * (a - c) >= 0) {
    return a;
  } else if ((a - b) * (b - c) >= 0) {
    return b;
  } else {
    return c;
  }
}