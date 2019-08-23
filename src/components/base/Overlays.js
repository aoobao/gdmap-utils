/**
 * 地图覆盖物基类
 */
export default class Overlays {
  constructor(opt) {
    this.__initialize(opt || {})
  }

  __initialize(opt) {
    this.CLASS_NAME = this.constructor.name
    this.__map = opt.map || null
    this.__position = opt.position
    this.__zIndex = opt.zIndex || 10
    this.__extData = opt.extData
    if (opt.map) {
      setTimeout(() => {
        this.setMap(opt.map)
      }, 1);
    }
  }
  // 对overlays递归调用methodName方法.
  __callMethod(overlays, methodName, ...methodArguments) {
    if (overlays === null) return
    if (Array.isArray(overlays)) {
      overlays.forEach(o => {
        // o[methodName](...methodArguments)
        this.__callMethod(o, methodName, ...methodArguments)
      })
    } else if (typeof overlays === 'object') {
      if (typeof overlays[methodName] === 'function') {
        overlays[methodName](...methodArguments)
      } else {
        console.warn('对象找不到方法:' + methodName, overlays)
      }
    } else {
      console.warn('传入值不是实例对象', overlays)
    }
  }

  // 批量赋值,假定传入的参数在内部均为开头加上 _
  __changeOptions(opt, keyList = null) {
    let isChange = false
    let list = Array.isArray(keyList) ? keyList : Object.keys(opt)
    list.forEach(key => {
      if (!(key in opt)) return
      let sourceKey = '_' + key
      let value = this[sourceKey]
      if (value === undefined) {
        console.warn('未找到该字段属性:' + key)
      }
      if (value !== opt[key]) {
        this[sourceKey] = opt[key]
        isChange = true
      }
    })
    return isChange

  }

  getzIndex() {
    return this.__zIndex
  }

  setzIndex(zIndex) {
    this.__zIndex = zIndex
    let overlays = this.getOverlays()
    this.__callMethod(overlays, 'setzIndex', zIndex)
  }

  // 获取自定义对象
  getExtData() {
    let extData = this.__extData
    if (typeof extData === 'function') {
      let data = extData()
      return data
    }
    return extData
  }
  // 设置自定义对象
  setExtData(data) {
    this.__extData = data
  }
  // 获取经纬度
  getPosition() {
    return this.__position
  }
  // 设置经纬度
  setPosition(position) {
    this.__position
    let overlays = this.getOverlays()
    this.__callMethod(overlays, 'setPosition', position)
  }

  // 获取所有覆盖物方法,内部调用,需要子类自行实现
  getOverlays() {
    return this.__overlays || null
  }

  // 设置所有覆盖物 内部调用.
  setOverlays(overlays) {
    this.__overlays = overlays
  }

  isShow() {
    return this.getMap() !== null
  }

  // 显示在地图上.
  setMap(map) {

    this.__map = map
    let overlays = this.getOverlays()
    this.__callMethod(overlays, 'setMap', map)
  }

  getMap() {
    return this.__map || null
  }

  // 销毁
  destroy() {
    this.setMap(null)
  }
}