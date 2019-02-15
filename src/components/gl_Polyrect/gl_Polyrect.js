import gl_Overlays from '../base/gl_Overlays'
import {
  getDefaultByundefined,
  transposePolyrect
} from '../../js/utils'
import NormalText from '../NormalText/NormalText.js'
/**
 * opt :
 * map 必传
 * object3DLayer
 * coordinate
 * color
 * height
 * transparent
 * extData
 * 
 * position
 * textOption
 * textClass
 */
export default class gl_Polyrect extends gl_Overlays {
  constructor(opt) {
    super(opt)
    this._initialize(opt || {})
    this._clickHandle = this._clickHandle.bind(this)
  }
  _initialize(opt) {
    this._height = opt.height || 5000
    this._color = opt.color || '#0088ffcc'

    this._transparent = getDefaultByundefined(opt.transparent, true)
    let list = transposePolyrect(opt.coordinate)
    this._coordinate = this.lngLatToGeodeticCoord(list)

    this._click = opt.click

    this._position = opt.position
    this._textOption = opt.textOption || {
      text: opt.text || '未输入文字内容',
      textColor: opt.textColor || 'red'
    }
    let TextClass = getDefaultByundefined(opt.textClass, NormalText)
    if (TextClass) this._createText(TextClass)
  }
  _clickHandle() {

  }
  _createText(TextClass) {
    if (this._textObj) {
      typeof this._textObj.destroy === 'function' && this._textObj.destroy()
      this._textObj = null
    }
    let opt = {
      map: this.getMap(),
      position: this._position,
      ...this._textOption
    }
    this._textObj = new TextClass(opt)
  }
  getOverlays() {
    let prism = this._prism
    if (!prism) {
      prism = new AMap.Object3D.Prism({
        path: this._coordinate,
        height: this._height,
        color: this._color
      })
      prism.transparent = this._transparent
      this._prism = prism
    }
    // console.log(prism)
    return prism
  }

  show() {
    super.show()
    if (this._textObj) {
      this._textObj.setMap(this.getMap())
    }
  }

  hide() {
    super.hide()
    if (this._textObj) {
      this._textObj.setMap(null)
    }
  }

  getText() {
    return this._textObj || null
  }

  lngLatToGeodeticCoord(list) {
    let map = this.getMap()
    for (let i = 0; i < list.length; i++) {
      const area = list[i];
      for (let s = 0; s < area.length; s++) {
        var g = map.lngLatToGeodeticCoord(area[s])
        area[s] = g
      }
    }
    return list
  }
}