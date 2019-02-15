/**
 * opt
 * map
 * textColor
 * font
 */
export default class TextQueue {
  constructor(opt) {
    this._draw = this._draw.bind(this)
    this._initialize(opt || {})
  }
  _initialize(opt) {
    this._map = opt.map
    this._list = []
    this._textColor = opt.textColor || '#fff'
    this._font = opt.font || '20px Arial'
    this._start = false
    this._createLayer()
  }

  _createLayer() {
    let canvas = this._canvas = document.createElement('canvas')
    this._ctx = canvas.getContext('2d')
    let size = this._map.getSize()
    canvas.width = this._width = size.width
    canvas.height = this._height = size.height
    this._cus = new AMap.CustomLayer(canvas, {
      map: this._map,
      zIndex: 100
    })
    this._cus.render = this.reload.bind(this)
  }

  reload() {
    this._list = this._list.map(t => {
      return {
        ...t,
        _pixel: null
      }
    })
  }

  _draw() {
    if (this.getMap() != null) {
      this._clearCanvas()
      this._drawCanvas()
      if (this._list.length > 0) {
        window.requestAnimationFrame(this._draw)
      } else {
        this._start = false
      }
    } else {
      this._start = false
    }
  }

  _clearCanvas() {
    let ctx = this._ctx
    ctx.clearRect(0, 0, this._width, this._height)
  }

  _drawCanvas() {
    if (this.getMap() == null) return
    // console.log('draw')
    let ctx = this._ctx
    let now = Date.now()
    ctx.textAlign = 'center'
    ctx.textBaseline = "middle"
    ctx.fillStyle = this._textColor
    ctx.font = this._font
    for (let i = 0; i < this._list.length; i++) {
      const obj = this._list[i];
      let timer = (now - obj._time) / 1000
      if (timer > 3) {
        obj._del = true
        continue
      }
      let pixel = obj._pixel || this._map.lngLatToContainer(obj.position)
      obj._pixel = pixel
      ctx.save()
      ctx.translate(pixel.getX(), pixel.getY())
      let scale = 1 // 缩放因子
      let opacity = 1
      if (timer < 1) { // 放大
        scale = scale / timer
        opacity = timer
      } else if (timer > 2) { // 缩小
        // scale = 3 - timer
        opacity = 3 - timer
        scale = opacity
      }
      if (scale != 1) {
        ctx.scale(scale, scale)

      }
      if (opacity != 1) {
        ctx.globalAlpha = opacity
      }
      if (obj.textColor) {
        ctx.fillStyle = obj.textColor
      }
      if (obj.font) {
        ctx.font = obj.font
      }
      ctx.fillText(obj.text, 0, 0)
      ctx.restore()
    }
    this._list = this._list.filter(t => !t._del)
  }
  /**
   * 加入到弹幕队列
   * @param {Object} objs 
   * position : [x,y]
   * text : String 文本信息
   * textColor : 文字颜色
   * font : String
   */
  push(...objs) {
    objs.forEach(obj => {
      this._list.push({
        ...obj,
        _time: Date.now()
      })
    });
    if (!this._start) {
      this._start = true
      this._draw()
    }
  }

  setMap(map) {
    this._map = map
    this._cus.setMap(map)
    if (map == null) {
      this._start = false
    } else if (!this._start) {
      this._start = true
      this._draw()
    }

  }

  getMap() {
    return this._map || null
  }

  destroy() {
    this.setMap(null)
    this._cus = null
  }

}