/**
 * 基类设置minZoom和maxZoom后(自动在地图上显示/隐藏),有逻辑隐患(当外部人为调用setMap显示或隐藏时有冲突)
 * 暂时废弃,自动显示/隐藏功能后面单独开发类去实现
 */

import {
  MIN_ZOOM,
  MAX_ZOOM
} from './Enum'

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
    this.__minZoom = opt.minZoom || MIN_ZOOM
    this.__maxZoom = opt.maxZoom || MAX_ZOOM
    this.__show = false
    if (opt.map) {
      setTimeout(() => {
        this.setMap(opt.map)
      }, 1);
    }
  }

  // 存在method1 运行1,不存在才运行method2 (兼容原生)
  __callMethod2(overlays, method1, method2, ...methodArguments) {
    if (overlays === null) return
    if (Array.isArray(overlays)) {
      overlays.forEach(o => {
        this.__callMethod2(o, method1, method2, ...methodArguments)
      })
    } else if (typeof overlays === 'object') {
      if (typeof overlays[method1] === 'function') {
        overlays[method1](...methodArguments)
      } else if (typeof overlays[method2] === 'function') {
        overlays[method2](...methodArguments)
      } else {
        console.warn('没有找到方法', overlays, method1, method2)
      }
    } else {
      console.warn('传入值不是实例对象', overlays)
    }
  }
  __callMethod(overlays, methodName, ...methodArguments) {
    if (overlays === null) return
    if (Array.isArray(overlays)) {
      overlays.forEach(o => {
        // o[methodName](...methodArguments)
        this.__callMethod(o, methodName, ...methodArguments)
      })
    } else if (typeof overlays === 'object') {
      overlays[methodName](...methodArguments)
    } else {
      console.warn('传入值不是实例对象', overlays)
    }
  }

  // 假定传入的参数在内部均为开头加上 _
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

  // 获取自定义对象
  getExtData() {
    return this.__extData
  }
  // 设置自定义对象
  setExtData(data) {
    this.__extData = data
  }
  // 获取经纬度 暂时不开发设置经纬度(子类需要设置必定重写)
  getPosition() {
    return this.__position
  }

  // 获取所有覆盖物方法,内部调用,需要子类自行实现
  getOverlays() {
    return this.__overlays
  }

  // 设置所有覆盖物 内部调用.
  setOverlays(overlays) {
    this.__overlays = overlays
  }

  isShow() {
    return this.getMap() !== null
  }

  __updateStatus() {
    // if (!this.__map) return
    let needShow = this.__needShow()
    if (needShow ^ this.__show) {
      this.__show = needShow
      if (this.__map) {
        let overlays = this.getOverlays()
        this.__callMethod2(overlays, '__setVisible', 'setMap', needShow ? this.__map : null)
      }
    }
  }


  __needShow() {
    let map = this.getMap()
    if (!map) return false
    let zoom = map.getZoom()
    // console.log(zoom, this.CLASS_NAME)
    return zoom >= this.__minZoom && zoom <= this.__maxZoom
  }

  __setVisible(map) {
    this.__show = !!map
    let overlays = this.getOverlays()
    this.__callMethod2(overlays, '__setVisible', 'setMap', map)
  }

  // 显示在地图上.
  // setMap 只影响__map 属性,不影响__show属性
  // 当对象存在最大最小层级的时候,只对__map赋值,是否显示交给__updateStatus去判断
  // 最终原生对象setMap将直接显示,不会有影响.
  setMap(map) {
    if (map && this.__map) {
      this.__map.off('zoomchange', this.__updateStatus, this)
      this.__map = null
    }
    this.__map = map
    if (map && (this.__minZoom > MIN_ZOOM || this.__maxZoom < MAX_ZOOM)) {
      this.__map.on('zoomchange', this.__updateStatus, this)
      this.__updateStatus()
    } else {
      let overlays = this.getOverlays()
      this.__callMethod(overlays, 'setMap', map)
    }
  }

  getMap() {
    return this.__map || null
  }

  // 销毁
  destroy() {
    this.setMap(null)
  }
}