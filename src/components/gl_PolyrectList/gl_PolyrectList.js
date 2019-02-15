import gl_Overlays from '../base/gl_Overlays'
import gl_Polyrect from '../gl_Polyrect/gl_Polyrect'
import {
  getMergeObject,
  getDefaultByundefined
} from '../../js/utils'
/**
 * opt
 * map 必传
 * object3DLayer
 * color
 * height
 * transparent
 * textOption
 * textClass
 * click
 */
export default class gl_PolyrectList extends gl_Overlays {
  constructor(opt) {
    if (!opt.object3DLayer) {
      opt.object3DLayer = new AMap.Object3DLayer();
      opt.object3DLayer.setMap(opt.map)
    }
    super(opt)
    this._clickHandle = this._clickHandle.bind(this)
    this._initialize(opt)
  }
  _initialize(opt) {
    this._height = opt.height || 5000
    this._color = opt.color || '#0088ffcc'
    this._transparent = getDefaultByundefined(opt.transparent, true)
    this._textOption = opt.textOption
    this._textClass = opt.textClass
    this._click = opt.click
    this._polyrects = []
  }

  _clickHandle(polyrect, data) {
    typeof this._click === 'function' && this._click(polyrect, data)
  }

  /**
   * 
   * @param {Array(opt)} list 
   * opt : 
   * coordinate 必传
   * color
   * height
   * transparent
   * extData
   * textOption
   * position 有文字需传
   * textClass
   */
  setData(list, show = true) {
    this.clear()
    let g = getDefaultByundefined
    this._polyrects = list.map(item => {
      let opt = {
        map: this.getMap(),
        object3DLayer: this.getObject3DLayer(),
        coordinate: item.coordinate,
        color: g(item.color, this._color),
        height: g(item.height, this._height),
        transparent: g(item.transparent, this._transparent),
        extData: item.extData || item,
        position: item.position,
        textClass: g(item.textClass, this._textClass),
        textOption: getMergeObject(this._textOption, item.textOption)
      }
      return new gl_Polyrect(opt)
    })

    if (show) {
      this.show()
    }
  }

  getOverlays() {
    // return [...this._polyrects]
    return this._polyrects.map(polyrect => {
      return polyrect.getOverlays()
    })
  }

  clear() {
    let list = this.getOverlays()
    if (list && list.length) {
      list.forEach(polyrect => {
        polyrect.destroy()
      })
    }
    this._polyrects = []
  }

  destroy() {
    super.destroy()
  }
}