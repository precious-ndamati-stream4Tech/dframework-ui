"use strict";

require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.string.starts-with.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url-search-params.js");
require("core-js/modules/web.url-search-params.delete.js");
require("core-js/modules/web.url-search-params.has.js");
require("core-js/modules/web.url-search-params.size.js");
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _StateProvider = require("../../useRouter/StateProvider");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Field = _ref => {
  var _formik$values$field, _formik$values$field2, _stateData$gridSettin, _stateData$gridSettin2;
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
    navigate
  } = (0, _StateProvider.useRouter)();
  const userData = (stateData === null || stateData === void 0 ? void 0 : stateData.getUserData) || {};
  const {
    ClientId = 0
  } = (userData === null || userData === void 0 ? void 0 : userData.tags) || {};
  const initialOptions = lookups ? lookups[column === null || column === void 0 ? void 0 : column.lookup] : [];
  let initialInputValue = ((_formik$values$field = formik.values[field]) === null || _formik$values$field === void 0 ? void 0 : _formik$values$field.length) > 1 ? ((_formik$values$field2 = formik.values[field]) === null || _formik$values$field2 === void 0 || (_formik$values$field2 = _formik$values$field2.split(", ")) === null || _formik$values$field2 === void 0 ? void 0 : _formik$values$field2.map(Number)) || [] : [formik.values[field]] || [];
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
  const comboApi = stateData === null || stateData === void 0 || (_stateData$gridSettin = stateData.gridSettings) === null || _stateData$gridSettin === void 0 || (_stateData$gridSettin = _stateData$gridSettin.permissions) === null || _stateData$gridSettin === void 0 ? void 0 : _stateData$gridSettin.comboApi;
  const errorApi = stateData === null || stateData === void 0 || (_stateData$gridSettin2 = stateData.gridSettings) === null || _stateData$gridSettin2 === void 0 || (_stateData$gridSettin2 = _stateData$gridSettin2.permissions) === null || _stateData$gridSettin2 === void 0 ? void 0 : _stateData$gridSettin2.errorApi;
  if (column !== null && column !== void 0 && column.selectField) {
    field = column.selectField;
  }
  const filterOptions = (options, state) => {
    return options.filter(option => option.label.toLowerCase().startsWith(state.inputValue.toLowerCase()));
  };
  const fetchOptions = async () => {
    try {
      const start = optionParams.start;
      const params = new URLSearchParams({
        start,
        limit: 50,
        comboType: (column === null || column === void 0 ? void 0 : column.comboType) || 'ClientUserType',
        asArray: 0,
        query: inputValue,
        ClientId: ClientId
      });
      const response = await fetch("".concat(comboApi, "?").concat(params));
      const result = await response.json();
      if (result !== null && result !== void 0 && result.records && result.records.length > 0) {
        setOptionParams({
          start: start + 50,
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
      if (errorApi) {
        fetch(errorApi, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            errorMsg: "Error fetching options: ".concat(error),
            appName: 'DFramework-UI'
          })
        }).catch(() => {});
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
    if (!formik.values) return;
    const sourceOptions = initialOptions || options;
    const option = sourceOptions === null || sourceOptions === void 0 ? void 0 : sourceOptions.find(opt => opt.value === formik.values[field]);
    setSelectedOption(option);
  }, [formik.values, initialOptions, options]);
  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    setOptionParams({
      start: 0,
      recordCount: 0
    });
    setOptions([]);
  };
  const handlePagiation = async event => {
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
    error: formik.touched[field] && Boolean(formik.errors[field]),
    className: "singleAutoCompleteClass"
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
      onScroll: handlePagiation
    }
  })), formik.touched[field] && formik.errors[field] && /*#__PURE__*/_react.default.createElement(_material.FormHelperText, null, formik.errors[field]));
};
var _default = exports.default = Field;