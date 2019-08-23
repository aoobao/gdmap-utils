// import './Polyrect.scss'
import {
  MIN_ZOOM,
  MAX_ZOOM
} from '../base/Enum'
import {
  getDefaultByundefined,
  transposePolyrect,
  getIntersection
} from '../../js/utils.js'
import Overlays from '../base/Overlays'
import NormalText from '../NormalText/NormalText.js'
/**
 * 后期优化: 最佳做法应该是把canvas和dom渲染模式拆成两个类实现,
 * 后面有时间的话重新写一下
 * opt :
 * map
 * coordinate
 * checkCoordinate
 * strokeColor
 * strokeOpacity
 * strokeWeight
 * fillColor
 * fillOpacity
 * textOption
 * textClass
 * click
 * mouseover
 * mouseout
 * useCanvas
 * canvasDom
 */
export default class Polyrect extends Overlays {
  constructor(opt) {
    super(opt)
    this._clickHandle = this._clickHandle.bind(this)
    this._mouseOut = this._mouseOut.bind(this)
    this._mouseOver = this._mouseOver.bind(this)
    this._initialize(opt || {})
  }
  _initialize(opt) {
    // 网格颜色样式
    this._strokeColor = opt.strokeColor || '#f00'
    this._strokeOpacity = getDefaultByundefined(opt.strokeOpacity, 0.8)
    this._strokeWeight = getDefaultByundefined(opt.strokeWeight, 1)
    this._fillColor = opt.fillColor || 'blue'
    this._fillOpacity = getDefaultByundefined(opt.fillOpacity, 0.2)

    // 文字样式
    this._textOption = opt.textOption || {
      text: opt.text || '未输入文字内容',
      textColor: opt.textColor || 'red'
    }

    // 事件
    this._click = opt.click
    this._mouseover = opt.mouseover
    this._mouseout = opt.mouseout

    // 是否使用canvas绘制
    this._useCanvas = getDefaultByundefined(opt.useCanvas, false)
    // this._canvasDom = opt.canvasDom
    // 网格坐标
    this._coordinate = transposePolyrect(opt.coordinate)
    this._checkCoordinate = transposePolyrect(opt.checkCoordinate || '')
    // 如果有简易网格,创建简易网格绑定事件
    this._createCheckPolygon()
    if (this.isUseCanvas()) {
      this._createCustomLayer() // 后面优化.
    } else {
      this._createPolygon()
      this._overLayGroup = new AMap.OverlayGroup(this._polygons)
    }

    // 创建文字
    let TextClass = getDefaultByundefined(opt.textClass, NormalText)
    if (TextClass) this._createText(TextClass)
  }

  _createText(TextClass) {
    if (this._textObj) {
      typeof this._textObj.destroy === 'function' && this._textObj.destroy()
      this._textObj = null
    }
    if (!TextClass) {
      console.warn('未找到文字对象,检查textClass参数', TextClass)
      return
    }
    let minZoom = getDefaultByundefined(this._textOption.minZoom, MIN_ZOOM)
    let maxZoom = getDefaultByundefined(this._textOption.maxZoom, MAX_ZOOM)
    let zoom = getIntersection(this.__minZoom, this.__maxZoom, minZoom, maxZoom)
    let opt = {
      map: this.getMap(),
      position: this.getPosition(),
      zIndex: this.getzIndex(),
      ...this._textOption,
      ...zoom,
      extData: () => {
        let extData = this.getExtData()
        return extData || null
      }
    }
    this._textObj = new TextClass(opt)
  }

  // 创建简易网格
  _createCheckPolygon() {
    if (!this.hasCheckPolygon()) return
    if (this._checkCoordinate.length > 1) {
      console.warn('checkCoordinate建议设置为单区域简单多边形以提高性能')
    }
    this._checkPolygons = this._checkCoordinate.map(coordinate => {
      let polygon = new AMap.Polygon({
        path: coordinate,
        strokeOpacity: 0,
        strokeWeight: 0,
        fillOpacity: 0,
        zIndex: this.__zIndex + 1,
        bubble: true
      })
      this._addEvent(polygon)
      return polygon
    })
  }

  // 创建区域网格
  _createPolygon() {
    // 如果有简易区域则不需要绑定事件,否则需要绑定事件
    let hasBindEvent = this.hasCheckPolygon()

    this._polygons = this._coordinate.map(coordinate => {
      let polygon = new AMap.Polygon({
        path: coordinate,
        strokeColor: this._strokeColor,
        strokeOpacity: this._strokeOpacity,
        strokeWeight: this._strokeWeight,
        fillColor: this._fillColor,
        fillOpacity: this._fillOpacity,
        zIndex: this.__zIndex,
        bubble: true
      })
      if (!hasBindEvent) this._addEvent(polygon)
      return polygon
    })
  }

  _createCustomLayer() {
    // TODO
    let canvas = this._canvas = document.createElement('canvas')
    this._ctx = canvas.getContext('2d')
    let map = this.getMap()
    if (map) {
      let size = this.getMap().getSize();
      canvas.width = this._canvas_width = size.width;
      canvas.height = this._canvas_height = size.height;
    }
    this._cus = new AMap.CustomLayer(canvas, {
      zIndex: 10
    })
    this._cus.render = this._draw.bind(this)
  }
  _draw() {
    this._clearCanvas(this._ctx)
    this._drawCanvas(this._ctx)
  }

  _clearCanvas(ctx) {
    ctx.clearRect(0, 0, this._canvas_width, this._canvas_height)
  }

  _drawCanvas(ctx) {
    ctx.save()
    ctx.strokeStyle = this._strokeColor
    ctx.lineWidth = this._strokeWeight
    ctx.fillStyle = this._fillColor

    this._coordinate.forEach(arr => {
      let pixels = arr.map(t => this.getMap().lngLatToContainer(t))
      ctx.beginPath()
      ctx.globalAlpha = this._strokeOpacity
      pixels.forEach(pixel => {
        ctx.lineTo(pixel.getX(), pixel.getY())
      })
      ctx.closePath()
      ctx.stroke()
      ctx.globalAlpha = this._fillOpacity
      ctx.fill()
    })
    ctx.restore();
  }

  _addEvent(overlays) {
    overlays.on('mouseover', this._mouseOver)
    overlays.on('mouseout', this._mouseOut)
    overlays.on('click', this._clickHandle)
  }
  // 移出区域
  _mouseOut(e) {
    typeof this._mouseout === 'function' && this._mouseout.call(this, this.getExtData(), e, this)
  }
  // 鼠标移入区域
  _mouseOver(e) {
    typeof this._mouseover === 'function' && this._mouseover.call(this, this.getExtData(), e, this)
  }
  _clickHandle(e) {
    typeof this._click === 'function' && this._click.call(this, this.getExtData(), e, this)
  }

  isUseCanvas() {
    return !!this._useCanvas
  }

  // 获取文字对象,进行更多文字操作
  getText() {
    return this._textObj || null
  }

  setText(textObj) {
    let oldText = this.getText()
    if (oldText) oldText.destroy()
    this._textObj = textObj
    if (this.getMap()) {

    }
  }

  // 获取网格样式
  getPolygonStyle() {
    return {
      strokeColor: this._strokeColor,
      strokeOpacity: this._strokeOpacity,
      strokeWeight: this._strokeWeight,
      fillColor: this._fillColor,
      fillOpacity: this._fillOpacity
    }
  }

  // 设置网格样式
  setPolygonStyle(opt = {}) {
    const KEY_LIST = ['fillColor', 'fillOpacity', 'strokeColor', 'strokeOpacity', 'strokeWeight']
    if (this.__changeOptions(opt, KEY_LIST)) {
      if (this.isUseCanvas()) {
        this._draw()
      } else {
        this._overLayGroup.setOptions(opt)
      }
    }
  }
  // override
  getOverlays() {
    let checkPolygon = this._checkPolygons || []

    let rst = [...checkPolygon]
    if (this._polygons) rst.push(...this._polygons)
    let text = this.getText()
    if (text) rst.push(text)
    if (this._cus) rst.push(this._cus)
    return rst
  }

  setMap(map) {
    super.setMap(map)
    if (map) {
      if (this.isUseCanvas()) {
        let canvas = this._canvas
        let size = map.getSize();
        canvas.width = this._canvas_width = size.width;
        canvas.height = this._canvas_height = size.height;
      }
    }

  }

  // 判断是否存在简易网格
  hasCheckPolygon() {
    return this._checkCoordinate && this._checkCoordinate.length > 0
  }

  // 销毁
  destroy() {
    super.destroy()
  }
}