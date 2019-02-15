export default class gl_Overlays {
  constructor(opt) {
    this.__initialize(opt || {})
  }
  __initialize(opt) {
    this.CLASS_NAME = this.constructor.name
    this.__object3DLayer = opt.object3DLayer
    this.__map = opt.map
    this.__extData = opt.extData
  }
  // 对overlays递归调用methodName方法.
  /**
   * 
   * @param {Object} overlays 
   * @param {Function} method 
   * @param {*} methodArguments 
   */
  __callMethod(obj, methodName, overlays) {
    if (overlays == null) return
    if (Array.isArray(overlays)) {
      overlays.forEach(o => {
        // o[methodName](...methodArguments)
        this.__callMethod(obj, methodName, o)
      })
    } else if (overlays != undefined) {
      // method(overlays, ...methodArguments)
      obj[methodName](overlays)
    } else {
      console.warn('传入值不是实例对象', overlays)
    }
  }
  getExtData() {
    return this.__extData
  }
  setExtData(data) {
    this.__extData = data
  }
  getMap() {
    return this.__map
  }
  setMap(map) {
    this.__map = map
  }
  getObject3DLayer() {
    return this.__object3DLayer || null
  }
  setObject3DLayer(object3dLayer) {
    this.__object3DLayer = object3dLayer
  }
  // object3d
  getOverlays() {
    return this.__overlays
  }
  setOverlays(overlays) {
    this.__overlays = overlays
  }
  show() {
    let object3DLayer = this.__object3DLayer
    if (object3DLayer) {
      let overlays = this.getOverlays()
      // this.__callMethod(overlays, object3DLayer.add)
      this.__callMethod(object3DLayer, 'add', overlays)
    }
  }
  hide() {
    let object3DLayer = this.__object3DLayer
    if (object3DLayer) {
      let overlays = this.getOverlays()
      // this.__callMethod(overlays, object3DLayer.remove)
      this.__callMethod(object3DLayer, 'remove', overlays)
    }
  }
  destroy() {
    this.hide()
    this.__object3DLayer = null
  }
}