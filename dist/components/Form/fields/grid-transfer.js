"use strict";

require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@material-ui/core");
const _excluded = ["component", "name", "formik", "field", "type", "column"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
const useStyles = (0, _core.makeStyles)({
  divSpacing: {
    marginTop: '10px',
    marginBottom: '10px',
    fontSize: '20px'
  }
});
const TransferField = _ref => {
  let {
      component,
      name,
      formik,
      field,
      type,
      column
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  const {
    value
  } = formik.getFieldProps(name || field);
  const {
    setFieldValue
  } = formik;
  const Component = component || column.relation;
  const classes = useStyles();
  const onAssignChange = (0, _react.useCallback)(value => {
    setFieldValue(name || field, value);
  }, [setFieldValue, name, field]);
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(classes.divSpacing, " ")
  }, "Available".concat(" ", column.label)), /*#__PURE__*/_react.default.createElement(Component, {
    selected: value,
    available: true,
    onAssignChange: onAssignChange,
    disableCellRedirect: column.disableCellRedirect,
    useLinkColumn: column.useLinkColumn,
    readOnly: column.readOnly
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(classes.divSpacing, " ")
  }, "Assigned".concat(" ", column.label)), /*#__PURE__*/_react.default.createElement(Component, {
    selected: value,
    assigned: true,
    onAssignChange: onAssignChange,
    disableCellRedirect: column.disableCellRedirect,
    useLinkColumn: column.useLinkColumn,
    readOnly: column.readOnly
  }));
};
var _default = exports.default = TransferField;