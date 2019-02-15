// import Overlays from '../base/Overlays'
import {
  getAngle
} from '../../js/utils'
/**
 * opt
 * map 高德地图实例(必传)
 * center 雷达圆心 (必传)
 * target 雷达扫描半径所在点(必传) 用来确定雷达扫描起始点以及半径
 * coverNumber 雷达扫描消失参数 (与speed共同定义雷达尾巴宽度,默认0.05)
 * speed 雷达扫描速度(多少秒扫完一圈)
 * fillStyle 雷达扫描颜色
 * callback 雷达扫描回调
 */
export default class RadarChart {
  constructor(opt) {
    this._draw = this._draw.bind(this)
    this._initialize(opt || {})
  }

  _initialize(opt) {
    this._map = opt.map
    this._center = opt.center
    this._target = opt.target
    this._speed = opt.speed || 60
    this._coverNumber = opt.coverNumber || 0.2;
    this._fillStyle = opt.fillStyle || 'rgba(0,200,0,0.7)'
    this._callback = opt.callback

    this._isStart = false

    this._deg = 360 - ~~getAngle(...this._center, ...this._target)
    this._createCanvasLayer()
  }
  _createCanvasLayer() {
    let canvas = (this._canvas = document.createElement('canvas'))
    this._ctx = canvas.getContext('2d')
    let positionObj = getPixel(this._center, this._target)
    let minPixel = this._map.lngLatToContainer(positionObj.minPosition)
    let maxPixel = this._map.lngLatToContainer(positionObj.maxPosition)
    //canvas.width = this._width = maxPixel.getX() - minPixel.getX()
    //canvas.height = this._height = minPixel.getY() - maxPixel.getY()
    canvas.width = canvas.height = this._width = this._height = maxPixel.getX() - minPixel.getX()

    // console.log(this._width, this._height, '宽高')
    this._clayer = new AMap.CanvasLayer({
      canvas: canvas,
      bounds: new AMap.Bounds(positionObj.minPosition, positionObj.maxPosition),
      zIndex: 100
    })

    // this._canvas2 = document.createElement('canvas')
    // this._ctx2 = this._canvas2.getContext('2d')
    // this._canvas2.width = this._canvas2.height = canvas.width
    // this._clayer2 = new AMap.CanvasLayer({
    //   canvas: this._canvas2,
    //   bounds: new AMap.Bounds(positionObj.minPosition, positionObj.maxPosition),
    //   zIndex: 101
    // })
    // this._drawCircle()
    this._clayer.setMap(this._map)
    // this._clayer2.setMap(this._map)
  }

  start() {
    if (this._isStart) return
    this._isStart = true
    this._draw()
  }

  stop() {
    if (this._isStart) {
      this._isStart = false
      setTimeout(() => {
        this._ctx.clearRect(0, 0, this._width, this._height)
      }, 1);
    }
  }

  destroy() {
    this.stop()
    this._clayer.setMap(null)
    this._clayer = null
  }

  _drawCircle() {

    let radius = (this._width > this._height ? this._height : this._width) / 2
    let ctx = this._ctx2
    ctx.clearRect(0, 0, this._width, this._height)
    ctx.fillStyle = this._fillStyle
    ctx.globalAlpha = 0.2
    ctx.beginPath()
    ctx.moveTo(this._width / 2, this._height / 2)
    ctx.arc(this._width / 2, this._height / 2, radius, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
  }
  _draw() {
    let startDeg = this._deg
    this._deg += 360 / this._speed
    if (this._deg >= 360) this._deg = this._deg - 360

    if (!this._isStart) {
      return
    }

    this._drawRadar()
    this._cover()
    // ctx.fill()
    this._clayer.reFresh()

    if (typeof this._callback === 'function') {
      this._callback.call(this, {
        start: startDeg,
        end: this._deg > startDeg ? this._deg : this._deg + startDeg
      })
    }
    window.requestAnimationFrame(this._draw)
  }

  _drawRadar() {
    let deg = this._deg
    let ctx = this._ctx
    let radius = (this._width > this._height ? this._height : this._width) / 2
    ctx.save()
    ctx.fillStyle = this._fillStyle
    ctx.beginPath()
    ctx.moveTo(this._width / 2, this._height / 2)
    ctx.arc(this._width / 2, this._height / 2, radius, (-360 / this._speed + deg) / 180 * Math.PI, (deg) / 180 * Math.PI)
    // ctx.arc(this._width / 2, this._height / 2, radius, 0, 2 / 180 * Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  _cover() {
    let ctx = this._ctx
    ctx.save()
    let radius = (this._width > this._height ? this._height : this._width) / 2
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0,0,0,${this._coverNumber})`
    // let centerPixel = this._map.lngLatToContainer(this._center)
    // ctx.arc(this._width / 2, this._height / 2, radius, 0, 2 * Math.PI)
    ctx.rect(0, 0, this._width, this._height)
    ctx.fill()
    ctx.restore()
  }

  _clearRect() {
    let ctx = this._ctx
    ctx.clearRect(0, 0, this.width, this.height)
  }
}

function getPixel(center, target) {
  let dis = Math.sqrt(
    Math.pow(target[0] - center[0], 2) + Math.pow(target[1] - center[1], 2)
  )

  return {
    minPosition: [center[0] - dis, center[1] - dis],
    maxPosition: [center[0] + dis, center[1] + dis]
  }
}