import gl_Overlays from '../base/gl_Overlays'
import {
  getDefaultByundefined
} from '../../js/utils'
/**
 * 生成一个多边形几何体
 * opt
 * map
 * object3DLayer
 *
 * radius : Int 半径
 * height : Int 高度
 * segment : Int 分割数量
 * topColor :Array<Number> [r,g,b,q] rgba (0-1之间取值) 必须4个值
 * topFaceColor : 同上
 * bottomColor : 同上
 * color : 颜色(优先使用上面的颜色)
 * transparent Bool 透明
 * position [x,y]
 */
export default class gl_RegularPrism extends gl_Overlays {
  constructor(opt) {
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
    this._position = opt.position
    this._createMesh()
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

  _createMesh() {
    let segment = this._segment
    let radius = this._radius
    let center = this.getMap().lngLatToGeodeticCoord(this._position)
    let height = this._height
    let topColor = this.getTopColor()
    let bottomColor = this.getBottomColor()
    let topFaceColor = this.getTopFaceColor()
    // let bottomColor =
    let cylinder = new AMap.Object3D.Mesh()
    let geometry = cylinder.geometry
    let verticesLength = this._segment * 2
    let path = []
    for (let i = 0; i < segment; i++) {
      let angle = (2 * Math.PI * i) / segment
      let x = center.x + Math.cos(angle) * radius
      let y = center.y + Math.sin(angle) * radius
      path.push([x, y])
      geometry.vertices.push(x, y, 0) //增加底部顶点
      geometry.vertices.push(x, y, -height) //增加顶部顶点
      // 加载颜色
      geometry.vertexColors.push(...bottomColor, ...topColor)

      let bottomIndex = i * 2
      let topIndex = bottomIndex + 1
      let nextBottomIndex = (bottomIndex + 2) % verticesLength
      let nextTopIndex = (bottomIndex + 3) % verticesLength

      geometry.faces.push(bottomIndex, topIndex, nextTopIndex) //侧面三角形1
      geometry.faces.push(bottomIndex, nextTopIndex, nextBottomIndex) //侧面三角形2
    }

    // 因为顶部可能是单独的颜色,不可以使用原来的faces索引,需要单独给顶点增加索引(通用使用)
    for (let i = 0; i < segment; i++) {
      // 读到所有的顶部的顶点,加在vertices最后面
      geometry.vertices.push(...geometry.vertices.slice(i * 6 + 3, i * 6 + 6))
      geometry.vertexColors.push(...topFaceColor)
    }

    let triangles = AMap.GeometryUtil.triangulateShape(path)
    let offset = segment * 2

    for (var v = 0; v < triangles.length; v += 3) {
      geometry.faces.push(
        triangles[v] + offset,
        triangles[v + 2] + offset,
        triangles[v + 1] + offset
      )
    }

    cylinder.transparent = this._transparent

    cylinder.__class = this

    this.setOverlays(cylinder)
  }

  /**
   * 修改圆柱体颜色
   * @param {Object} colors 
   * topColor :Array<Number> [r,g,b,q] rgba (0-1之间取值) 必须4个值
   * topFaceColor : 同上
   * bottomColor : 同上
   * color : 颜色(优先使用上面的颜色)
   */
  setColor(colors, draw = true) {
    if (colors.color) this._color = colors.color
    if (colors.topColor) this._topColor = colors.topColor
    if (colors.bottomColor) this._bottomColor = colors.bottomColor
    if (colors.topFaceColor) this._topFaceColor = colors.topFaceColor
    this._updateColor(draw)
  }

  getColor() {
    return {
      topColor: this._topColor,
      bottomColor: this._bottomColor,
      topFaceColor: this._topFaceColor,
      color: this._color
    }
  }

  _updateColor(draw = true) {
    let mesh = this.getOverlays()
    let vertexColors = []
    let segment = this._segment
    let bottomColor = this.getBottomColor()
    let topColor = this.getTopColor()
    let topFaceColor = this.getTopFaceColor()
    for (let i = 0; i < segment; i++) {
      vertexColors.push(...bottomColor, ...topColor)
    }
    // 顶部颜色
    for (let i = 0; i < segment; i++) {
      vertexColors.push(...topFaceColor)
    }
    mesh.geometry.vertexColors.splice(0, mesh.geometry.vertexColors.length, ...vertexColors)
    mesh.needUpdate = true
    if (draw) {
      mesh.reDraw()
    }
  }
  getHeight() {
    return this._height
  }
  // 设置圆柱体高度
  setHeight(height = 10000, draw = true) {
    this._height = height
    let mesh = this.getOverlays()
    let vertices = mesh.geometry.vertices
    let segment = this._segment
    for (let i = 0; i < segment; i++) { // 修改每个顶点的高度值
      let z = i * 6 + 5
      vertices[z] = -height
    }
    // 后面还有单独的顶部顶点(顶部顶点通用设计,给单独顶点)
    let z = segment * 6 - 1 // (拿到最后一个圆柱体索引,索引从0开始所以-1)
    for (let i = z + 3; i < vertices.length; i += 3) {
      vertices[i] = -height
    }
    mesh.needUpdate = true
    if (draw) {
      mesh.reDraw()
    }
  }
  getRadius() {
    return this._radius
  }
  // 修改半径后所有的x,y坐标需要重新计算,和所有顶点重绘性能区别不大,不单独写了
  setRadius(radius = 10000, draw = true) {
    this._radius = radius
    this._updateVertices(draw)
  }

  getPosition() {
    return this._position
  }

  setPosition(position = [120, 30], draw = true) {
    this._position = position
    this._updateVertices(draw)
  }

  // 对顶点坐标进行刷新(segment不能发生改变)
  _updateVertices(draw = true) {
    let segment = this._segment
    let radius = this._radius
    let center = this.getMap().lngLatToGeodeticCoord(this._position)
    let height = this._height
    let mesh = this.getOverlays()
    let vertices = []
    for (let i = 0; i < segment; i++) {
      let angle = (2 * Math.PI * i) / segment
      let x = center.x + Math.cos(angle) * radius
      let y = center.y + Math.sin(angle) * radius
      vertices.push(x, y, 0, x, y, -height)
    }
    for (let i = 0; i < segment; i++) {
      vertices.push(...vertices.slice(i * 6 + 3, i * 6 + 6))
    }
    mesh.geometry.vertices.splice(0, mesh.geometry.vertices.length, ...vertices)
    mesh.needUpdate = true
    if (draw) {
      mesh.reDraw()
    }
  }

  reDraw() {
    let overlays = this.getOverlays()
    overlays.reDraw()
    // this.__callMethod(overlays, 'reDraw', null)
  }

}