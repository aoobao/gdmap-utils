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

  var MIN_ZOOM = 1; // 地图最小级别

  var MAX_ZOOM = 19; // 地图最大级别

  var DEFAULT_IMAGE_WIDTH = 25;
  var DEFAULT_IMAGE_HEIGHT = 35;

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
  /**
   * 筛选出修改目标opt的不相同的属性
   * @param {Object} targetOpt 目标opt
   * @param {Object} changeOpt 需要改变的opt
   * @returns {Object} 返回差异对象(changeopt中的属性值和targetOpt中相同时返回null)
   */

  function getDiffObject(targetOpt, changeOpt) {
    var rst = {};
    var changeFlag = false;

    for (var key in changeOpt) {
      var targetValue = targetOpt[key];

      if (targetValue === undefined) {
        console.warn('目标对象未找到该参数:' + key);
      }

      var value = changeOpt[key];

      if (targetValue !== value) {
        rst[key] = value;
        changeFlag = true;
      }
    }

    return changeFlag ? rst : null;
  }
  /**
   * 返回两个区域的交集
   * @param {*} parentMin 
   * @param {*} parentMax 
   * @param {*} min 
   * @param {*} max 
   */

  function getIntersection(parentMin, parentMax, min, max) {
    var minZoom = parentMin < min ? min : parentMin;
    var maxZoom = parentMax > max ? max : parentMax;
    return {
      minZoom: minZoom,
      maxZoom: maxZoom
    };
  } // 合并obj

  function getMergeObject() {
    for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
      objs[_key] = arguments[_key];
    }

    var rst = objs.reduce(function (pre, sur) {
      if (!sur) return pre;
      return _objectSpread({}, pre, sur);
    }, {});
    return rst;
  } // 求角度

  function getAngle(px, py, mx, my) {
    var x = Math.abs(px - mx);
    var y = Math.abs(py - my);
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    if (z == 0) return 0;
    var cos = y / z;
    var radina = Math.acos(cos); //用反三角函数求弧度

    var angle = 180 * radina / Math.PI; //将弧度转换成角度
    //因为算出来的值是[0,90),需要转成[0,360)

    if (mx >= px) {
      if (my >= py) {
        angle = 90 - angle;
      } else {
        angle = 270 + angle;
      }
    } else {
      if (my >= py) {
        angle = 90 + angle;
      } else {
        angle = 270 - angle;
      }
    }

    return angle;
  }
  function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";

    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }

    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010

    s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
  }

  var Utils = /*#__PURE__*/Object.freeze({
    getDefaultByundefined: getDefaultByundefined,
    transposePolyrect: transposePolyrect,
    getTextWidth: getTextWidth,
    getDiffObject: getDiffObject,
    getIntersection: getIntersection,
    getMergeObject: getMergeObject,
    getAngle: getAngle,
    uuid: uuid
  });

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
   * offsetTop:Number
   * offsetLeft:Number
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
        this._offsetTop = opt.offsetTop || 0;
        this._offsetLeft = opt.offsetLeft || 0;

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
          offset: new AMap.Pixel(-width / 2 + this._offsetLeft, -height / 2 + this._offsetTop),
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
          this._polyrects = [];
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

  var css$1 = ".dcmap-text3d-container {\n  width: 0;\n  display: flex;\n  flex-flow: column nowrap;\n  justify-content: space-between;\n  align-items: center;\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d; }\n  .dcmap-text3d-container .map-point-text-dom {\n    width: 500px;\n    display: flex;\n    justify-content: center;\n    font-size: 16px;\n    pointer-events: none; }\n  .dcmap-text3d-container .map-point-img-dom {\n    width: 25px;\n    height: 35px;\n    margin: 3px 0;\n    background-image: url(\"http://qn.fengyitong.name/point.png\"); }\n  .dcmap-text3d-container .map-point-small-circle {\n    position: absolute;\n    width: 54px;\n    height: 54px;\n    bottom: -20px;\n    left: 50%;\n    margin-left: -27px;\n    background-color: #0080fe;\n    opacity: 0.5;\n    border-radius: 50%;\n    -webkit-animation: delayLiving 1.5s linear infinite;\n            animation: delayLiving 1.5s linear infinite;\n    display: none; }\n  .dcmap-text3d-container .map-point-large-circle {\n    position: absolute;\n    width: 116px;\n    height: 116px;\n    bottom: -50px;\n    left: 50%;\n    margin-left: -58px;\n    background-color: #0080fe;\n    border-radius: 50%;\n    opacity: 0;\n    -webkit-animation: bigliving 1.5s linear infinite;\n            animation: bigliving 1.5s linear infinite;\n    display: none; }\n\n@-webkit-keyframes delayLiving {\n  0% {\n    -webkit-transform: rotateX(60deg) scale3d(0, 0, 1);\n            transform: rotateX(60deg) scale3d(0, 0, 1);\n    opacity: 0.1; }\n  30% {\n    -webkit-transform: rotateX(60deg) scale3d(0, 0, 1);\n            transform: rotateX(60deg) scale3d(0, 0, 1);\n    opacity: 0.5; }\n  100% {\n    -webkit-transform: rotateX(60deg) scale3d(1, 1, 1);\n            transform: rotateX(60deg) scale3d(1, 1, 1);\n    opacity: 0; } }\n\n@keyframes delayLiving {\n  0% {\n    -webkit-transform: rotateX(60deg) scale3d(0, 0, 1);\n            transform: rotateX(60deg) scale3d(0, 0, 1);\n    opacity: 0.1; }\n  30% {\n    -webkit-transform: rotateX(60deg) scale3d(0, 0, 1);\n            transform: rotateX(60deg) scale3d(0, 0, 1);\n    opacity: 0.5; }\n  100% {\n    -webkit-transform: rotateX(60deg) scale3d(1, 1, 1);\n            transform: rotateX(60deg) scale3d(1, 1, 1);\n    opacity: 0; } }\n\n@-webkit-keyframes bigliving {\n  0% {\n    -webkit-transform: rotateX(60deg) scale3d(0, 0, 1);\n            transform: rotateX(60deg) scale3d(0, 0, 1);\n    opacity: 0.3; }\n  /* 50% {\r\n      transform: scale(2);\r\n      opacity: 0;\r\n    } */\n  70% {\n    -webkit-transform: rotateX(60deg) scale3d(0.8, 0.8, 1);\n            transform: rotateX(60deg) scale3d(0.8, 0.8, 1);\n    opacity: 0.1; }\n  100% {\n    -webkit-transform: rotateX(60deg) scale3d(1, 1, 1);\n            transform: rotateX(60deg) scale3d(1, 1, 1);\n    opacity: 0; } }\n\n@keyframes bigliving {\n  0% {\n    -webkit-transform: rotateX(60deg) scale3d(0, 0, 1);\n            transform: rotateX(60deg) scale3d(0, 0, 1);\n    opacity: 0.3; }\n  /* 50% {\r\n      transform: scale(2);\r\n      opacity: 0;\r\n    } */\n  70% {\n    -webkit-transform: rotateX(60deg) scale3d(0.8, 0.8, 1);\n            transform: rotateX(60deg) scale3d(0.8, 0.8, 1);\n    opacity: 0.1; }\n  100% {\n    -webkit-transform: rotateX(60deg) scale3d(1, 1, 1);\n            transform: rotateX(60deg) scale3d(1, 1, 1);\n    opacity: 0; } }\n";
  styleInject(css$1);

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

  var Text3D =
  /*#__PURE__*/
  function (_Overlays) {
    _inherits(Text3D, _Overlays);

    function Text3D(opt) {
      var _this;

      _classCallCheck(this, Text3D);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Text3D).call(this, opt));
      _this._clickHandle = _this._clickHandle.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this._mouseOut = _this._mouseOut.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      _this._mouseOver = _this._mouseOver.bind(_assertThisInitialized(_assertThisInitialized(_this)));

      _this._initialize(opt || {});

      return _this;
    }

    _createClass(Text3D, [{
      key: "_initialize",
      value: function _initialize(opt) {
        this._text = opt.text || '';
        this._textColor = opt.textColor;
        this._showRipples = !!opt.isShowRipples;
        this._imageOption = opt.imageOption || {};
        this._className = opt.className;
        this._click = opt.click;
        this._mouseover = opt.mouseover;
        this._mouseout = opt.mouseout;

        this._createMarker();
      } // 展示涟漪效果

    }, {
      key: "showRipples",
      value: function showRipples() {
        var dom = this._dom;
        dom.smallCircle.style.display = 'block';
        dom.largeCircle.style.display = 'block';
        this._showRipples = true;
      }
    }, {
      key: "closeRipples",
      value: function closeRipples() {
        var dom = this._dom;
        dom.smallCircle.style.display = '';
        dom.largeCircle.style.display = '';
        this._showRipples = false;
      }
    }, {
      key: "_clickHandle",
      value: function _clickHandle(e) {
        typeof this._click === 'function' && this._click.call(this, this.getExtData(), e);
      }
    }, {
      key: "_mouseOut",
      value: function _mouseOut(e) {
        typeof this._mouseout === 'function' && this._mouseout.call(this, this.getExtData(), e);
      }
    }, {
      key: "_mouseOver",
      value: function _mouseOver(e) {
        typeof this._mouseover === 'function' && this._mouseover.call(this, this.getExtData(), e);
      }
    }, {
      key: "_createMarker",
      value: function _createMarker() {
        var dom = this._dom = this._createElement();

        var height = this._imageOption.height || DEFAULT_IMAGE_HEIGHT;
        dom.body.addEventListener('mouseenter', this._mouseOver);
        dom.body.addEventListener('mouseleave', this._mouseOut);
        dom.body.addEventListener('click', this._clickHandle);
        var marker = new AMap.Marker({
          position: this.__position,
          offset: new AMap.Pixel(0, -height - 20),
          content: dom.body,
          zIndex: this.getzIndex()
        });
        this.setOverlays(marker);

        if (this._showRipples) {
          this.showRipples();
        }
      }
    }, {
      key: "getValue",
      value: function getValue() {
        // return this._dom.text.innerText
        return this._text;
      }
    }, {
      key: "setValue",
      value: function setValue(value) {
        this._dom.text.innerText = strText;
        this._text = strText;
      }
    }, {
      key: "_createElement",
      value: function _createElement() {
        var height = this._imageOption.height || DEFAULT_IMAGE_HEIGHT;
        var body = document.createElement('div');
        body.className = 'dcmap-text3d-container ' + this._className;
        body.style.height = height + 30 + 'px'; // 涟漪效果

        var smallCircle = document.createElement('div');
        smallCircle.className = 'map-point-small-circle';
        body.appendChild(smallCircle);
        var largeCircle = document.createElement('div');
        largeCircle.className = 'map-point-large-circle';
        body.appendChild(largeCircle);
        var text = document.createElement('span');
        text.className = 'map-point-text-dom';
        text.style.color = this._textColor;
        text.innerText = this._text;
        body.appendChild(text);
        var img = document.createElement('div');
        img.className = 'map-point-img-dom';
        img.style.width = this._imageOption.width || DEFAULT_IMAGE_WIDTH;
        img.style.height = height;

        if (this._imageOption.src) {
          img.style.backgroundImage = "url('".concat(this._imageOption.src, "')");
        }

        body.appendChild(img);
        return {
          body: body,
          text: text,
          img: img,
          smallCircle: smallCircle,
          largeCircle: largeCircle
        };
      }
    }]);

    return Text3D;
  }(Overlays);

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

  var RadarChart =
  /*#__PURE__*/
  function () {
    function RadarChart(opt) {
      _classCallCheck(this, RadarChart);

      this._draw = this._draw.bind(this);

      this._initialize(opt || {});
    }

    _createClass(RadarChart, [{
      key: "_initialize",
      value: function _initialize(opt) {
        this._map = opt.map;
        this._center = opt.center;
        this._target = opt.target;
        this._speed = opt.speed || 60;
        this._coverNumber = opt.coverNumber || 0.2;
        this._fillStyle = opt.fillStyle || 'rgba(0,200,0,0.7)';
        this._callback = opt.callback;
        this._isStart = false;
        this._deg = 360 - ~~getAngle.apply(void 0, _toConsumableArray(this._center).concat(_toConsumableArray(this._target)));

        this._createCanvasLayer();
      }
    }, {
      key: "_createCanvasLayer",
      value: function _createCanvasLayer() {
        var canvas = this._canvas = document.createElement('canvas');
        this._ctx = canvas.getContext('2d');
        var positionObj = getPixel(this._center, this._target);

        var minPixel = this._map.lngLatToContainer(positionObj.minPosition);

        var maxPixel = this._map.lngLatToContainer(positionObj.maxPosition); //canvas.width = this._width = maxPixel.getX() - minPixel.getX()
        //canvas.height = this._height = minPixel.getY() - maxPixel.getY()


        canvas.width = canvas.height = this._width = this._height = maxPixel.getX() - minPixel.getX(); // console.log(this._width, this._height, '宽高')

        this._clayer = new AMap.CanvasLayer({
          canvas: canvas,
          bounds: new AMap.Bounds(positionObj.minPosition, positionObj.maxPosition),
          zIndex: 100
        }); // this._canvas2 = document.createElement('canvas')
        // this._ctx2 = this._canvas2.getContext('2d')
        // this._canvas2.width = this._canvas2.height = canvas.width
        // this._clayer2 = new AMap.CanvasLayer({
        //   canvas: this._canvas2,
        //   bounds: new AMap.Bounds(positionObj.minPosition, positionObj.maxPosition),
        //   zIndex: 101
        // })
        // this._drawCircle()

        this._clayer.setMap(this._map); // this._clayer2.setMap(this._map)

      }
    }, {
      key: "start",
      value: function start() {
        if (this._isStart) return;
        this._isStart = true;

        this._draw();
      }
    }, {
      key: "stop",
      value: function stop() {
        var _this = this;

        if (this._isStart) {
          this._isStart = false;
          setTimeout(function () {
            _this._ctx.clearRect(0, 0, _this._width, _this._height);
          }, 1);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.stop();

        this._clayer.setMap(null);

        this._clayer = null;
      }
    }, {
      key: "_drawCircle",
      value: function _drawCircle() {
        var radius = (this._width > this._height ? this._height : this._width) / 2;
        var ctx = this._ctx2;
        ctx.clearRect(0, 0, this._width, this._height);
        ctx.fillStyle = this._fillStyle;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.moveTo(this._width / 2, this._height / 2);
        ctx.arc(this._width / 2, this._height / 2, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
      }
    }, {
      key: "_draw",
      value: function _draw() {
        var startDeg = this._deg;
        this._deg += 360 / this._speed;
        if (this._deg >= 360) this._deg = this._deg - 360;

        if (!this._isStart) {
          return;
        }

        this._drawRadar();

        this._cover(); // ctx.fill()


        this._clayer.reFresh();

        if (typeof this._callback === 'function') {
          this._callback.call(this, {
            start: startDeg,
            end: this._deg > startDeg ? this._deg : this._deg + startDeg
          });
        }

        window.requestAnimationFrame(this._draw);
      }
    }, {
      key: "_drawRadar",
      value: function _drawRadar() {
        var deg = this._deg;
        var ctx = this._ctx;
        var radius = (this._width > this._height ? this._height : this._width) / 2;
        ctx.save();
        ctx.fillStyle = this._fillStyle;
        ctx.beginPath();
        ctx.moveTo(this._width / 2, this._height / 2);
        ctx.arc(this._width / 2, this._height / 2, radius, (-360 / this._speed + deg) / 180 * Math.PI, deg / 180 * Math.PI); // ctx.arc(this._width / 2, this._height / 2, radius, 0, 2 / 180 * Math.PI)

        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }, {
      key: "_cover",
      value: function _cover() {
        var ctx = this._ctx;
        ctx.save();
        var radius = (this._width > this._height ? this._height : this._width) / 2;
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,".concat(this._coverNumber, ")"); // let centerPixel = this._map.lngLatToContainer(this._center)
        // ctx.arc(this._width / 2, this._height / 2, radius, 0, 2 * Math.PI)

        ctx.rect(0, 0, this._width, this._height);
        ctx.fill();
        ctx.restore();
      }
    }, {
      key: "_clearRect",
      value: function _clearRect() {
        var ctx = this._ctx;
        ctx.clearRect(0, 0, this.width, this.height);
      }
    }]);

    return RadarChart;
  }();

  function getPixel(center, target) {
    var dis = Math.sqrt(Math.pow(target[0] - center[0], 2) + Math.pow(target[1] - center[1], 2));
    return {
      minPosition: [center[0] - dis, center[1] - dis],
      maxPosition: [center[0] + dis, center[1] + dis]
    };
  }

  /**
   * opt
   * map
   * textColor
   * font
   */
  var TextQueue =
  /*#__PURE__*/
  function () {
    function TextQueue(opt) {
      _classCallCheck(this, TextQueue);

      this._draw = this._draw.bind(this);

      this._initialize(opt || {});
    }

    _createClass(TextQueue, [{
      key: "_initialize",
      value: function _initialize(opt) {
        this._map = opt.map;
        this._list = [];
        this._textColor = opt.textColor || '#fff';
        this._font = opt.font || '20px Arial';
        this._start = false;

        this._createLayer();
      }
    }, {
      key: "_createLayer",
      value: function _createLayer() {
        var canvas = this._canvas = document.createElement('canvas');
        this._ctx = canvas.getContext('2d');

        var size = this._map.getSize();

        canvas.width = this._width = size.width;
        canvas.height = this._height = size.height;
        this._cus = new AMap.CustomLayer(canvas, {
          map: this._map,
          zIndex: 100
        });
        this._cus.render = this.reload.bind(this);
      }
    }, {
      key: "reload",
      value: function reload() {
        this._list = this._list.map(function (t) {
          return _objectSpread({}, t, {
            _pixel: null
          });
        });
      }
    }, {
      key: "_draw",
      value: function _draw() {
        if (this.getMap() != null) {
          this._clearCanvas();

          this._drawCanvas();

          if (this._list.length > 0) {
            window.requestAnimationFrame(this._draw);
          } else {
            this._start = false;
          }
        } else {
          this._start = false;
        }
      }
    }, {
      key: "_clearCanvas",
      value: function _clearCanvas() {
        var ctx = this._ctx;
        ctx.clearRect(0, 0, this._width, this._height);
      }
    }, {
      key: "_drawCanvas",
      value: function _drawCanvas() {
        if (this.getMap() == null) return; // console.log('draw')

        var ctx = this._ctx;
        var now = Date.now();
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle";
        ctx.fillStyle = this._textColor;
        ctx.font = this._font;

        for (var i = 0; i < this._list.length; i++) {
          var obj = this._list[i];
          var timer = (now - obj._time) / 1000;

          if (timer > 3) {
            obj._del = true;
            continue;
          }

          var pixel = obj._pixel || this._map.lngLatToContainer(obj.position);

          obj._pixel = pixel;
          ctx.save();
          ctx.translate(pixel.getX(), pixel.getY());
          var scale = 1; // 缩放因子

          var opacity = 1;

          if (timer < 1) {
            // 放大
            scale = scale / timer;
            opacity = timer;
          } else if (timer > 2) {
            // 缩小
            // scale = 3 - timer
            opacity = 3 - timer;
            scale = opacity;
          }

          if (scale != 1) {
            ctx.scale(scale, scale);
          }

          if (opacity != 1) {
            ctx.globalAlpha = opacity;
          }

          if (obj.textColor) {
            ctx.fillStyle = obj.textColor;
          }

          if (obj.font) {
            ctx.font = obj.font;
          }

          ctx.fillText(obj.text, 0, 0);
          ctx.restore();
        }

        this._list = this._list.filter(function (t) {
          return !t._del;
        });
      }
      /**
       * 加入到弹幕队列
       * @param {Object} objs 
       * position : [x,y]
       * text : String 文本信息
       * textColor : 文字颜色
       * font : String
       */

    }, {
      key: "push",
      value: function push() {
        var _this = this;

        for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
          objs[_key] = arguments[_key];
        }

        objs.forEach(function (obj) {
          _this._list.push(_objectSpread({}, obj, {
            _time: Date.now()
          }));
        });

        if (!this._start) {
          this._start = true;

          this._draw();
        }
      }
    }, {
      key: "setMap",
      value: function setMap(map) {
        this._map = map;

        this._cus.setMap(map);

        if (map == null) {
          this._start = false;
        } else if (!this._start) {
          this._start = true;

          this._draw();
        }
      }
    }, {
      key: "getMap",
      value: function getMap() {
        return this._map || null;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.setMap(null);
        this._cus = null;
      }
    }]);

    return TextQueue;
  }();

  var css$2 = ".dcmap-shadowtext-container {\n  -webkit-perspective: 2000px;\n          perspective: 2000px;\n  position: relative; }\n  .dcmap-shadowtext-container .dcmap-shadowtext-text {\n    display: flex;\n    justify-content: center; }\n  .dcmap-shadowtext-container .dcmap-shadowtext-shadow {\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    -webkit-transform: rotateX(65deg);\n            transform: rotateX(65deg);\n    background: radial-gradient(ellipse, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0) 60%); }\n";
  styleInject(css$2);

  var ShadowText =
  /*#__PURE__*/
  function (_Overlays) {
    _inherits(ShadowText, _Overlays);

    function ShadowText(opt) {
      var _this;

      _classCallCheck(this, ShadowText);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ShadowText).call(this, opt));

      _this._initialize(opt || {});

      return _this;
    }

    _createClass(ShadowText, [{
      key: "_initialize",
      value: function _initialize(opt) {
        this._text = opt.text || '未输入文字';
        this._textColor = opt.textColor || '#fff';
        this._textSize = opt.textSize || 20;
        this._shaderRatio = opt.shaderRatio || 1.2;
        this._offsetTop = opt.offsetTop || 0;
        this._offsetLeft = opt.offsetLeft || 0;

        this._createMarker();
      }
    }, {
      key: "_createMarker",
      value: function _createMarker() {
        var width = getTextWidth(this._text, this._textSize);
        var height = this._textSize;
        this._dom = this._createElement(height, width);
        var marker = new AMap.Marker({
          position: this.getPosition(),
          offset: new AMap.Pixel(-this._shaderRatio * width / 2 + this._offsetLeft, -height / 3 * 2 + this._offsetTop),
          content: this._dom.body,
          zIndex: this.getzIndex()
        });
        this.setOverlays(marker);
      }
    }, {
      key: "_createElement",
      value: function _createElement(height, width) {
        var body = document.createElement('div');
        body.className = 'dcmap-shadowtext-container';
        body.style.width = width * this._shaderRatio + 'px';
        body.style.height = height * 2 + 'px';
        var text = document.createElement('div');
        text.className = 'dcmap-shadowtext-text';
        text.style.fontSize = this._textSize + 'px';
        text.style.color = this._textColor;
        text.innerText = this._text;
        body.appendChild(text);
        var shadow = document.createElement('div');
        shadow.className = 'dcmap-shadowtext-shadow';
        shadow.style.top = height / 2 + 'px';
        body.appendChild(shadow);
        return {
          body: body,
          text: text,
          shadow: shadow
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

    return ShadowText;
  }(Overlays);

  /**
   * 3个数中取中位数
   * @param {Number} a 
   * @param {Number} b 
   * @param {Number} c 
   */
  function getMedian(a, b, c) {
    if ((b - a) * (a - c) >= 0) {
      return a;
    } else if ((a - b) * (b - c) >= 0) {
      return b;
    } else {
      return c;
    }
  }

  var gl_Overlays =
  /*#__PURE__*/
  function () {
    function gl_Overlays(opt) {
      _classCallCheck(this, gl_Overlays);

      this.__initialize(opt || {});
    }

    _createClass(gl_Overlays, [{
      key: "__initialize",
      value: function __initialize(opt) {
        this.CLASS_NAME = this.constructor.name;
        this.__object3DLayer = opt.object3DLayer;
        this.__map = opt.map;
        this.__extData = opt.extData;
      } // 对overlays递归调用methodName方法.

      /**
       * 
       * @param {Object} overlays 
       * @param {Function} method 
       * @param {*} methodArguments 
       */

    }, {
      key: "__callMethod",
      value: function __callMethod(obj, methodName, overlays) {
        var _this = this;

        if (overlays == null) return;

        if (Array.isArray(overlays)) {
          overlays.forEach(function (o) {
            // o[methodName](...methodArguments)
            _this.__callMethod(obj, methodName, o);
          });
        } else if (overlays !== undefined) {
          // method(overlays, ...methodArguments)
          obj[methodName](overlays);
        } else {
          console.warn('传入值不是实例对象', overlays);
        }
      }
    }, {
      key: "getExtData",
      value: function getExtData() {
        return this.__extData;
      }
    }, {
      key: "setExtData",
      value: function setExtData(data) {
        this.__extData = data;
      }
    }, {
      key: "getMap",
      value: function getMap() {
        return this.__map;
      }
    }, {
      key: "setMap",
      value: function setMap(map) {
        this.__map = map;
      }
    }, {
      key: "getObject3DLayer",
      value: function getObject3DLayer() {
        return this.__object3DLayer || null;
      }
    }, {
      key: "setObject3DLayer",
      value: function setObject3DLayer(object3dLayer) {
        this.__object3DLayer = object3dLayer;
      } // object3d

    }, {
      key: "getOverlays",
      value: function getOverlays() {
        return this.__overlays;
      }
    }, {
      key: "setOverlays",
      value: function setOverlays(overlays) {
        this.__overlays = overlays;
      }
    }, {
      key: "show",
      value: function show() {
        var object3DLayer = this.__object3DLayer;

        if (object3DLayer) {
          var overlays = this.getOverlays(); // this.__callMethod(overlays, object3DLayer.add)

          this.__callMethod(object3DLayer, 'add', overlays);
        }
      }
    }, {
      key: "hide",
      value: function hide() {
        var object3DLayer = this.__object3DLayer;

        if (object3DLayer) {
          var overlays = this.getOverlays(); // this.__callMethod(overlays, object3DLayer.remove)

          this.__callMethod(object3DLayer, 'remove', overlays);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.hide();
        this.__object3DLayer = null;
      }
    }]);

    return gl_Overlays;
  }();

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

  var gl_Polyrect =
  /*#__PURE__*/
  function (_gl_Overlays) {
    _inherits(gl_Polyrect, _gl_Overlays);

    function gl_Polyrect(opt) {
      var _this;

      _classCallCheck(this, gl_Polyrect);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(gl_Polyrect).call(this, opt));

      _this._initialize(opt || {});

      _this._clickHandle = _this._clickHandle.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      return _this;
    }

    _createClass(gl_Polyrect, [{
      key: "_initialize",
      value: function _initialize(opt) {
        this._height = opt.height || 5000;
        this._color = opt.color || '#0088ffcc';
        this._transparent = getDefaultByundefined(opt.transparent, true);
        var list = transposePolyrect(opt.coordinate);
        this._coordinate = this.lngLatToGeodeticCoord(list);
        this._click = opt.click;
        this._position = opt.position;
        this._textOption = opt.textOption || {
          text: opt.text || '未输入文字内容',
          textColor: opt.textColor || 'red'
        };
        var TextClass = getDefaultByundefined(opt.textClass, NormalText);
        if (TextClass) this._createText(TextClass);
      }
    }, {
      key: "_clickHandle",
      value: function _clickHandle() {}
    }, {
      key: "_createText",
      value: function _createText(TextClass) {
        if (this._textObj) {
          typeof this._textObj.destroy === 'function' && this._textObj.destroy();
          this._textObj = null;
        }

        var opt = _objectSpread({
          map: this.getMap(),
          position: this._position
        }, this._textOption);

        this._textObj = new TextClass(opt);
      }
    }, {
      key: "getOverlays",
      value: function getOverlays() {
        var prism = this._prism;

        if (!prism) {
          prism = new AMap.Object3D.Prism({
            path: this._coordinate,
            height: this._height,
            color: this._color
          });
          prism.transparent = this._transparent;
          this._prism = prism;
        } // console.log(prism)


        return prism;
      }
    }, {
      key: "show",
      value: function show() {
        _get(_getPrototypeOf(gl_Polyrect.prototype), "show", this).call(this);

        if (this._textObj) {
          this._textObj.setMap(this.getMap());
        }
      }
    }, {
      key: "hide",
      value: function hide() {
        _get(_getPrototypeOf(gl_Polyrect.prototype), "hide", this).call(this);

        if (this._textObj) {
          this._textObj.setMap(null);
        }
      }
    }, {
      key: "getText",
      value: function getText() {
        return this._textObj || null;
      }
    }, {
      key: "lngLatToGeodeticCoord",
      value: function lngLatToGeodeticCoord(list) {
        var map = this.getMap();

        for (var i = 0; i < list.length; i++) {
          var area = list[i];

          for (var s = 0; s < area.length; s++) {
            var g = map.lngLatToGeodeticCoord(area[s]);
            area[s] = g;
          }
        }

        return list;
      }
    }]);

    return gl_Polyrect;
  }(gl_Overlays);

  /**
   * opt
   * map 必传
   * object3DLayer
   * color
   * height
   * transparent
   * textOption
   * textClass
   * click
   */

  var gl_PolyrectList =
  /*#__PURE__*/
  function (_gl_Overlays) {
    _inherits(gl_PolyrectList, _gl_Overlays);

    function gl_PolyrectList(opt) {
      var _this;

      _classCallCheck(this, gl_PolyrectList);

      if (!opt.object3DLayer) {
        opt.object3DLayer = new AMap.Object3DLayer();
        opt.object3DLayer.setMap(opt.map);
      }

      _this = _possibleConstructorReturn(this, _getPrototypeOf(gl_PolyrectList).call(this, opt));
      _this._clickHandle = _this._clickHandle.bind(_assertThisInitialized(_assertThisInitialized(_this)));

      _this._initialize(opt);

      return _this;
    }

    _createClass(gl_PolyrectList, [{
      key: "_initialize",
      value: function _initialize(opt) {
        this._height = opt.height || 5000;
        this._color = opt.color || '#0088ffcc';
        this._transparent = getDefaultByundefined(opt.transparent, true);
        this._textOption = opt.textOption;
        this._textClass = opt.textClass;
        this._click = opt.click;
        this._polyrects = [];
      }
    }, {
      key: "_clickHandle",
      value: function _clickHandle(polyrect, data) {
        typeof this._click === 'function' && this._click(polyrect, data);
      }
      /**
       * 
       * @param {Array(opt)} list 
       * opt : 
       * coordinate 必传
       * color
       * height
       * transparent
       * extData
       * textOption
       * position 有文字需传
       * textClass
       */

    }, {
      key: "setData",
      value: function setData(list) {
        var _this2 = this;

        var show = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        this.clear();
        var g = getDefaultByundefined;
        this._polyrects = list.map(function (item) {
          var opt = {
            map: _this2.getMap(),
            object3DLayer: _this2.getObject3DLayer(),
            coordinate: item.coordinate,
            color: g(item.color, _this2._color),
            height: g(item.height, _this2._height),
            transparent: g(item.transparent, _this2._transparent),
            extData: item.extData || item,
            position: item.position,
            textClass: g(item.textClass, _this2._textClass),
            textOption: getMergeObject(_this2._textOption, item.textOption)
          };
          return new gl_Polyrect(opt);
        });

        if (show) {
          this.show();
        }
      }
    }, {
      key: "getOverlays",
      value: function getOverlays() {
        // return [...this._polyrects]
        return this._polyrects.map(function (polyrect) {
          return polyrect.getOverlays();
        });
      }
    }, {
      key: "clear",
      value: function clear() {
        var list = this.getOverlays();

        if (list && list.length) {
          list.forEach(function (polyrect) {
            polyrect.destroy();
          });
        }

        this._polyrects = [];
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(gl_PolyrectList.prototype), "destroy", this).call(this);
      }
    }]);

    return gl_PolyrectList;
  }(gl_Overlays);

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

  var gl_RegularPrism =
  /*#__PURE__*/
  function (_gl_Overlays) {
    _inherits(gl_RegularPrism, _gl_Overlays);

    function gl_RegularPrism(opt) {
      var _this;

      _classCallCheck(this, gl_RegularPrism);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(gl_RegularPrism).call(this, opt));

      _this._initialize(opt || {});

      return _this;
    }

    _createClass(gl_RegularPrism, [{
      key: "_initialize",
      value: function _initialize(opt) {
        this._height = getDefaultByundefined(opt.height, 1000);
        this._radius = getDefaultByundefined(opt.radius, 1000);
        this._segment = getDefaultByundefined(opt.segment, 4);
        this._transparent = getDefaultByundefined(opt.transparent, true);
        this._color = opt.color || [0, 0, 1, 0.4];
        this._topColor = opt.topColor;
        this._bottomColor = opt.bottomColor;
        this._topFaceColor = opt.topFaceColor;
        this._position = opt.position;

        this._createMesh();
      }
    }, {
      key: "getTopColor",
      value: function getTopColor() {
        return this._topColor || this._color;
      }
    }, {
      key: "getBottomColor",
      value: function getBottomColor() {
        return this._bottomColor || this._color;
      }
    }, {
      key: "getTopFaceColor",
      value: function getTopFaceColor() {
        return this._topFaceColor || this._color;
      }
    }, {
      key: "_createMesh",
      value: function _createMesh() {
        var segment = this._segment;
        var radius = this._radius;
        var center = this.getMap().lngLatToGeodeticCoord(this._position);
        var height = this._height;
        var topColor = this.getTopColor();
        var bottomColor = this.getBottomColor();
        var topFaceColor = this.getTopFaceColor(); // let bottomColor =

        var cylinder = new AMap.Object3D.Mesh();
        var geometry = cylinder.geometry;
        var verticesLength = this._segment * 2;
        var path = [];

        for (var i = 0; i < segment; i++) {
          var _geometry$vertexColor;

          var angle = 2 * Math.PI * i / segment;
          var x = center.x + Math.cos(angle) * radius;
          var y = center.y + Math.sin(angle) * radius;
          path.push([x, y]);
          geometry.vertices.push(x, y, 0); //增加底部顶点

          geometry.vertices.push(x, y, -height); //增加顶部顶点
          // 加载颜色

          (_geometry$vertexColor = geometry.vertexColors).push.apply(_geometry$vertexColor, _toConsumableArray(bottomColor).concat(_toConsumableArray(topColor)));

          var bottomIndex = i * 2;
          var topIndex = bottomIndex + 1;
          var nextBottomIndex = (bottomIndex + 2) % verticesLength;
          var nextTopIndex = (bottomIndex + 3) % verticesLength;
          geometry.faces.push(bottomIndex, topIndex, nextTopIndex); //侧面三角形1

          geometry.faces.push(bottomIndex, nextTopIndex, nextBottomIndex); //侧面三角形2
        } // 因为顶部可能是单独的颜色,不可以使用原来的faces索引,需要单独给顶点增加索引(通用使用)


        for (var _i = 0; _i < segment; _i++) {
          var _geometry$vertices, _geometry$vertexColor2;

          // 读到所有的顶部的顶点,加在vertices最后面
          (_geometry$vertices = geometry.vertices).push.apply(_geometry$vertices, _toConsumableArray(geometry.vertices.slice(_i * 6 + 3, _i * 6 + 6)));

          (_geometry$vertexColor2 = geometry.vertexColors).push.apply(_geometry$vertexColor2, _toConsumableArray(topFaceColor));
        }

        var triangles = AMap.GeometryUtil.triangulateShape(path);
        var offset = segment * 2;

        for (var v = 0; v < triangles.length; v += 3) {
          geometry.faces.push(triangles[v] + offset, triangles[v + 2] + offset, triangles[v + 1] + offset);
        }

        cylinder.transparent = this._transparent;
        this.setOverlays(cylinder);
      }
      /**
       * 修改圆柱体颜色
       * @param {Object} colors 
       * topColor :Array<Number> [r,g,b,q] rgba (0-1之间取值) 必须4个值
       * topFaceColor : 同上
       * bottomColor : 同上
       * color : 颜色(优先使用上面的颜色)
       */

    }, {
      key: "setColor",
      value: function setColor(colors) {
        var draw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        if (colors.color) this._color = colors.color;
        if (colors.topColor) this._topColor = colors.topColor;
        if (colors.bottomColor) this._bottomColor = colors.bottomColor;
        if (colors.topFaceColor) this._topFaceColor = colors.topFaceColor;

        this._updateColor(draw);
      }
    }, {
      key: "getColor",
      value: function getColor() {
        return {
          topColor: this._topColor,
          bottomColor: this._bottomColor,
          topFaceColor: this._topFaceColor,
          color: this._color
        };
      }
    }, {
      key: "_updateColor",
      value: function _updateColor() {
        var _mesh$geometry$vertex;

        var draw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var mesh = this.getOverlays();
        var vertexColors = [];
        var segment = this._segment;
        var bottomColor = this.getBottomColor();
        var topColor = this.getTopColor();
        var topFaceColor = this.getTopFaceColor();

        for (var i = 0; i < segment; i++) {
          vertexColors.push.apply(vertexColors, _toConsumableArray(bottomColor).concat(_toConsumableArray(topColor)));
        } // 顶部颜色


        for (var _i2 = 0; _i2 < segment; _i2++) {
          vertexColors.push.apply(vertexColors, _toConsumableArray(topFaceColor));
        }

        (_mesh$geometry$vertex = mesh.geometry.vertexColors).splice.apply(_mesh$geometry$vertex, [0, mesh.geometry.vertexColors.length].concat(vertexColors));

        mesh.needUpdate = true;

        if (draw) {
          mesh.reDraw();
        }
      }
    }, {
      key: "getHeight",
      value: function getHeight() {
        return this._height;
      } // 设置圆柱体高度

    }, {
      key: "setHeight",
      value: function setHeight() {
        var height = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
        var draw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        this._height = height;
        var mesh = this.getOverlays();
        var vertices = mesh.geometry.vertices;
        var segment = this._segment;

        for (var i = 0; i < segment; i++) {
          // 修改每个顶点的高度值
          var _z = i * 6 + 5;

          vertices[_z] = -height;
        } // 后面还有单独的顶部顶点(顶部顶点通用设计,给单独顶点)


        var z = segment * 6 - 1; // (拿到最后一个圆柱体索引,索引从0开始所以-1)

        for (var _i3 = z + 3; _i3 < vertices.length; _i3 += 3) {
          vertices[_i3] = -height;
        }

        mesh.needUpdate = true;

        if (draw) {
          mesh.reDraw();
        }
      }
    }, {
      key: "getRadius",
      value: function getRadius() {
        return this._radius;
      } // 修改半径后所有的x,y坐标需要重新计算,和所有顶点重绘性能区别不大,不单独写了

    }, {
      key: "setRadius",
      value: function setRadius() {
        var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
        var draw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        this._radius = radius;

        this._updateVertices(draw);
      }
    }, {
      key: "getPosition",
      value: function getPosition() {
        return this._position;
      }
    }, {
      key: "setPosition",
      value: function setPosition() {
        var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [120, 30];
        var draw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        this._position = position;

        this._updateVertices(draw);
      } // 对顶点坐标进行刷新(segment不能发生改变)

    }, {
      key: "_updateVertices",
      value: function _updateVertices() {
        var _mesh$geometry$vertic;

        var draw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var segment = this._segment;
        var radius = this._radius;
        var center = this.getMap().lngLatToGeodeticCoord(this._position);
        var height = this._height;
        var mesh = this.getOverlays();
        var vertices = [];

        for (var i = 0; i < segment; i++) {
          var angle = 2 * Math.PI * i / segment;
          var x = center.x + Math.cos(angle) * radius;
          var y = center.y + Math.sin(angle) * radius;
          vertices.push(x, y, 0, x, y, -height);
        }

        for (var _i4 = 0; _i4 < segment; _i4++) {
          vertices.push.apply(vertices, _toConsumableArray(vertices.slice(_i4 * 6 + 3, _i4 * 6 + 6)));
        }

        (_mesh$geometry$vertic = mesh.geometry.vertices).splice.apply(_mesh$geometry$vertic, [0, mesh.geometry.vertices.length].concat(vertices));

        mesh.needUpdate = true;

        if (draw) {
          mesh.reDraw();
        }
      }
    }, {
      key: "reDraw",
      value: function reDraw() {
        var overlays = this.getOverlays();
        overlays.reDraw(); // this.__callMethod(overlays, 'reDraw', null)
      }
    }]);

    return gl_RegularPrism;
  }(gl_Overlays);

  /**
   * opt
   * map 必传
   * object3DLayer
   * radius : Int 半径
   * height : Int 高度
   * segment : Int 分割数量
   * topColor :Array<Number> [r,g,b,q] rgba (0-1之间取值) 必须4个值
   * topFaceColor : 同上
   * bottomColor : 同上
   * color : 颜色(优先使用上面的颜色)
   * transparent Bool 透明
   */

  var gl_RegularPrismList =
  /*#__PURE__*/
  function (_gl_Overlays) {
    _inherits(gl_RegularPrismList, _gl_Overlays);

    function gl_RegularPrismList(opt) {
      var _this;

      _classCallCheck(this, gl_RegularPrismList);

      if (!opt.object3DLayer) {
        opt.object3DLayer = new AMap.Object3DLayer();
        opt.object3DLayer.setMap(opt.map);
      }

      _this = _possibleConstructorReturn(this, _getPrototypeOf(gl_RegularPrismList).call(this, opt));

      _this._initialize(opt || {});

      return _this;
    }

    _createClass(gl_RegularPrismList, [{
      key: "_initialize",
      value: function _initialize(opt) {
        this._height = getDefaultByundefined(opt.height, 1000);
        this._radius = getDefaultByundefined(opt.radius, 1000);
        this._segment = getDefaultByundefined(opt.segment, 4);
        this._transparent = getDefaultByundefined(opt.transparent, true);
        this._color = opt.color || [0, 0, 1, 0.4];
        this._topColor = opt.topColor;
        this._bottomColor = opt.bottomColor;
        this._topFaceColor = opt.topFaceColor;
        this._animateCache = {};
      }
    }, {
      key: "getTopColor",
      value: function getTopColor() {
        return this._topColor || this._color;
      }
    }, {
      key: "getBottomColor",
      value: function getBottomColor() {
        return this._bottomColor || this._color;
      }
    }, {
      key: "getTopFaceColor",
      value: function getTopFaceColor() {
        return this._topFaceColor || this._color;
      }
    }, {
      key: "setData",
      value: function setData(list) {
        var _this2 = this;

        var show = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        this.clear();
        this._meshs = list.map(function (item) {
          var height = item.height || _this2._height;
          var opt = {
            map: _this2.getMap(),
            object3DLayer: _this2.getObject3DLayer(),
            position: item.position,
            radius: item.radius || _this2._radius,
            height: height,
            segment: item.segment || _this2._segment,
            topColor: item.topColor || _this2.getTopColor(),
            bottomColor: item.bottomColor || _this2.getBottomColor(),
            topFaceColor: item.topFaceColor || _this2.getTopFaceColor(),
            transparent: getDefaultByundefined(item.transparent, _this2._transparent),
            extData: item.extData || item
          };
          var mesh = new gl_RegularPrism(opt); // mesh.__id = Math.random()

          mesh.__id = uuid();
          return mesh;
        });

        if (show) {
          this.show();
        }
      }
    }, {
      key: "updateHeight",
      value: function updateHeight(list) {
        var _this3 = this;

        var equalsFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : equals;
        var animate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20000;

        var meshs = _toConsumableArray(this._meshs);

        list.forEach(function (item) {
          for (var i = 0; i < meshs.length; i++) {
            var mesh = meshs[i];
            var data = mesh.getExtData();

            if (equalsFunc(item, data)) {
              if (animate) {
                var id = mesh.__id;

                if (_this3._animateCache[id]) {
                  _this3._animateCache[id].sourceHeight = item.height;
                } else {
                  _this3._animateCache[id] = {
                    mesh: mesh,
                    sourceHeight: item.height,
                    step: animate,
                    index: null
                  };

                  _this3._animateHeight(id);
                }
              } else {
                mesh.setHeight(item.height);
              }

              meshs.slice(i, 1);
              break;
            }
          }
        });
      }
      /**
       * 更新颜色
       * opt : colorOpt or Array<colorOpt>(当为数组时,colorOpt可以添加标记字段(如id),在equalsFunc中判断返回相同mesh的对象设置颜色)
       * topColor :Array<Number> [r,g,b,q] rgba (0-1之间取值) 必须4个值
       * topFaceColor : 同上
       * bottomColor : 同上
       * color : 颜色(优先使用上面的颜色)
       *
       * @param {Array/Object} opt
       * @param {Function} equalsFunc
       */

    }, {
      key: "updateColor",
      value: function updateColor(opt) {
        var equalsFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : equals;

        if (Array.isArray(opt)) {
          var meshs = _toConsumableArray(this._meshs);

          var list = opt;
          list.forEach(function (item) {
            for (var i = 0; i < meshs.length; i++) {
              var mesh = meshs[i];
              var data = mesh.getExtData();

              if (equalsFunc(item, data)) {
                mesh.setColor(item);
                meshs.slice(i, 1);
                break;
              }
            }
          });
        } else {
          this._meshs.forEach(function (mesh) {
            mesh.setColor(opt);
          });
        }
      }
      /**
       * 更新几何体半径(当opt为数组时,代表每个几何体单独半径设置,可标记相应字段再equalsFunc中比对,默认为id)
       * @param {Array/Object} opt
       * @param {Function} equalsFunc
       */

    }, {
      key: "updateRadius",
      value: function updateRadius(opt) {
        var equalsFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : equals;

        if (Array.isArray(opt)) {
          var meshs = _toConsumableArray(this._meshs);

          var list = opt;
          list.forEach(function (item) {
            for (var i = 0; i < meshs.length; i++) {
              var mesh = meshs[i];
              var data = mesh.getExtData();

              if (equalsFunc(item, data)) {
                mesh.setRadius(item.radius);
                meshs.slice(i, 1);
                break;
              }
            }
          });
        } else {
          this._meshs.forEach(function (mesh) {
            mesh.setRadius(opt.radius);
          });
        }
      }
    }, {
      key: "_animateHeight",
      value: function _animateHeight(id) {
        var _this4 = this;

        var source = this._animateCache[id];
        var mesh = source.mesh;
        var sourceHeight = source.sourceHeight;
        var height = mesh.getHeight();
        var step = source.step;
        var stepHeight = sourceHeight > height ? height + step : height - step;
        var nextHeight = getMedian(height, stepHeight, sourceHeight);
        mesh.setHeight(nextHeight);

        if (nextHeight !== sourceHeight) {
          this._animateCache[id].index = requestAnimationFrame(function () {
            _this4._animateHeight(id);
          });
        } else {
          delete this._animateCache[id];
        }
      }
    }, {
      key: "getOverlays",
      value: function getOverlays() {
        if (this._meshs && this._meshs.length) {
          return this._meshs.map(function (t) {
            return t.getOverlays();
          });
        } else {
          return null;
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        if (this._meshs && this._meshs.length) {
          this._meshs.forEach(function (mesh) {
            mesh.destroy();
          });

          this._meshs = [];
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        for (var id in this._animateCache) {
          var mesh = this._animateCache[key];
          if (mesh.index) cancelAnimationFrame(mesh.index);
        }

        _get(_getPrototypeOf(gl_RegularPrismList.prototype), "destroy", this).call(this);
      }
    }]);

    return gl_RegularPrismList;
  }(gl_Overlays);

  function equals(listData, extData) {
    return listData.id === extData.id;
  }

  var main = {
    Overlays: Overlays,
    Polyrect: Polyrect,
    NormalText: NormalText,
    Text3D: Text3D,
    PolyrectList: PolyrectList,
    RadarChart: RadarChart,
    TextQueue: TextQueue,
    ShadowText: ShadowText,
    Utils: Utils,
    gl_Polyrect: gl_Polyrect,
    gl_PolyrectList: gl_PolyrectList,
    gl_RegularPrism: gl_RegularPrism,
    gl_RegularPrismList: gl_RegularPrismList
  };

  return main;

}));
