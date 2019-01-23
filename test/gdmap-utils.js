(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.AMapUtils = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var MIN_ZOOM = 1; // 地图最小级别

  var MAX_ZOOM = 19; // 地图最大级别

  /**
   * 如果value为undefined则返回ifundefineValue,否则返回value
   * @param {*} value 传入值
   * @param {*} ifundefineValue 默认值
   */
  function getDefaultByundefined(value, ifundefineValue) {
    return value === undefined ? ifundefineValue : value;
  }
  /**
   * 将字符串形式经纬度网格转为数组形式
   * x1,y1;x2,y2,..|xn,yn;xn+1,yn+1..
   * @param {String} coordinate 
   * @param {String} sep
   * @returns {Array}[[[x1,y1],[x2,y2],...],[[xn,yn],[xn+1,yn+1],...]]
   */

  function transposePolyrect(coordinate) {
    var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '|';
    var arr = [];
    var pattern = /\d+(\.\d+)?/g;

    if (typeof coordinate === 'string') {
      var temp = coordinate.split(sep);
      temp.forEach(function (t) {
        if (t) {
          var re = [];
          var mat = t.match(pattern);

          for (var i = 1; i < mat.length; i += 2) {
            var x = parseFloat(mat[i - 1]);
            var y = parseFloat(mat[i]);
            re.push([x, y]);
          }

          arr.push(re);
        }
      });
    } else {
      console.warn('经纬度格式有误:', coordinate);
    }

    return arr;
  }
  /**
   * 获取字符串的宽度
   * @param {String} str 
   */

  function getTextWidth(str) {
    var fontSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
    if (!str) return 0;
    var temp = str.replace(/[^\\x00-\\xff]/g, 'aa');
    return temp.length * fontSize / 2;
  }
  function getIntersection(parentMin, parentMax, min, max) {
    var minZoom = parentMin < min ? min : parentMin;
    var maxZoom = parentMax > max ? max : parentMax;
    return {
      minZoom: minZoom,
      maxZoom: maxZoom
    };
  }
  function getMergeObject() {
    for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
      objs[_key] = arguments[_key];
    }

    var rst = objs.reduce(function (pre, sur) {
      if (!sur) return pre;
      return _objectSpread({}, pre, sur);
    }, {});
    return rst;
  }

  /**
   * 地图覆盖物基类
   */
  var Overlays =
  /*#__PURE__*/
  function () {
    function Overlays(opt) {
      _classCallCheck(this, Overlays);

      this.__initialize(opt || {});
    }

    _createClass(Overlays, [{
      key: "__initialize",
      value: function __initialize(opt) {
        var _this = this;

        this.CLASS_NAME = this.constructor.name;
        this.__map = opt.map || null;
        this.__position = opt.position;
        this.__zIndex = opt.zIndex || 10;
        this.__extData = opt.extData;
        this.__show = false;

        if (opt.map) {
          setTimeout(function () {
            _this.setMap(opt.map);
          }, 1);
        }
      } // 对overlays递归调用methodName方法.

    }, {
      key: "__callMethod",
      value: function __callMethod(overlays, methodName) {
        var _this2 = this;

        for (var _len = arguments.length, methodArguments = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          methodArguments[_key - 2] = arguments[_key];
        }

        if (overlays === null) return;

        if (Array.isArray(overlays)) {
          overlays.forEach(function (o) {
            // o[methodName](...methodArguments)
            _this2.__callMethod.apply(_this2, [o, methodName].concat(methodArguments));
          });
        } else if (_typeof(overlays) === 'object') {
          if (typeof overlays[methodName] === 'function') {
            overlays[methodName].apply(overlays, methodArguments);
          } else {
            console.warn('对象找不到方法:' + methodName, overlays);
          }
        } else {
          console.warn('传入值不是实例对象', overlays);
        }
      } // 批量赋值,假定传入的参数在内部均为开头加上 _

    }, {
      key: "__changeOptions",
      value: function __changeOptions(opt) {
        var _this3 = this;

        var keyList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var isChange = false;
        var list = Array.isArray(keyList) ? keyList : Object.keys(opt);
        list.forEach(function (key) {
          if (!(key in opt)) return;
          var sourceKey = '_' + key;
          var value = _this3[sourceKey];

          if (value === undefined) {
            console.warn('未找到该字段属性:' + key);
          }

          if (value !== opt[key]) {
            _this3[sourceKey] = opt[key];
            isChange = true;
          }
        });
        return isChange;
      }
    }, {
      key: "getzIndex",
      value: function getzIndex() {
        return this.__zIndex;
      }
    }, {
      key: "setzIndex",
      value: function setzIndex(zIndex) {
        this.__zIndex = zIndex;
        var overlays = this.getOverlays();

        this.__callMethod(overlays, 'setzIndex', zIndex);
      } // 获取自定义对象

    }, {
      key: "getExtData",
      value: function getExtData() {
        return this.__extData;
      } // 设置自定义对象

    }, {
      key: "setExtData",
      value: function setExtData(data) {
        this.__extData = data;
      } // 获取经纬度

    }, {
      key: "getPosition",
      value: function getPosition() {
        return this.__position;
      } // 设置经纬度

    }, {
      key: "setPosition",
      value: function setPosition(position) {
        this.__position;
        var overlays = this.getOverlays();

        this.__callMethod(overlays, 'setPosition', position);
      } // 获取所有覆盖物方法,内部调用,需要子类自行实现

    }, {
      key: "getOverlays",
      value: function getOverlays() {
        return this.__overlays;
      } // 设置所有覆盖物 内部调用.

    }, {
      key: "setOverlays",
      value: function setOverlays(overlays) {
        this.__overlays = overlays;
      }
    }, {
      key: "isShow",
      value: function isShow() {
        return this.getMap() !== null;
      } // 显示在地图上.

    }, {
      key: "setMap",
      value: function setMap(map) {
        this.__map = map;
        var overlays = this.getOverlays();

        this.__callMethod(overlays, 'setMap', map);
      }
    }, {
      key: "getMap",
      value: function getMap() {
        return this.__map || null;
      } // 销毁

    }, {
      key: "destroy",
      value: function destroy() {
        this.setMap(null);
      }
    }]);

    return Overlays;
  }();

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = ".dcmap-normaltext-container {\n  width: 0px;\n  pointer-events: none; }\n  .dcmap-normaltext-container .text {\n    height: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center; }\n";
  styleInject(css);

  /**
   * 不用高德原生的主要原因是,text会影响外面网格的鼠标事件,处理起来很麻烦
   * opt :
   * text : 显示的文字 String
   * textColor : 文字颜色 String #fff
   * position : 定位经纬度
   */

  var NormalText =
  /*#__PURE__*/
  function (_Overlays) {
    _inherits(NormalText, _Overlays);

    function NormalText(opt) {
      var _this;

      _classCallCheck(this, NormalText);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(NormalText).call(this, opt));

      _this._initialize(opt || {});

      return _this;
    }

    _createClass(NormalText, [{
      key: "_initialize",
      value: function _initialize(opt) {
        this._text = opt.text || '';
        this._textColor = opt.textColor || '#fff';
        this._paddingWidth = opt.paddingWidth || 20;
        this._textSize = opt.textSize || 20;
        this._paddingHeight = opt.paddingHeight || 10;

        this._createMarker(); // opt.map && this.setMap(opt.map)

      }
    }, {
      key: "_createMarker",
      value: function _createMarker() {
        var width = getTextWidth(this._text, this._textSize) + this._paddingWidth;

        var height = this._textSize + this._paddingHeight;

        var dom = this._dom = this._createElement(height, width);

        var marker = new AMap.Marker({
          position: this.getPosition(),
          offset: new AMap.Pixel(-width / 2, -height / 2),
          content: dom.body,
          bubble: true,
          zIndex: this.getzIndex()
        });
        this.setOverlays(marker);
      }
    }, {
      key: "_createElement",
      value: function _createElement(height, width) {
        var body = document.createElement('div');
        body.className = 'dcmap-normaltext-container'; // body.style.width = width + 'px'

        body.style.height = height + 'px';
        var text = document.createElement('div');
        text.className = 'text';
        text.style.width = width + 'px';
        text.style.fontSize = this._textSize + 'px';
        text.style.color = this._textColor;
        text.innerText = this._text;
        body.appendChild(text);
        return {
          body: body,
          text: text
        };
      }
    }, {
      key: "getTextColor",
      value: function getTextColor() {
        return this._textColor;
      }
    }, {
      key: "setTextColor",
      value: function setTextColor(color) {
        this._textColor = color;
        var text = this._dom.text;
        text.style.color = this._textColor;
      }
    }, {
      key: "getValue",
      value: function getValue() {
        return this._text;
      }
    }, {
      key: "setValue",
      value: function setValue(value) {
        this._text = value;
        var text = this._dom.text;
        text.innerText = this._text;
      }
    }]);

    return NormalText;
  }(Overlays);

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

  var Polyrect =
  /*#__PURE__*/
  function (_Overlays) {
    _inherits(Polyrect, _Overlays);

    function Polyrect(opt) {
      var _this;

      _classCallCheck(this, Polyrect);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Polyrect).call(this, opt));
      _this._clickHandle = _this._clickHandle.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this._mouseOut = _this._mouseOut.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this._mouseOver = _this._mouseOver.bind(_assertThisInitialized(_assertThisInitialized(_this)));

      _this._initialize(opt || {});

      return _this;
    }

    _createClass(Polyrect, [{
      key: "_initialize",
      value: function _initialize(opt) {
        // 网格颜色样式
        this._strokeColor = opt.strokeColor || '#f00';
        this._strokeOpacity = getDefaultByundefined(opt.strokeOpacity, 0.8);
        this._strokeWeight = getDefaultByundefined(opt.strokeWeight, 1);
        this._fillColor = opt.fillColor || 'blue';
        this._fillOpacity = getDefaultByundefined(opt.fillOpacity, 0.2); // 文字样式

        this._textOption = opt.textOption || {
          text: opt.text || '未输入文字内容',
          textColor: opt.textColor || 'red' // 事件

        };
        this._click = opt.click;
        this._mouseover = opt.mouseover;
        this._mouseout = opt.mouseout; // 是否使用canvas绘制

        this._useCanvas = getDefaultByundefined(opt.useCanvas, false); // this._canvasDom = opt.canvasDom
        // 网格坐标

        this._coordinate = transposePolyrect(opt.coordinate);
        this._checkCoordinate = transposePolyrect(opt.checkCoordinate || ''); // 如果有简易网格,创建简易网格绑定事件

        this._createCheckPolygon();

        if (this.isUseCanvas()) {
          this._createCustomLayer(); // 后面优化.

        } else {
          this._createPolygon();

          this._overLayGroup = new AMap.OverlayGroup(this._polygons);
        } // 创建文字


        var TextClass = getDefaultByundefined(opt.textClass, NormalText);
        if (TextClass) this._createText(TextClass);
      }
    }, {
      key: "_createText",
      value: function _createText(TextClass) {
        if (this._textObj) {
          typeof this._textObj.destroy === 'function' && this._textObj.destroy();
          this._textObj = null;
        }

        if (!TextClass) {
          console.warn('未找到文字对象,检查textClass参数', TextClass);
          return;
        }

        var minZoom = getDefaultByundefined(this._textOption.minZoom, MIN_ZOOM);
        var maxZoom = getDefaultByundefined(this._textOption.maxZoom, MAX_ZOOM);
        var zoom = getIntersection(this.__minZoom, this.__maxZoom, minZoom, maxZoom);

        var opt = _objectSpread({
          map: this.getMap(),
          position: this.getPosition(),
          zIndex: this.getzIndex()
        }, this._textOption, zoom);

        this._textObj = new TextClass(opt);
      } // 创建简易网格

    }, {
      key: "_createCheckPolygon",
      value: function _createCheckPolygon() {
        var _this2 = this;

        if (!this.hasCheckPolygon()) return;

        if (this._checkCoordinate.length > 1) {
          console.warn('checkCoordinate建议设置为单区域简单多边形以提高性能');
        }

        this._checkPolygons = this._checkCoordinate.map(function (coordinate) {
          var polygon = new AMap.Polygon({
            path: coordinate,
            strokeOpacity: 0,
            strokeWeight: 0,
            fillOpacity: 0,
            zIndex: _this2.__zIndex + 1,
            bubble: true
          });

          _this2._addEvent(polygon);

          return polygon;
        });
      } // 创建区域网格

    }, {
      key: "_createPolygon",
      value: function _createPolygon() {
        var _this3 = this;

        // 如果有简易区域则不需要绑定事件,否则需要绑定事件
        var hasBindEvent = this.hasCheckPolygon();
        this._polygons = this._coordinate.map(function (coordinate) {
          var polygon = new AMap.Polygon({
            path: coordinate,
            strokeColor: _this3._strokeColor,
            strokeOpacity: _this3._strokeOpacity,
            strokeWeight: _this3._strokeWeight,
            fillColor: _this3._fillColor,
            fillOpacity: _this3._fillOpacity,
            zIndex: _this3.__zIndex,
            bubble: true
          });
          if (!hasBindEvent) _this3._addEvent(polygon);
          return polygon;
        });
      }
    }, {
      key: "_createCustomLayer",
      value: function _createCustomLayer() {
        // TODO
        var canvas = this._canvas = document.createElement('canvas');
        this._ctx = canvas.getContext('2d');
        var map = this.getMap();

        if (map) {
          var size = this.getMap().getSize();
          canvas.width = this._canvas_width = size.width;
          canvas.height = this._canvas_height = size.height;
        }

        this._cus = new AMap.CustomLayer(canvas, {
          zIndex: 10
        });
        this._cus.render = this._draw.bind(this);
      }
    }, {
      key: "_draw",
      value: function _draw() {
        this._clearCanvas(this._ctx);

        this._drawCanvas(this._ctx);
      }
    }, {
      key: "_clearCanvas",
      value: function _clearCanvas(ctx) {
        ctx.clearRect(0, 0, this._canvas_width, this._canvas_height);
      }
    }, {
      key: "_drawCanvas",
      value: function _drawCanvas(ctx) {
        var _this4 = this;

        ctx.save();
        ctx.strokeStyle = this._strokeColor;
        ctx.lineWidth = this._strokeWeight;
        ctx.fillStyle = this._fillColor;

        this._coordinate.forEach(function (arr) {
          var pixels = arr.map(function (t) {
            return _this4.getMap().lngLatToContainer(t);
          });
          ctx.beginPath();
          ctx.globalAlpha = _this4._strokeOpacity;
          pixels.forEach(function (pixel) {
            ctx.lineTo(pixel.getX(), pixel.getY());
          });
          ctx.closePath();
          ctx.stroke();
          ctx.globalAlpha = _this4._fillOpacity;
          ctx.fill();
        });

        ctx.restore();
      }
    }, {
      key: "_addEvent",
      value: function _addEvent(overlays) {
        overlays.on('mouseover', this._mouseOver);
        overlays.on('mouseout', this._mouseOut);
        overlays.on('click', this._clickHandle);
      } // 移出区域

    }, {
      key: "_mouseOut",
      value: function _mouseOut(e) {
        typeof this._mouseout === 'function' && this._mouseout.call(this, this.getExtData(), e, this);
      } // 鼠标移入区域

    }, {
      key: "_mouseOver",
      value: function _mouseOver(e) {
        typeof this._mouseover === 'function' && this._mouseover.call(this, this.getExtData(), e, this);
      }
    }, {
      key: "_clickHandle",
      value: function _clickHandle(e) {
        typeof this._click === 'function' && this._click.call(this, this.getExtData(), e, this);
      }
    }, {
      key: "isUseCanvas",
      value: function isUseCanvas() {
        return !!this._useCanvas;
      } // 获取文字对象,进行更多文字操作

    }, {
      key: "getText",
      value: function getText() {
        return this._textObj || null;
      }
    }, {
      key: "setText",
      value: function setText(textObj) {
        var oldText = this.getText();
        if (oldText) oldText.destroy();
        this._textObj = textObj;

        if (this.getMap()) ;
      } // 获取网格样式

    }, {
      key: "getPolygonStyle",
      value: function getPolygonStyle() {
        return {
          strokeColor: this._strokeColor,
          strokeOpacity: this._strokeOpacity,
          strokeWeight: this._strokeWeight,
          fillColor: this._fillColor,
          fillOpacity: this._fillOpacity
        };
      } // 设置网格样式

    }, {
      key: "setPolygonStyle",
      value: function setPolygonStyle() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var KEY_LIST = ['fillColor', 'fillOpacity', 'strokeColor', 'strokeOpacity', 'strokeWeight'];

        if (this.__changeOptions(opt, KEY_LIST)) {
          if (this.isUseCanvas()) {
            this._draw();
          } else {
            this._overLayGroup.setOptions(opt);
          }
        }
      } // override

    }, {
      key: "getOverlays",
      value: function getOverlays() {
        var checkPolygon = this._checkPolygons || [];

        var rst = _toConsumableArray(checkPolygon);

        if (this._polygons) rst.push.apply(rst, _toConsumableArray(this._polygons));
        var text = this.getText();
        if (text) rst.push(text);
        if (this._cus) rst.push(this._cus);
        return rst;
      }
    }, {
      key: "setMap",
      value: function setMap(map) {
        _get(_getPrototypeOf(Polyrect.prototype), "setMap", this).call(this, map);

        if (map) {
          if (this.isUseCanvas()) {
            var canvas = this._canvas;
            var size = map.getSize();
            canvas.width = this._canvas_width = size.width;
            canvas.height = this._canvas_height = size.height;
          }
        }
      } // 判断是否存在简易网格

    }, {
      key: "hasCheckPolygon",
      value: function hasCheckPolygon() {
        return this._checkCoordinate && this._checkCoordinate.length > 0;
      } // 销毁

    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(Polyrect.prototype), "destroy", this).call(this);
      }
    }]);

    return Polyrect;
  }(Overlays);

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

  var PolyrectList =
  /*#__PURE__*/
  function (_Overlays) {
    _inherits(PolyrectList, _Overlays);

    function PolyrectList(opt) {
      var _this;

      _classCallCheck(this, PolyrectList);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PolyrectList).call(this, opt));
      _this._clickHandle = _this._clickHandle.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this._mouseOut = _this._mouseOut.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this._mouseOver = _this._mouseOver.bind(_assertThisInitialized(_assertThisInitialized(_this)));

      _this._initialize(opt || {});

      return _this;
    }

    _createClass(PolyrectList, [{
      key: "_clickHandle",
      value: function _clickHandle(extData, e, polyrect) {
        typeof this._click === 'function' && this._click.call(this, polyrect, e);
      }
    }, {
      key: "_mouseOut",
      value: function _mouseOut(extData, e, polyrect) {
        typeof this._mouseout === 'function' && this._mouseout.call(this, polyrect, e);
      }
    }, {
      key: "_mouseOver",
      value: function _mouseOver(extData, e, polyrect) {
        typeof this._mouseover === 'function' && this._mouseover.call(this, polyrect, e);
      }
    }, {
      key: "_initialize",
      value: function _initialize(opt) {
        this._strokeColor = opt.strokeColor || '#f00';
        this._strokeOpacity = getDefaultByundefined(opt.strokeOpacity, 0.8);
        this._strokeWeight = getDefaultByundefined(opt.strokeWeight, 1);
        this._fillColor = opt.fillColor || 'blue';
        this._fillOpacity = getDefaultByundefined(opt.fillOpacity, 0.2);
        this._textOption = opt.textOption;
        this._click = opt.click;
        this._mouseover = opt.mouseover;
        this._mouseout = opt.mouseout;
        this._useCanvas = getDefaultByundefined(opt.useCanvas, false);
        this._textClass = opt.textClass;
        this._polyrects = [];
      }
    }, {
      key: "getPolygonStyle",
      value: function getPolygonStyle() {
        return {
          strokeColor: this._strokeColor,
          strokeOpacity: this._strokeOpacity,
          strokeWeight: this._strokeWeight,
          fillColor: this._fillColor,
          fillOpacity: this._fillOpacity
        };
      }
    }, {
      key: "setPolygonStyle",
      value: function setPolygonStyle() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var KEY_LIST = ['fillColor', 'fillOpacity', 'strokeColor', 'strokeOpacity', 'strokeWeight'];

        if (this.__changeOptions(opt, KEY_LIST)) {
          if (this._polyrects && this._polyrects.length > 0) {
            this._polyrects.forEach(function (polyrect) {
              polyrect.setPolygonStyle(opt);
            });
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

    }, {
      key: "setData",
      value: function setData(list) {
        var _this2 = this;

        this.clear();
        var g = getDefaultByundefined;
        this._polyrects = list.map(function (item) {
          var opt = {
            map: _this2.getMap(),
            checkCoordinate: item.checkCoordinate,
            coordinate: item.coordinate,
            position: item.position,
            strokeColor: g(item.strokeColor, _this2._strokeColor),
            strokeWeight: g(item.strokeWeight, _this2._strokeWeight),
            strokeOpacity: g(item.strokeOpacity, _this2._strokeOpacity),
            fillColor: g(item.fillColor, _this2._fillColor),
            fillOpacity: g(item.fillOpacity, _this2._fillOpacity),
            textOption: getMergeObject(_this2._textOption, item.textOption),
            textClass: g(item.textClass, _this2._textClass),
            useCanvas: _this2._useCanvas,
            click: _this2._clickHandle,
            mouseout: _this2._mouseOut,
            mouseover: _this2._mouseOver,
            extData: item.extData || item,
            zIndex: item.zIndex || _this2.getzIndex()
          };
          return new Polyrect(opt);
        });
      }
    }, {
      key: "getPolyrects",
      value: function getPolyrects() {
        var list = this._polyrects || [];
        return _toConsumableArray(list);
      }
    }, {
      key: "showText",
      value: function showText() {
        var _this3 = this;

        var list = this.getPolyrects();
        list.forEach(function (polyrect) {
          var text = polyrect.getText();
          if (text) text.setMap(_this3.getMap());
        });
      }
    }, {
      key: "hideText",
      value: function hideText() {
        var list = this.getPolyrects();
        list.forEach(function (polyrect) {
          var text = polyrect.getText();
          if (text) text.setMap(null);
        });
      }
    }, {
      key: "clear",
      value: function clear() {
        var list = this.getOverlays();

        if (list && list.length > 0) {
          list.forEach(function (polyrect) {
            polyrect.destroy();
          });
          this.setOverlays([]);
        }
      }
    }, {
      key: "getOverlays",
      value: function getOverlays() {
        return this.getPolyrects();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(PolyrectList.prototype), "destroy", this).call(this);
      }
    }]);

    return PolyrectList;
  }(Overlays);

  var Text3D =
  /*#__PURE__*/
  function (_Overlays) {
    _inherits(Text3D, _Overlays);

    function Text3D() {
      _classCallCheck(this, Text3D);

      return _possibleConstructorReturn(this, _getPrototypeOf(Text3D).apply(this, arguments));
    }

    _createClass(Text3D, [{
      key: "setMap",
      value: function setMap(map) {
        _get(_getPrototypeOf(Text3D.prototype), "setMap", this).call(this, map);

        console.log('text3d');
      }
    }]);

    return Text3D;
  }(Overlays);

  var main = {
    Polyrect: Polyrect,
    NormalText: NormalText,
    Text3D: Text3D,
    PolyrectList: PolyrectList
  };

  return main;

}));
//# sourceMappingURL=gdmap-utils.js.map
