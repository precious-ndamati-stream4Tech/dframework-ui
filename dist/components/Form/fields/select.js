"use strict";

require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.parse-int.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _KeyboardArrowDown = _interopRequireDefault(require("@mui/icons-material/KeyboardArrowDown"));
var _FormControl = _interopRequireDefault(require("@mui/material/FormControl"));
var _InputLabel = _interopRequireDefault(require("@mui/material/InputLabel"));
var _Select = _interopRequireDefault(require("@mui/material/Select"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _useCascadingLookup = _interopRequireDefault(require("../../../hooks/useCascadingLookup"));
const _excluded = ["column", "field", "formik", "lookups", "dependsOn", "model"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
const SelectField = /*#__PURE__*/_react.default.memo(_ref => {
  var _theme$palette;
  let {
      column,
      field,
      formik,
      lookups,
      dependsOn = [],
      model
    } = _ref,
    otherProps = _objectWithoutProperties(_ref, _excluded);
  const userSelected = _react.default.useRef(false);
  const {
    placeHolder
  } = column;
  const options = (0, _useCascadingLookup.default)({
    column,
    formik,
    lookups,
    dependsOn,
    userSelected,
    model
  });
  const theme = (0, _material.useTheme)();

  // Memoize input value processing to avoid recalculation on each render
  const inputValue = (0, _react.useMemo)(() => {
    let value = formik.values[field];

    // Handle default value selection
    if (options !== null && options !== void 0 && options.length && !value && !column.multiSelect && "IsDefault" in options[0]) {
      const isDefaultOption = options.find(e => e.IsDefault);
      if (isDefaultOption) {
        value = isDefaultOption.value;
        formik.setFieldValue(field, isDefaultOption.value);
      }
    }

    // Handle multi-select values
    if (column.multiSelect) {
      if (!value || value.length === 0) {
        value = [];
      } else if (!Array.isArray(value)) {
        value = value.split(',').map(e => parseInt(e));
      }
    }
    return value;
  }, [formik.values[field], options, column.multiSelect, field]);

  // Memoize event handlers to prevent unnecessary re-renders of child components
  const handleChange = (0, _react.useCallback)(event => {
    formik.handleChange(event);
    userSelected.current = true;
  }, [formik]);
  return /*#__PURE__*/_react.default.createElement(_FormControl.default, {
    fullWidth: true,
    key: field,
    variant: "standard"
  }, /*#__PURE__*/_react.default.createElement(_InputLabel.default, null, fieldLabel), /*#__PURE__*/_react.default.createElement(_Select.default, _extends({
    IconComponent: _KeyboardArrowDown.default
  }, otherProps, {
    name: field,
    multiple: column.multiSelect === true,
    readOnly: column.readOnly === true,
    value: inputValue
    // label={fieldLabel}
    ,
    onChange: formik.handleChange
    // onChange={onChange}
    ,
    onBlur: formik.handleBlur,
    sx: {
      backgroundColor: column.readOnly ? (_theme$palette = theme.palette) === null || _theme$palette === void 0 || (_theme$palette = _theme$palette.action) === null || _theme$palette === void 0 ? void 0 : _theme$palette.disabled : ''
    }
  }), Array.isArray(options) && options.map(option => /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    key: option.value,
    value: option.value
  }, option.label))), /*#__PURE__*/_react.default.createElement(_material.FormHelperText, null, formik.touched[field] && formik.errors[field]));
});
var _default = exports.default = field;