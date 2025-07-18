"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Footer = void 0;
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _xDataGridPremium = require("@mui/x-data-grid-premium");
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _TextField = _interopRequireDefault(require("@mui/material/TextField"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _reactI18next = require("react-i18next");
var _react = _interopRequireWildcard(require("react"));
var _StateProvider = require("../useRouter/StateProvider");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const Footer = _ref => {
  let {
    pagination,
    apiRef,
    tTranslate = key => key
  } = _ref;
  const page = apiRef.current.state.pagination.paginationModel.page;
  const rowsPerPage = apiRef.current.state.pagination.paginationModel.pageSize;
  const totalRows = apiRef.current.state.rows.totalRowCount;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const {
    t: translate,
    i18n
  } = (0, _reactI18next.useTranslation)();
  const tOpts = {
    t: translate,
    i18n
  };
  const [pageNumber, setPageNumber] = (0, _react.useState)(page + 1);
  const {
    useLocalization
  } = (0, _StateProvider.useStateContext)();
  const {
    getLocalizedString
  } = useLocalization();
  const handleChange = function handleChange(e) {
    var _e$target;
    let value = (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.value;
    if (value === '') {
      setPageNumber('');
    } else {
      value = parseInt(value);
      value = isNaN(value) || value < 1 ? 1 : value;
      setPageNumber(value);
    }
  };
  (0, _react.useEffect)(() => {
    setPageNumber(page + 1);
  }, [page, rowsPerPage]);
  const onPageChange = function onPageChange() {
    let targetPage = pageNumber === '' ? 1 : pageNumber;
    targetPage = Math.max(targetPage, 1);
    targetPage = Math.min(targetPage, totalPages);
    apiRef.current.setPage(targetPage - 1);
    setPageNumber(targetPage);
    if (pageNumber === '') {
      setPageNumber(1);
    }
  };
  const handleKeyPress = event => {
    const keyCode = event.which || event.keyCode;
    const keyValue = String.fromCharCode(keyCode);
    if (!/\d/.test(keyValue)) event.preventDefault();
  };
  return /*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridFooterContainer, null, /*#__PURE__*/_react.default.createElement(_Box.default, {
    sx: {
      pl: 5
    }
  }, pagination && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "p"
  }, tTranslate('Jump to page', tOpts), ":"), /*#__PURE__*/_react.default.createElement(_TextField.default, {
    sx: {
      width: 70,
      pl: 1,
      '& input[type=number]::-webkit-inner-spin-button': {
        cursor: 'pointer'
      },
      '& input[type=number]::-webkit-outer-spin-button': {
        cursor: 'pointer'
      }
    },
    variant: "standard",
    type: "number",
    min: 1,
    value: pageNumber,
    onChange: handleChange,
    onKeyPress: handleKeyPress,
    disabled: !totalRows
  }), /*#__PURE__*/_react.default.createElement(_Button.default, {
    disabled: !totalRows,
    size: "small",
    onClick: onPageChange
  }, tTranslate('Go', tOpts)))), /*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridFooter, null));
};
exports.Footer = Footer;