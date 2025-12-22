"use strict";

require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.for-each.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/esnext.json.parse.js");
require("core-js/modules/web.dom-collections.iterator.js");
var React = _interopRequireWildcard(require("react"));
var _FormControl = _interopRequireDefault(require("@mui/material/FormControl"));
var _Input = _interopRequireDefault(require("@mui/material/Input"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _debounce = _interopRequireDefault(require("lodash/debounce"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const Field = _ref => {
  let {
    field,
    formik
  } = _ref;
  const [state, setState] = React.useState({});
  React.useEffect(() => {
    if (!formik.values[field]) return;
    try {
      const inputJSON = JSON.parse(formik.values[field]);
      setState(inputJSON);
    } catch (e) {
      setState({});
    }
  }, [formik.values[field]]);
  const handleDebouncedChange = React.useMemo(() => (0, _debounce.default)(newState => {
    formik.setFieldValue(field, JSON.stringify(newState));
  }, 300), [formik, field]);
  const handleChange = (key, value) => {
    const updatedState = _objectSpread(_objectSpread({}, state), {}, {
      [key]: value
    });
    setState(updatedState);
    handleDebouncedChange(updatedState);
  };
  React.useEffect(() => {
    return () => {
      handleDebouncedChange.cancel();
    };
  }, [handleDebouncedChange]);
  return /*#__PURE__*/React.createElement(_FormControl.default, {
    fullWidth: true,
    key: field,
    variant: "standard",
    error: formik.touched[field] && Boolean(formik.errors[field]),
    style: {
      marginBottom: '1rem'
    }
  }, Object.keys(state).map(key => /*#__PURE__*/React.createElement("div", {
    key: key,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement(_Typography.default, {
    variant: "body1",
    sx: {
      width: "180px",
      marginRight: 2
    }
  }, key, ":"), /*#__PURE__*/React.createElement(_Input.default, {
    id: key,
    name: key,
    value: state[key],
    onChange: e => handleChange(key, e.target.value),
    fullWidth: true,
    style: {
      flex: 2
    }
  }))));
};
var _default = exports.default = Field;