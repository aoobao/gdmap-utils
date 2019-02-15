import './Text3D.scss'
import {
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_IMAGE_HEIGHT
} from '../base/Enum'
import Overlays from '../base/Overlays'

/**
 * opt :
 * text 文字内容
 * textColor 文字颜色
 * isShowRipples 是否显示涟漪
 * imageOption : {
 *  height,width,src
 * }
 * className 标记点自定义class
 * click, 点击事件
 * mouseover, 鼠标移入事件
 * mouseout 鼠标移出事件
 * 
 * methods
 * showRipples    //显示涟漪效果
 * closeRipples   //关闭涟漪效果
 * getValue   //获取文字内容
 * setValue   // 设置文字内容
 */
export default class Text3D extends Overlays {
  constructor(opt) {
    super(opt)
    this._clickHandle = this._clickHandle.bind(this)
    this._mouseOut = this._mouseOut.bind(this)
    this._mouseOver = this._mouseOver.bind(this)
    this._initialize(opt || {})
  }

  _initialize(opt) {
    this._text = opt.text || ''
    this._textColor = opt.textColor
    this._showRipples = !!opt.isShowRipples
    this._imageOption = opt.imageOption || {}
    this._className = opt.className

    this._click = opt.click
    this._mouseover = opt.mouseover
    this._mouseout = opt.mouseout

    this._createMarker()
  }

  // 展示涟漪效果
  showRipples() {
    let dom = this._dom
    dom.smallCircle.style.display = 'block'
    dom.largeCircle.style.display = 'block'
    this._showRipples = true;
  }

  closeRipples() {
    let dom = this._dom
    dom.smallCircle.style.display = '';
    dom.largeCircle.style.display = '';
    this._showRipples = false
  }

  _clickHandle(e) {
    typeof this._click === 'function' && this._click.call(this, this.getExtData(), e)
  }
  _mouseOut(e) {
    typeof this._mouseout === 'function' && this._mouseout.call(this, this.getExtData(), e)
  }
  _mouseOver(e) {
    typeof this._mouseover === 'function' && this._mouseover.call(this, this.getExtData(), e)
  }

  _createMarker() {
    let dom = this._dom = this._createElement()
    let height = this._imageOption.height || DEFAULT_IMAGE_HEIGHT
    dom.body.addEventListener('mouseenter', this._mouseOver)
    dom.body.addEventListener('mouseleave', this._mouseOut)
    dom.body.addEventListener('click', this._clickHandle)
    let marker = new AMap.Marker({
      position: this.__position,
      offset: new AMap.Pixel(0, -height - 20),
      content: dom.body,
      zIndex: this.getzIndex()
    })
    this.setOverlays(marker)
    if (this._showRipples) {
      this.showRipples()
    }
  }

  getValue() {
    // return this._dom.text.innerText
    return this._text
  }

  setValue(value) {
    this._dom.text.innerText = strText
    this._text = strText
  }

  _createElement() {
    let height = this._imageOption.height || DEFAULT_IMAGE_HEIGHT
    let body = document.createElement('div')
    body.className = 'dcmap-text3d-container ' + this._className
    body.style.height = (height + 30) + 'px'
    // 涟漪效果
    let smallCircle = document.createElement('div');
    smallCircle.className = 'map-point-small-circle'
    body.appendChild(smallCircle);

    let largeCircle = document.createElement('div');
    largeCircle.className = 'map-point-large-circle';
    body.appendChild(largeCircle)

    let text = document.createElement('span')
    text.className = 'map-point-text-dom'
    text.style.color = this._textColor
    text.innerText = this._text
    body.appendChild(text)

    let img = document.createElement('div')
    img.className = 'map-point-img-dom'
    img.style.width = this._imageOption.width || DEFAULT_IMAGE_WIDTH
    img.style.height = height
    if (this._imageOption.src) {
      img.style.backgroundImage = `url('${this._imageOption.src}')`
    }

    body.appendChild(img)

    return {
      body,
      text,
      img,
      smallCircle,
      largeCircle
    }

  }

}