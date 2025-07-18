"use strict";

require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/esnext.iterator.for-each.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _xDataGridPremium = require("@mui/x-data-grid-premium");
var _material = require("@mui/material");
const _excluded = ["label", "value", "scopeId"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
const GridOperators = {
  IsAnyOf: 'isAnyOf'
};
const CustomDropdownmenu = props => {
  var _column$dataRef, _currentFieldFilters$, _currentFieldFilters$2, _options;
  const {
    column,
    item,
    applyValue,
    apiRef
  } = props;
  const lookupData = column === null || column === void 0 || (_column$dataRef = column.dataRef) === null || _column$dataRef === void 0 || (_column$dataRef = _column$dataRef.current) === null || _column$dataRef === void 0 ? void 0 : _column$dataRef.lookups;
  let options = column.customLookup || lookupData[column.lookup] || [];
  if (typeof column.lookup === 'string') {
    options = options.map(_ref => {
      let {
          label,
          value,
          scopeId
        } = _ref,
        option = _objectWithoutProperties(_ref, _excluded);
      return {
        label: label,
        value: value
      };
    });
  }
  const filterModel = (0, _xDataGridPremium.useGridSelector)(apiRef, _xDataGridPremium.gridFilterModelSelector);
  const currentFieldFilters = (0, _react.useMemo)(() => {
    var _filterModel$items;
    return (_filterModel$items = filterModel.items) === null || _filterModel$items === void 0 ? void 0 : _filterModel$items.filter(value => {
      return value.field === column.field;
    });
  }, [column.field, filterModel.items]);
  const handleFilterChange = (0, _react.useCallback)(event => {
    let inputValue = event.target.value;
    let isAnyOfFilter = false;
    if (filterModel.items.length >= 1) {
      inputValue = inputValue.length === 1 ? inputValue[0] : inputValue;
      for (const element of filterModel.items) {
        if (element.field !== item.field) {
          continue;
        }
        if (element.operator === GridOperators.IsAnyOf) {
          inputValue = Array.isArray(inputValue) ? inputValue : [inputValue];
          isAnyOfFilter = true;
        } else {
          isAnyOfFilter = false;
          inputValue = inputValue === 0 ? '0' : inputValue;
        }
      }
    }
    if (inputValue.length === 0) {
      if (currentFieldFilters[0]) {
        apiRef.current.deleteFilterItem(currentFieldFilters[0]);
      }
      return;
    }
    const newValue = inputValue;
    const newitem = currentFieldFilters[0] ? currentFieldFilters[0] : item;
    applyValue(_objectSpread(_objectSpread({}, newitem), {}, {
      value: newValue
    }));
  }, [apiRef, column.applyZeroFilter, currentFieldFilters, item, applyValue]);
  const value = (_currentFieldFilters$ = (_currentFieldFilters$2 = currentFieldFilters[0]) === null || _currentFieldFilters$2 === void 0 ? void 0 : _currentFieldFilters$2.value) !== null && _currentFieldFilters$ !== void 0 ? _currentFieldFilters$ : '';
  return /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    variant: "standard",
    className: "w-100"
  }, /*#__PURE__*/_react.default.createElement(_material.InputLabel, null), /*#__PURE__*/_react.default.createElement(_material.Select, {
    label: column.field,
    variant: "standard",
    value: value,
    onChange: e => handleFilterChange(e),
    multiple: Array.isArray(value),
    MenuProps: {
      PaperProps: {
        style: {
          height: 'fit-content',
          overflow: 'hidden'
        }
      }
    }
  }, (_options = options) === null || _options === void 0 ? void 0 : _options.map((option, index) => /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    key: index,
    value: option.value
  }, option.label))));
};
var _default = exports.default = CustomDropdownmenu;