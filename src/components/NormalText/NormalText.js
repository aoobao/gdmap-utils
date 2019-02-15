import './NormalText.scss'
import Overlays from '../base/Overlays'
import {
  getTextWidth
} from '../../js/utils'

/**
 * 不用高德原生的主要原因是,text会影响外面网格的鼠标事件,处理起来很麻烦
 * opt :
 * text : 显示的文字 String
 * textColor : 文字颜色 String #fff
 * position : 定位经纬度
 * offsetTop:Number
 * offsetLeft:Number
 */
export default class NormalText extends Overlays {
  constructor(opt) {
    super(opt)
    this._initialize(opt || {})
  }
  _initialize(opt) {
    this._text = opt.text || ''
    this._textColor = opt.textColor || '#fff'
    this._paddingWidth = opt.paddingWidth || 20
    this._textSize = opt.textSize || 20
    this._paddingHeight = opt.paddingHeight || 10
    this._offsetTop = opt.offsetTop || 0
    this._offsetLeft = opt.offsetLeft || 0
    this._createMarker()
    // opt.map && this.setMap(opt.map)
  }

  _createMarker() {
    let width = getTextWidth(this._text, this._textSize) + this._paddingWidth
    let height = this._textSize + this._paddingHeight
    let dom = (this._dom = this._createElement(height, width))
    let marker = new AMap.Marker({
      position: this.getPosition(),
      offset: new AMap.Pixel(
        -width / 2 + this._offsetLeft,
        -height / 2 + this._offsetTop
      ),
      content: dom.body,
      bubble: true,
      zIndex: this.getzIndex()
    })
    this.setOverlays(marker)
  }
  _createElement(height, width) {
    let body = document.createElement('div')
    body.className = 'dcmap-normaltext-container'

    // body.style.width = width + 'px'
    body.style.height = height + 'px'
    let text = document.createElement('div')
    text.className = 'text'
    text.style.width = width + 'px'
    text.style.fontSize = this._textSize + 'px'
    text.style.color = this._textColor
    text.innerText = this._text
    body.appendChild(text)
    return {
      body,
      text
    }
  }

  getTextColor() {
    return this._textColor
  }

  setTextColor(color) {
    this._textColor = color
    let text = this._dom.text
    text.style.color = this._textColor
  }

  getValue() {
    return this._text
  }

  setValue(value) {
    this._text = value
    let text = this._dom.text
    text.innerText = this._text
  }
}