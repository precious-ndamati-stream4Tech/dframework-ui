"use strict";

require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ChildGridComponent;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Tabs = _interopRequireDefault(require("@mui/material/Tabs"));
var _Tab = _interopRequireDefault(require("@mui/material/Tab"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _reactI18next = require("react-i18next");
var _utils = _interopRequireDefault(require("../utils"));
const _excluded = ["children", "value", "index"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
const t = _utils.default.t;
function CustomTabPanel(props) {
  const {
      children,
      value,
      index
    } = props,
    other = _objectWithoutProperties(props, _excluded);
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tabpanel",
    hidden: value !== index,
    id: "simple-tabpanel-".concat(index),
    "aria-labelledby": "simple-tab-".concat(index)
  }, other), value === index && /*#__PURE__*/React.createElement(_Box.default, null, /*#__PURE__*/React.createElement(_Typography.default, null, children)));
}
CustomTabPanel.propTypes = {
  children: _propTypes.default.node,
  index: _propTypes.default.number.isRequired,
  value: _propTypes.default.number.isRequired
};
function a11yProps(index) {
  return {
    id: "simple-tab-".concat(index),
    'aria-controls': "simple-tabpanel-".concat(index)
  };
}
function ChildGridComponent(_ref) {
  let {
    tabs,
    selected,
    childGridTitle,
    showChildGrids,
    hideChildGrids
  } = _ref;
  const [value, setValue] = React.useState(0);
  const [gridFilters, setGridFilters] = React.useState([]);
  const {
    t: translate,
    i18n
  } = (0, _reactI18next.useTranslation)();
  const tOpts = {
    t: translate,
    i18n
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const updateGridFilters = e => {
    setGridFilters(e);
  };
  if (!tabs || tabs.length === 0) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_Box.default, {
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_Box.default, {
    sx: {
      borderBottom: 1,
      borderColor: 'divider',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(_Tabs.default, {
    value: value,
    onChange: handleChange,
    "aria-label": "basic tabs example"
  }, tabs.map((tab, index) => {
    const {
      label
    } = tab;
    return /*#__PURE__*/React.createElement(_Tab.default, _extends({
      key: index,
      label: t(label, tOpts)
    }, a11yProps(index)));
  }))), tabs.map((tab, index) => {
    const {
      config,
      label
    } = tab;
    return /*#__PURE__*/React.createElement(CustomTabPanel, {
      value: value,
      index: index,
      key: label
    }, showChildGrids ? /*#__PURE__*/React.createElement(config.Grid, {
      gridFilters: gridFilters,
      updateGridFilters: updateGridFilters,
      selected: selected,
      assigned: true,
      childTabTitle: childGridTitle
    }) : /*#__PURE__*/React.createElement("div", {
      className: "pd-2"
    }, t("Please select a record to see it's details", tOpts)));
  }));
}