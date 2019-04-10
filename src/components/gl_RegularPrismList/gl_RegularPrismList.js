import gl_Overlays from '../base/gl_Overlays'
import gl_RegularPrism from '../gl_RegularPrism/gl_RegularPrism'
import {
  getDefaultByundefined,
  uuid
} from '../../js/utils'
import {
  getMedian
} from '../../js/math'
/**
 * opt
 * map 必传
 * object3DLayer
 * radius : Int 半径
 * height : Int 高度
 * segment : Int 分割数量
 * topColor :Array<Number> [r,g,b,q] rgba (0-1之间取值) 必须4个值
 * topFaceColor : 同上
 * bottomColor : 同上
 * color : 颜色(优先使用上面的颜色)
 * transparent Bool 透明
 * click function 点击
 * mouseover function 移入
 * mouseout function 移出
 */
export default class gl_RegularPrismList extends gl_Overlays {
  constructor(opt) {
    if (!opt.object3DLayer) {
      opt.object3DLayer = new AMap.Object3DLayer()
      opt.object3DLayer.setMap(opt.map)
    }
    super(opt)
    this._initialize(opt || {})
  }
  _initialize(opt) {
    this._height = getDefaultByundefined(opt.height, 1000)
    this._radius = getDefaultByundefined(opt.radius, 1000)
    this._segment = getDefaultByundefined(opt.segment, 4)
    this._transparent = getDefaultByundefined(opt.transparent, true)
    this._color = opt.color || [0, 0, 1, 0.4]
    this._topColor = opt.topColor
    this._bottomColor = opt.bottomColor
    this._topFaceColor = opt.topFaceColor
    this._click = opt.click
    this._mouseover = opt.mouseover
    this._mouseout = opt.mouseout
    this.__activePrism = null
    this._animateCache = {}
    this._initEvent()
  }
  // 初始化鼠标事件
  _initEvent() {
    if (typeof this._click === 'function') {
      this.getMap().on('click', this._clickHandle, this)
    }
    if (typeof this._mouseover === 'function' || typeof this._mouseout === 'function') {
      this.getMap().on('mousemove', this._mouseMove, this)
    }
  }
  _clickHandle(e) {
    let map = this.getMap()
    let mesh = map.getObject3DByContainerPos(e.pixel, [this.getObject3DLayer()], false)
    if (mesh != null && mesh.object.__class) {
      let prism = mesh.object.__class
      typeof this._click === 'function' && this._click(prism, mesh)
    }
  }

  _mouseMove(e) {
    let map = this.getMap()
    let mesh = map.getObject3DByContainerPos(e.pixel, [this.getObject3DLayer()], false)
    if (mesh != null && mesh.object.__class) {
      let prism = mesh.object.__class
      if (this.__activePrism != prism) {
        if (this.__activePrism) {
          typeof this._mouseout === 'function' && this._mouseout(this.__activePrism)
          this.__activePrism = null
        }
        this.__activePrism = prism
        typeof this._mouseover === 'function' && this._mouseover(prism)
      }
    } else {
      if (this.__activePrism) {
        typeof this._mouseout === 'function' && this._mouseout(this.__activePrism)
        this.__activePrism = null
      }
    }
  }

  getTopColor() {
    return this._topColor || this._color
  }

  getBottomColor() {
    return this._bottomColor || this._color
  }

  getTopFaceColor() {
    return this._topFaceColor || this._color
  }

  setData(list, show = true) {
    this.clear()
    this._meshs = list.map(item => {
      let height = item.height || this._height
      let opt = {
        map: this.getMap(),
        object3DLayer: this.getObject3DLayer(),
        position: item.position,
        radius: item.radius || this._radius,
        height: height,
        segment: item.segment || this._segment,
        topColor: item.topColor || this.getTopColor(),
        bottomColor: item.bottomColor || this.getBottomColor(),
        topFaceColor: item.topFaceColor || this.getTopFaceColor(),
        transparent: getDefaultByundefined(item.transparent, this._transparent),
        extData: item.extData || item
      }
      let mesh = new gl_RegularPrism(opt)
      // mesh.__id = Math.random()
      mesh.__id = uuid()
      return mesh
    })
    if (show) {
      this.show()
    }
  }

  updateHeight(list, equalsFunc = equals, animate = 20000) {
    let meshs = [...this._meshs]
    list.forEach(item => {
      for (let i = 0; i < meshs.length; i++) {
        const mesh = meshs[i]
        let data = mesh.getExtData()
        if (equalsFunc(item, data)) {
          if (animate) {
            let id = mesh.__id
            if (this._animateCache[id]) {
              this._animateCache[id].sourceHeight = item.height
            } else {
              this._animateCache[id] = {
                mesh,
                sourceHeight: item.height,
                step: animate,
                index: null
              }
              this._animateHeight(id)
            }
          } else {
            mesh.setHeight(item.height)
          }
          meshs.slice(i, 1)
          break
        }
      }
    })
  }

  /**
   * 更新颜色
   * opt : colorOpt or Array<colorOpt>(当为数组时,colorOpt可以添加标记字段(如id),在equalsFunc中判断返回相同mesh的对象设置颜色)
   * topColor :Array<Number> [r,g,b,q] rgba (0-1之间取值) 必须4个值
   * topFaceColor : 同上
   * bottomColor : 同上
   * color : 颜色(优先使用上面的颜色)
   *
   * @param {Array/Object} opt
   * @param {Function} equalsFunc
   */
  updateColor(opt, equalsFunc = equals) {
    if (Array.isArray(opt)) {
      let meshs = [...this._meshs]
      let list = opt
      list.forEach(item => {
        for (let i = 0; i < meshs.length; i++) {
          const mesh = meshs[i]
          let data = mesh.getExtData()
          if (equalsFunc(item, data)) {
            mesh.setColor(item)
            meshs.slice(i, 1)
            break
          }
        }
      })
    } else {
      this._meshs.forEach(mesh => {
        mesh.setColor(opt)
      })
    }
  }

  /**
   * 更新几何体半径(当opt为数组时,代表每个几何体单独半径设置,可标记相应字段再equalsFunc中比对,默认为id)
   * @param {Array/Object} opt
   * @param {Function} equalsFunc
   */
  updateRadius(opt, equalsFunc = equals) {
    if (Array.isArray(opt)) {
      let meshs = [...this._meshs]
      let list = opt
      list.forEach(item => {
        for (let i = 0; i < meshs.length; i++) {
          const mesh = meshs[i]
          let data = mesh.getExtData()
          if (equalsFunc(item, data)) {
            mesh.setRadius(item.radius)
            meshs.slice(i, 1)
            break
          }
        }
      })
    } else {
      this._meshs.forEach(mesh => {
        mesh.setRadius(opt.radius)
      })
    }
  }

  _animateHeight(id) {
    let source = this._animateCache[id]
    let mesh = source.mesh
    let sourceHeight = source.sourceHeight
    let height = mesh.getHeight()
    let step = source.step
    let stepHeight = sourceHeight > height ? height + step : height - step
    let nextHeight = getMedian(height, stepHeight, sourceHeight)
    mesh.setHeight(nextHeight)
    if (nextHeight !== sourceHeight) {
      this._animateCache[id].index = requestAnimationFrame(() => {
        this._animateHeight(id)
      })
    } else {
      delete this._animateCache[id]
    }
  }

  getOverlays() {
    if (this._meshs && this._meshs.length) {
      return this._meshs.map(t => {
        return t.getOverlays()
      })
    } else {
      return null
    }
  }

  clear() {
    if (this._meshs && this._meshs.length) {
      this._meshs.forEach(mesh => {
        mesh.destroy()
      })
      this._meshs = []
    }
  }

  destroy() {
    this.__map.off('mousemove', this._mouseMove, this)
    this.__map.off('click', this._clickHandle, this)
    for (const id in this._animateCache) {
      const mesh = this._animateCache[key]
      if (mesh.index) cancelAnimationFrame(mesh.index)
    }
    super.destroy()
  }
}

function equals(listData, extData) {
  return listData.id === extData.id
}