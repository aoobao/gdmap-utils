(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.mapUtils = factory());
}(this, function () { 'use strict';

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

  // import './Polyrect.css'
  var Polyrect =
  /*#__PURE__*/
  function () {
    function Polyrect(opt) {
      _classCallCheck(this, Polyrect);

      this._initialze(opt || {});
    }

    _createClass(Polyrect, [{
      key: "_initialze",
      value: function _initialze(opt) {}
    }]);

    return Polyrect;
  }();

  // src/main.js
  var main = {
    Polyrect: Polyrect
  };

  return main;

}));
//# sourceMappingURL=gdmap-utils.js.map
