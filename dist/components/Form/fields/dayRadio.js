"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _colors = require("@mui/material/colors");
var _CustomRenderCell = require("./CustomRenderCell");
const _excluded = ["name", "field", "formik", "expired"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
const days = [{
  label: 'Sunday',
  value: 0,
  display: 'S'
}, {
  label: 'Monday',
  value: 1,
  display: 'M'
}, {
  label: 'Tuesday',
  value: 2,
  display: 'T'
}, {
  label: 'Wednesday',
  value: 3,
  display: 'W'
}, {
  label: 'Thursday',
  value: 4,
  display: 'T'
}, {
  label: 'Friday',
  value: 5,
  display: 'F'
}, {
  label: 'Saturday',
  value: 6,
  display: 'S'
}];
const CustomAvator = (0, _material.styled)(_material.Avatar)(_ref => {
  let {
    theme,
    isSelected
  } = _ref;
  return {
    width: 34,
    height: 34,
    padding: 1,
    margin: 1,
    backgroundColor: isSelected ? _CustomRenderCell.brandBackgroundColor : '#ffffff',
    border: "1px solid ".concat(_colors.grey[500]),
    color: isSelected ? 'white' : 'black'
  };
});
const DayAvatar = _ref2 => {
  let {
    day,
    onClick: _onClick,
    isSelected
  } = _ref2;
  return /*#__PURE__*/_react.default.createElement(CustomAvator, {
    key: day.value,
    onClick: () => _onClick(day.value),
    isSelected: isSelected,
    style: {
      margin: '4px'
    }
  }, day.display);
};
const DaySelection = _ref3 => {
  let {
      name,
      field,
      formik,
      expired
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded);
  const {
    setFieldValue
  } = formik;
  const {
    value
  } = formik.getFieldProps(name || field);
  const isWeekend = '1000001';
  const isWeekdays = '0111110';
  const defaultVal = "0".repeat(7);
  const [selectedDays, setSelectedDays] = (0, _react.useState)(value || defaultVal);
  const [radioValue, setRadioValue] = (0, _react.useState)(() => {
    if (!value) return '';
    if (value === isWeekend) return isWeekend;
    if (value === isWeekdays) return isWeekdays;
    return 'Custom';
  });
  const [presetSelected, setPresetSelected] = (0, _react.useState)(false);
  const onAssignChange = (0, _react.useCallback)(newValue => {
    if (Array.isArray(newValue)) {
      let finalValue = defaultVal;
      for (const val of newValue) {
        finalValue = finalValue.substring(0, val) + "1" + finalValue.substring(val + 1);
      }
      setSelectedDays(finalValue);
      setFieldValue(name || field, finalValue);
      setPresetSelected(true);
    } else {
      let baseValue = presetSelected ? defaultVal : selectedDays;
      const finalValue = baseValue.slice(0, newValue) + (baseValue[newValue] === "1" ? "0" : "1") + baseValue.slice(newValue + 1);
      setSelectedDays(finalValue);
      setFieldValue(name || field, finalValue);
      setRadioValue('Custom');
      setPresetSelected(false);
    }
  }, [presetSelected, defaultVal, selectedDays, name, field, setFieldValue]);
  const theme = (0, _material.useTheme)();
  const isError = formik.touched[field] && Boolean(formik.errors[field]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    component: "fieldset",
    error: isError
  }, /*#__PURE__*/_react.default.createElement(_material.RadioGroup, {
    row: true,
    name: name || field,
    value: radioValue,
    onChange: event => {
      const val = event.target.value;
      setRadioValue(val);
      if (val !== 'Custom') {
        setSelectedDays(val);
        setFieldValue(name || field, val);
        setPresetSelected(true);
      } else {
        setSelectedDays(defaultVal);
        setFieldValue(name || field, defaultVal);
        setPresetSelected(false);
      }
    }
  }, /*#__PURE__*/_react.default.createElement(_material.FormControlLabel, {
    value: isWeekend,
    control: /*#__PURE__*/_react.default.createElement(_material.Radio, null),
    label: "Weekends (Sat - Sun)",
    onClick: () => onAssignChange([0, 6])
  }), /*#__PURE__*/_react.default.createElement(_material.FormControlLabel, {
    value: isWeekdays,
    control: /*#__PURE__*/_react.default.createElement(_material.Radio, null),
    label: "Weekdays (Mon - Fri)",
    onClick: () => onAssignChange([1, 2, 3, 4, 5])
  }), /*#__PURE__*/_react.default.createElement(_material.FormControlLabel, {
    value: 'Custom',
    control: /*#__PURE__*/_react.default.createElement(_material.Radio, null),
    label: "Specific days"
  }), days.map((day, index) => /*#__PURE__*/_react.default.createElement(DayAvatar, {
    key: day.value,
    day: day,
    onClick: () => onAssignChange(index),
    isSelected: radioValue === 'Custom' && selectedDays[index] === "1",
    disabled: expired
  })))), isError && /*#__PURE__*/_react.default.createElement(_material.FormHelperText, {
    style: {
      color: theme.palette.error.main
    }
  }, formik.errors[field]));
};
var _default = exports.default = DaySelection;