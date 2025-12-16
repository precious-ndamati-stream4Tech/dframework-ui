"use strict";

require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.string.starts-with.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _httpUtil = require("../../../httpUtil");
var _reactRedux = require("react-redux");
var _reactRouter = require("react-router");
var _StateProvider = require("../../useRouter/StateProvider");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Field = _ref => {
  var _formik$values$field, _formik$values$field2;
  let {
    column,
    field,
    formik,
    lookups,
    otherProps
  } = _ref;
  const {
    stateData
  } = (0, _StateProvider.useStateContext)();
  const {
    ClientId
  } = stateData && stateData.userData && stateData.userData.tags ? stateData.userData.tags : 0;
  const initialOptions = lookups ? lookups[column === null || column === void 0 ? void 0 : column.lookup] : [];
  let initialInputValue = ((_formik$values$field = formik.values[field]) === null || _formik$values$field === void 0 ? void 0 : _formik$values$field.length) > 1 ? ((_formik$values$field2 = formik.values[field]) === null || _formik$values$field2 === void 0 || (_formik$values$field2 = _formik$values$field2.split(", ")) === null || _formik$values$field2 === void 0 ? void 0 : _formik$values$field2.map(Number)) || [] : [formik.values[field]] || [];
  const {
    canSendError,
    errorUrl
  } = otherProps;
  const [options, setOptions] = (0, _react.useState)(initialOptions);
  const [inputValue, setInputValue] = (0, _react.useState)(initialInputValue);
  const [optionParams, setOptionParams] = (0, _react.useState)({
    start: 0,
    recordCount: 0
  });
  let value;
  if (Object.entries(formik === null || formik === void 0 ? void 0 : formik.values).length > 0) {
    value = (initialOptions === null || initialOptions === void 0 ? void 0 : initialOptions.filter(option => {
      var _formik$values;
      return (formik === null || formik === void 0 || (_formik$values = formik.values) === null || _formik$values === void 0 ? void 0 : _formik$values.AssignedToUserId) === option.value;
    })) || [];
  }
  const [selectedOption, setSelectedOption] = (0, _react.useState)(value || '');
  const dispatch = (0, _reactRedux.useDispatch)();
  const history = (0, _reactRouter.useHistory)();
  if (column !== null && column !== void 0 && column.selectField) {
    field = column.selectField;
  }
  const filterOptions = (options, state) => {
    return options.filter(option => option.label.toLowerCase().startsWith(state.inputValue.toLowerCase()));
  };
  const fetchOptions = async () => {
    try {
      const start = optionParams.start;
      const params = {
        start,
        limit: 50,
        comboType: (column === null || column === void 0 ? void 0 : column.comboType) || 'ClientUserType',
        asArray: 0,
        query: inputValue,
        ClientId: ClientId
      };
      const result = await (0, _httpUtil.request)({
        url: _httpUtil.apis.Combo,
        params: params,
        history,
        dispatch
      });
      if (result !== null && result !== void 0 && result.records && result.records.length > 0) {
        setOptionParams({
          start: start + params.limit,
          recordCount: result.recordCount
        });
        return result.records.map(item => ({
          label: item.DisplayValue,
          value: item.LookupId
        }));
      } else {
        return [];
      }
    } catch (error) {
      if (canSendError && errorUrl) {
        window.onerror({
          url: errorUrl,
          errorMsg: "Error fetching options: ".concat(error),
          appName: 'Playbook'
        });
      }
      return [];
    }
  };
  (0, _react.useEffect)(() => {
    if (inputValue !== undefined && inputValue !== 'undefined' && (!Array.isArray(inputValue) || !inputValue.includes(undefined))) {
      fetchOptions().then(result => setOptions(result));
    }
  }, [inputValue]);
  (0, _react.useEffect)(() => {
    if (formik.values) {
      let option;
      if (initialOptions) {
        option = initialOptions.find(option => option.value === formik.values[field]);
      } else if (options) {
        option = options.find(option => option.value === formik.values[field]);
      }
      setSelectedOption(option);
    }
  }, [formik.values, options]);
  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    setOptionParams({
      start: 0,
      recordCount: 0
    });
    setOptions([]);
  };
  const handlePagination = async event => {
    const listBox = event.target;
    if (listBox.scrollTop + listBox.clientHeight >= listBox.scrollHeight) {
      if (options.length >= optionParams.recordCount || optionParams.start >= optionParams.recordCount) return;
      const result = await fetchOptions();
      setOptions(options.concat(result));
    }
  };
  const handleChange = (event, newValue) => {
    formik === null || formik === void 0 || formik.setFieldValue(column === null || column === void 0 ? void 0 : column.selectField, (newValue === null || newValue === void 0 ? void 0 : newValue.value) || '');
    setSelectedOption(newValue);
    setInputValue(newValue ? newValue.label : '');
  };
  return /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    fullWidth: true,
    variant: "standard",
    error: formik.touched[field] && Boolean(formik.errors[field])
  }, /*#__PURE__*/_react.default.createElement(_material.Autocomplete, _extends({}, otherProps, {
    options: options,
    getOptionLabel: option => option.label,
    filterOptions: filterOptions,
    inputValue: inputValue,
    onInputChange: handleInputChange,
    value: selectedOption,
    onChange: handleChange,
    renderInput: params => /*#__PURE__*/_react.default.createElement(_material.TextField, _extends({}, params, {
      variant: "standard"
    })),
    ListboxProps: {
      onScroll: handlePagination
    }
  })), formik.touched[field] && formik.errors[field] && /*#__PURE__*/_react.default.createElement(_material.FormHelperText, null, formik.errors[field]));
};
var _default = exports.default = Field;