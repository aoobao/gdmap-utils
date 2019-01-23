import {
  getMergeObject,
  getDefaultByundefined
} from '../../js/utils.js'
import Overlays from '../base/Overlays'
import Polyrect from '../Polyrect/Polyrect'
/**
 * opt :
 * map
 * strokeColor
 * strokeOpacity
 * strokeWeight
 * fillColor
 * fillOpacity
 * textOption
 * textClass
 * useCanvas
 * click
 * mouseover
 * mouseout
 */
export default class PolyrectList extends Overlays {
  constructor(opt) {
    super(opt)
    this._clickHandle = this._clickHandle.bind(this)
    this._mouseOut = this._mouseOut.bind(this)
    this._mouseOver = this._mouseOver.bind(this)
    this._initialize(opt || {})
  }

  _clickHandle(extData, e, polyrect) {
    typeof this._click === 'function' && this._click.call(this, polyrect, e)
  }
  _mouseOut(extData, e, polyrect) {
    typeof this._mouseout === 'function' && this._mouseout.call(this, polyrect, e)
  }
  _mouseOver(extData, e, polyrect) {
    typeof this._mouseover === 'function' && this._mouseover.call(this, polyrect, e)
  }
  _initialize(opt) {
    this._strokeColor = opt.strokeColor || '#f00'
    this._strokeOpacity = getDefaultByundefined(opt.strokeOpacity, 0.8)
    this._strokeWeight = getDefaultByundefined(opt.strokeWeight, 1)
    this._fillColor = opt.fillColor || 'blue'
    this._fillOpacity = getDefaultByundefined(opt.fillOpacity, 0.2)
    this._textOption = opt.textOption

    this._click = opt.click
    this._mouseover = opt.mouseover
    this._mouseout = opt.mouseout

    this._useCanvas = getDefaultByundefined(opt.useCanvas, false)
    this._textClass = opt.textClass

    this._polyrects = []
  }

  getPolygonStyle() {
    return {
      strokeColor: this._strokeColor,
      strokeOpacity: this._strokeOpacity,
      strokeWeight: this._strokeWeight,
      fillColor: this._fillColor,
      fillOpacity: this._fillOpacity
    }
  }

  setPolygonStyle(opt = {}) {
    const KEY_LIST = ['fillColor', 'fillOpacity', 'strokeColor', 'strokeOpacity', 'strokeWeight']
    if (this.__changeOptions(opt, KEY_LIST)) {
      if (this._polyrects && this._polyrects.length > 0) {
        this._polyrects.forEach(polyrect => {
          polyrect.setPolygonStyle(opt)
        })
      }
    }
  }

  /**
   * 
   * @param {Array(opt)} list 
   * opt :
   * checkCoordinate
   * coordinate
   * longitude
   * latitude
   * strokeColor
   * strokeWeight
   * strokeOpacity
   * fillColor
   * fillOpacity
   * textOption
   * textClass
   * extData
   */
  setData(list) {
    this.clear()
    let g = getDefaultByundefined
    this._polyrects = list.map(item => {
      let opt = {
        map: this.getMap(),
        checkCoordinate: item.checkCoordinate,
        coordinate: item.coordinate,
        position: item.position,
        strokeColor: g(item.strokeColor, this._strokeColor),
        strokeWeight: g(item.strokeWeight, this._strokeWeight),
        strokeOpacity: g(item.strokeOpacity, this._strokeOpacity),
        fillColor: g(item.fillColor, this._fillColor),
        fillOpacity: g(item.fillOpacity, this._fillOpacity),
        textOption: getMergeObject(this._textOption, item.textOption),
        textClass: g(item.textClass, this._textClass),
        useCanvas: this._useCanvas,
        click: this._clickHandle,
        mouseout: this._mouseOut,
        mouseover: this._mouseOver,
        extData: item.extData || item,
        zIndex: item.zIndex || this.getzIndex()
      }
      return new Polyrect(opt)
    })
  }

  getPolyrects() {
    let list = this._polyrects || []
    return [...list]
  }

  showText() {
    let list = this.getPolyrects()
    list.forEach(polyrect => {
      let text = polyrect.getText()
      if (text) text.setMap(this.getMap())
    })
  }

  hideText() {
    let list = this.getPolyrects()
    list.forEach(polyrect => {
      let text = polyrect.getText()
      if (text) text.setMap(null)
    })
  }

  clear() {
    let list = this.getOverlays()
    if (list && list.length > 0) {
      list.forEach(polyrect => {
        polyrect.destroy()
      })
      this.setOverlays([])
    }
  }

  getOverlays() {
    return this.getPolyrects()
  }

  destroy() {
    super.destroy()
  }

}