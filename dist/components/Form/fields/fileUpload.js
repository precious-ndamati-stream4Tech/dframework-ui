"use strict";

require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.for-each.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.string.match.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url.js");
require("core-js/modules/web.url.to-json.js");
require("core-js/modules/web.url-search-params.js");
require("core-js/modules/web.url-search-params.delete.js");
require("core-js/modules/web.url-search-params.has.js");
require("core-js/modules/web.url-search-params.size.js");
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _StateProvider = require("../../useRouter/StateProvider");
var _httpRequest = require("../../Grid/httpRequest");
var _SnackBar = require("../../SnackBar");
var _utils = _interopRequireDefault(require("../../utils"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const consts = {
  maxLength: 500
}; // Default max length for document link
const {
  errorMapping
} = _utils.default;
const MB = 1024 * 1024;
function FileUpload(_ref) {
  var _stateData$gridSettin, _formik$values$field;
  let {
    column,
    field,
    formik
  } = _ref;
  const inputValue = formik.values[field] || "";
  const {
    stateData
  } = (0, _StateProvider.useStateContext)();
  const {
    maxSize,
    formats
  } = column;
  const {
    uploadApi,
    mediaApi,
    Url
  } = stateData === null || stateData === void 0 || (_stateData$gridSettin = stateData.gridSettings) === null || _stateData$gridSettin === void 0 ? void 0 : _stateData$gridSettin.permissions;
  const [formState, setFormState] = (0, _react.useState)({
    isExternal: "no",
    selectedFile: null
  });
  const [loading, setLoading] = (0, _react.useState)(false); // Add loading state
  const snackbar = (0, _SnackBar.useSnackbar)();
  const {
    getParams,
    useParams
  } = (0, _StateProvider.useRouter)();
  const {
    associationId
  } = useParams() || getParams;
  const id = (associationId === null || associationId === void 0 ? void 0 : associationId.split("-")[0]) || 1;
  const handleRadioChange = event => {
    const isExternal = event.target.value;
    setFormState(_objectSpread(_objectSpread({}, formState), {}, {
      isExternal,
      selectedFile: null
    }));
    formik.setFieldValue(field, formik.values[field]); // Reset form field value
  };
  const handleInputChange = e => {
    formik.setFieldValue(field, e.target.value);
  };
  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    if (maxSize && selectedFile.size > maxSize * MB) {
      snackbar.showError("File size exceeds the maximum limit of ".concat(maxSize, " MB."));
      return;
    }
    if (Array.isArray(formats) && !formats.includes(selectedFile.type)) {
      snackbar.showError("Invalid file format. Allowed formats: ".concat(formats.join(", "), "."));
      return;
    }
    setFormState(prev => _objectSpread(_objectSpread({}, prev), {}, {
      selectedFile
    }));
  };
  const handleFileUpload = async () => {
    if (!formState.selectedFile) return;
    setLoading(true); // Start loading
    try {
      const formData = new FormData();
      formData.append("file", formState.selectedFile);
      formData.append("DocumentGroupId", formik.values.DocumentGroupId); // Doc group ID
      formData.append("AssociationId", id); // Association ID
      const response = await (0, _httpRequest.transport)({
        method: 'POST',
        url: uploadApi,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        credentials: 'include'
      });
      const data = response.data || {};
      if (!data.success) {
        snackbar.showError(data.message || "Upload failed");
        return;
      }
      const fileUrl = mediaApi + '/' + data.filePath;
      formik.setFieldValue(field, fileUrl);
    } catch (error) {
      const statusCode = (error.message.match(/status code (\d{3})/) || [])[1];
      snackbar.showError(errorMapping[statusCode]);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  const host = new URL(Url, window.location.origin).hostname.toLowerCase();
  _react.default.useEffect(() => {
    setFormState(_objectSpread(_objectSpread({}, formState), {}, {
      isExternal: !inputValue.toLowerCase().includes(host) ? "yes" : "no"
    }));
  }, [inputValue, setFormState]);
  const isLengthExceeded = ((_formik$values$field = formik.values[field]) === null || _formik$values$field === void 0 ? void 0 : _formik$values$field.length) > (column.max || consts.maxLength);
  const colorScheme = isLengthExceeded ? 'red' : '';
  return /*#__PURE__*/_react.default.createElement(_material.Box, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
    sx: {
      display: "flex",
      alignItems: "center",
      marginBottom: 2
    }
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    variant: "body1",
    sx: {
      width: "150px",
      marginRight: 2
    }
  }, "External Link?"), /*#__PURE__*/_react.default.createElement(_material.RadioGroup, {
    row: true,
    value: formState.isExternal,
    onChange: handleRadioChange,
    "aria-label": "is-external-link",
    name: "is-external-link"
  }, /*#__PURE__*/_react.default.createElement(_material.FormControlLabel, {
    value: "yes",
    control: /*#__PURE__*/_react.default.createElement(_material.Radio, null),
    label: "Yes"
  }), /*#__PURE__*/_react.default.createElement(_material.FormControlLabel, {
    value: "no",
    control: /*#__PURE__*/_react.default.createElement(_material.Radio, null),
    label: "No"
  }))), /*#__PURE__*/_react.default.createElement(_material.Box, {
    sx: {
      display: "flex",
      alignItems: "center",
      marginBottom: 2
    }
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    variant: "body1",
    sx: {
      width: "150px",
      marginRight: 2
    }
  }, "Document Link"), /*#__PURE__*/_react.default.createElement(_material.Box, {
    sx: {
      flex: 1,
      display: "flex",
      flexDirection: "column"
    }
  }, formState.isExternal === "yes" ? /*#__PURE__*/_react.default.createElement(_material.TextField, {
    fullWidth: true,
    value: inputValue,
    sx: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: colorScheme
        },
        "&.Mui-focused fieldset": {
          borderColor: colorScheme
        },
        "&:hover fieldset": {
          borderColor: colorScheme
        }
      }
    },
    onChange: handleInputChange,
    placeholder: "Enter external link"
  }) : /*#__PURE__*/_react.default.createElement(_material.TextField, {
    fullWidth: true,
    value: inputValue,
    placeholder: "Link autopopulated once uploaded",
    InputProps: {
      readOnly: true
    }
  }), isLengthExceeded && /*#__PURE__*/_react.default.createElement(_material.Typography, {
    sx: {
      color: 'red'
    }
  }, "Maximum allowed length for the document link is ", column.max, " characters."))), formState.isExternal === "no" && /*#__PURE__*/_react.default.createElement(_material.Box, {
    sx: {
      display: "flex",
      alignItems: "center",
      gap: 2
    }
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "outlined",
    component: "label",
    disabled: loading // Disable while loading
  }, "Choose File", /*#__PURE__*/_react.default.createElement("input", {
    type: "file",
    hidden: true,
    onChange: handleFileChange
  })), formState.selectedFile && /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
    title: formState.selectedFile.name,
    arrow: true
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    variant: "body2"
  }, formState.selectedFile.name.length > 20 ? "".concat(formState.selectedFile.name.substring(0, 20), "...") : formState.selectedFile.name)), /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "contained",
    color: "primary",
    onClick: handleFileUpload,
    disabled: !formState.selectedFile || loading // Disable while loading
  }, loading ? /*#__PURE__*/_react.default.createElement(_material.CircularProgress, {
    size: 24,
    color: "inherit"
  }) : "Upload File")));
}
var _default = exports.default = FileUpload;