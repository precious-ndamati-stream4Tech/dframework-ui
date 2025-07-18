"use strict";

require("core-js/modules/es.object.assign.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireDefault(require("react"));
var _DateTimePicker = require("@mui/x-date-pickers/DateTimePicker");
var _dayjs = _interopRequireDefault(require("dayjs"));
var _StateProvider = require("../../useRouter/StateProvider");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const field = _ref => {
  let {
    column,
    field,
    fieldLabel,
    formik,
    otherProps,
    classes
  } = _ref;
  const {
    systemDateTimeFormat,
    stateData
  } = (0, _StateProvider.useStateContext)();
  return /*#__PURE__*/_react.default.createElement(_DateTimePicker.DateTimePicker, _extends({}, otherProps, {
    variant: "standard",
    readOnly: (column === null || column === void 0 ? void 0 : column.readOnly) === true,
    key: field,
    fullWidth: true,
    format: systemDateTimeFormat(false, false, stateData.dateTime),
    name: field,
    value: (0, _dayjs.default)(formik.values[field]),
    onChange: value => formik.setFieldValue(field, value),
    onBlur: formik.handleBlur,
    helperText: formik.touched[field] && formik.errors[field],
    disablePast: column === null || column === void 0 ? void 0 : column.disablePast,
    slotProps: {
      textField: {
        fullWidth: true,
        helperText: formik.errors[field],
        variant: "standard"
      }
    }
  }));
};
var _default = exports.default = field;