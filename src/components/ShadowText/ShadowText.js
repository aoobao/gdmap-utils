import './ShadowText.scss'
import Overlays from '../base/Overlays'
import {
  getTextWidth
} from '../../js/utils'


export default class ShadowText extends Overlays {
  constructor(opt) {
    super(opt)
    this._initialize(opt || {})
  }
  _initialize(opt) {
    this._text = opt.text || '未输入文字'
    this._textColor = opt.textColor || '#fff'
    this._textSize = opt.textSize || 20
    this._shaderRatio = opt.shaderRatio || 1.2
    this._offsetTop = opt.offsetTop || 0
    this._offsetLeft = opt.offsetLeft || 0
    this._createMarker()
  }
  _createMarker() {
    let width = getTextWidth(this._text, this._textSize)
    let height = this._textSize
    this._dom = this._createElement(height, width)
    let marker = new AMap.Marker({
      position: this.getPosition(),
      offset: new AMap.Pixel(
        -this._shaderRatio * width / 2 + this._offsetLeft,
        -height / 3 * 2 + this._offsetTop
      ),
      content: this._dom.body,
      zIndex: this.getzIndex()
    })
    this.setOverlays(marker)
  }

  _createElement(height, width) {
    let body = document.createElement('div')
    body.className = 'dcmap-shadowtext-container'
    body.style.width = width * this._shaderRatio + 'px'
    body.style.height = height * 2 + 'px'

    let text = document.createElement('div')
    text.className = 'dcmap-shadowtext-text'
    text.style.fontSize = this._textSize + 'px'
    text.style.color = this._textColor
    text.innerText = this._text
    body.appendChild(text)

    let shadow = document.createElement('div')
    shadow.className = 'dcmap-shadowtext-shadow'
    shadow.style.top = height / 2 + 'px'
    body.appendChild(shadow)

    return {
      body,
      text,
      shadow
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