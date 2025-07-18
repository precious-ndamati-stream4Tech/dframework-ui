"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _icons = require("@material-ui/icons");
var _StateProvider = require("../useRouter/StateProvider");
var _actions = _interopRequireDefault(require("../useRouter/actions"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const HelpModal = () => {
  var _openModal$data2, _openModal$data3, _openModal$data4, _openModal$data5, _openModal$data6;
  const [height, setHeight] = (0, _react.useState)();
  const [loading, setLoading] = (0, _react.useState)(false);
  const {
    stateData,
    dispatchData
  } = (0, _StateProvider.useStateContext)();
  const openModal = stateData.modal; //useSelector(state => state.appReducer.modal);
  const ratio = 16 / 9;
  let zoom = (window.outerWidth - 10) / window.innerWidth * 100;
  const updateHeight = () => {
    let widthPercentage = document.getElementById('tutorial-iframe');
    if (widthPercentage) {
      widthPercentage = widthPercentage.offsetWidth;
      widthPercentage = widthPercentage / window.innerWidth;
    } else {
      widthPercentage = 0.9;
    }
    const calculatedHeight = window.innerWidth * widthPercentage * (1 / ratio);
    const maxHeight = window.innerHeight - 180;
    setHeight(Math.min(calculatedHeight, maxHeight));
  };
  (0, _react.useEffect)(() => {
    if (openModal !== null && openModal !== void 0 && openModal.status) {
      setLoading(true);
      updateHeight();
    }
  }, [openModal, zoom]);
  (0, _react.useEffect)(() => {
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);
  function resetIframe() {
    var _openModal$data;
    const iframe = document.getElementById('tutorial-iframe');
    iframe.src = openModal === null || openModal === void 0 || (_openModal$data = openModal.data) === null || _openModal$data === void 0 ? void 0 : _openModal$data.url;
  }
  return /*#__PURE__*/_react.default.createElement("div", null, (openModal === null || openModal === void 0 ? void 0 : openModal.status) && /*#__PURE__*/_react.default.createElement(_material.Dialog, {
    fullWidth: true,
    maxWidth: "lg",
    open: openModal.status,
    onClose: () => {
      dispatchData({
        type: _actions.default.OPEN_MODAL,
        payload: {
          status: false,
          data: {}
        }
      });
    }
  }, /*#__PURE__*/_react.default.createElement(_material.DialogTitle, {
    className: "pt-2 pb-0"
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true,
    spacing: 1
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    className: "",
    xs: 11,
    sm: 11,
    md: 11,
    lg: 11
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    variant: "h7",
    component: "div"
  }, " ", (openModal === null || openModal === void 0 || (_openModal$data2 = openModal.data) === null || _openModal$data2 === void 0 ? void 0 : _openModal$data2.title) || ''), /*#__PURE__*/_react.default.createElement(_material.Typography, {
    variant: "caption",
    component: "div"
  }, (openModal === null || openModal === void 0 || (_openModal$data3 = openModal.data) === null || _openModal$data3 === void 0 ? void 0 : _openModal$data3.subTitle) || /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "\xA0"))), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    className: "text-right",
    xs: 1,
    sm: 1,
    md: 1,
    lg: 1
  }, /*#__PURE__*/_react.default.createElement(_icons.Replay, {
    className: "cursor_pointer mt-2 mr-2",
    onClick: resetIframe
  }), /*#__PURE__*/_react.default.createElement(_icons.Close, {
    className: "cursor_pointer mt-2",
    onClick: () => {
      dispatchData({
        type: _actions.default.OPEN_MODAL,
        payload: {
          status: false,
          data: {}
        }
      });
    }
  })))), /*#__PURE__*/_react.default.createElement(_material.DialogContent, {
    dividers: true
  }, loading && /*#__PURE__*/_react.default.createElement("div", null, "Loading..."), (openModal === null || openModal === void 0 || (_openModal$data4 = openModal.data) === null || _openModal$data4 === void 0 ? void 0 : _openModal$data4.url) && /*#__PURE__*/_react.default.createElement("iframe", {
    id: "tutorial-iframe",
    style: {
      width: '100%',
      height: "".concat(height, "px")
    },
    title: (openModal === null || openModal === void 0 || (_openModal$data5 = openModal.data) === null || _openModal$data5 === void 0 ? void 0 : _openModal$data5.title) || '',
    src: openModal === null || openModal === void 0 || (_openModal$data6 = openModal.data) === null || _openModal$data6 === void 0 ? void 0 : _openModal$data6.url,
    allowfullscreen: true,
    frameborder: "0",
    loading: "lazy",
    onLoad: () => setLoading(false)
  }))));
};
var _default = exports.default = HelpModal;