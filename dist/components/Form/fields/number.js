"use strict";

require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.object.assign.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.for-each.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.string.includes.js");
var _react = _interopRequireDefault(require("react"));
var _string = _interopRequireDefault(require("./string"));
const _excluded = ["column", "otherProps", "formik", "field"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
const field = _ref => {
  let {
      column,
      otherProps,
      formik,
      field
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  const {
    minValue: min,
    maxValue: max
  } = column;
  const isDecimal = column.type === 'decimal';
  const minKey = 47;
  const maxKey = 58;
  otherProps = _objectSpread(_objectSpread({
    InputProps: {
      inputProps: {
        min: isDecimal ? min : Math.max(0, min),
        max,
        readOnly: (column === null || column === void 0 ? void 0 : column.readOnly) === true,
        onKeyPress: event => {
          const keyCode = event.which ? event.which : event.keyCode;
          const currentValue = event.target.value;

          // Allow digits (48-57)
          if (keyCode > minKey && keyCode < maxKey) {
            return;
          }

          // For decimal type, allow decimal point (46) and minus sign (45)
          if (isDecimal) {
            // Allow minus sign only at the beginning
            if (keyCode === 45 && currentValue.length === 0) {
              return;
            }
            // Allow decimal point only if not already present
            if (keyCode === 46 && !currentValue.includes('.')) {
              return;
            }
          }
          event.preventDefault();
        }
      }
    },
    type: 'number'
  }, otherProps), {}, {
    onBlur: event => {
      const minValue = isDecimal ? min !== undefined ? min : -Infinity : Math.max(0, min);
      if (event.target.value && event.target.value < minValue) {
        formik.setFieldValue(field, minValue === -Infinity ? 0 : minValue);
      }
      if (props.onBlur) {
        props.onBlur(event);
      }
    }
  });
  return /*#__PURE__*/_react.default.createElement(_string.default, _extends({
    column: column,
    otherProps: otherProps,
    formik: formik,
    field: field
  }, props));
};
var _default = exports.default = field;