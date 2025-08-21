"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStateContext = exports.useRouter = exports.StateProvider = exports.RouterProvider = void 0;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.for-each.js");
require("core-js/modules/esnext.json.parse.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _stateReducer = _interopRequireDefault(require("./stateReducer"));
var _initialState = _interopRequireDefault(require("./initialState"));
var _httpRequest = _interopRequireDefault(require("../Grid/httpRequest"));
var _localization = require("../mui/locale/localization");
var _dayjs = _interopRequireDefault(require("dayjs"));
var _actions = _interopRequireDefault(require("./actions"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const StateContext = /*#__PURE__*/(0, _react.createContext)();
const RouterContext = /*#__PURE__*/(0, _react.createContext)(null);
const StateProvider = _ref => {
  let {
    children
  } = _ref;
  const [stateData, dispatchData] = (0, _react.useReducer)(_stateReducer.default, _initialState.default);
  function systemDateTimeFormat(isDateFormatOnly, showOnlyDate, state) {
    if (state !== undefined && state !== null) {
      const userData = state; // Access 'state' 
      let userDateFormat = isDateFormatOnly ? 'DD-MM-YYYY' : 'DD-MM-YYYY hh:mm:ss A';
      if (userData) {
        userDateFormat = userData.split(' ');
        userDateFormat[0] = userDateFormat[0].toUpperCase();
        if (!isDateFormatOnly) {
          if (showOnlyDate) {
            userDateFormat = userDateFormat[0].toUpperCase();
          } else {
            userDateFormat[1] += ':ss';
            userDateFormat = userDateFormat.join(" ");
          }
        } else {
          userDateFormat = userDateFormat[0];
        }
      }
      ;
      return userDateFormat;
    }
    return isDateFormatOnly ? 'DD-MM-YYYY' : 'DD-MM-YYYY hh:mm:ss A';
  }
  async function getAllSavedPreferences(_ref2) {
    var _response$preferences;
    let {
      preferenceName,
      Username,
      history,
      dispatchData,
      preferenceApi
    } = _ref2;
    const params = {
      action: 'list',
      id: preferenceName,
      Username
    };
    const defaultCoolrPref = {
      "prefName": "CoolR Default",
      "prefId": 0,
      "GridId": preferenceName,
      "GridPreferenceId": 0
    };
    const response = await (0, _httpRequest.default)({
      url: preferenceApi,
      params,
      history,
      dispatchData
    });
    let preferences = response !== null && response !== void 0 && response.preferences ? [defaultCoolrPref, ...(response === null || response === void 0 ? void 0 : response.preferences)] : defaultCoolrPref;
    dispatchData({
      type: _actions.default.UDPATE_PREFERENCES,
      payload: preferences
    });
    dispatchData({
      type: _actions.default.TOTAL_PREFERENCES,
      payload: response === null || response === void 0 || (_response$preferences = response.preferences) === null || _response$preferences === void 0 ? void 0 : _response$preferences.length
    });
  }
  async function applyDefaultPreferenceIfExists(_ref3) {
    let {
      gridRef,
      history,
      dispatchData,
      Username,
      preferenceName,
      setIsGridPreferenceFetched,
      preferenceApi
    } = _ref3;
    const params = {
      action: 'default',
      id: preferenceName,
      Username
    };
    const response = await (0, _httpRequest.default)({
      url: preferenceApi,
      params,
      history,
      dispatchData
    });
    let userPreferenceCharts = response !== null && response !== void 0 && response.prefValue ? JSON.parse(response.prefValue) : null;
    if (userPreferenceCharts && gridRef !== null && gridRef !== void 0 && gridRef.current) {
      userPreferenceCharts === null || userPreferenceCharts === void 0 || userPreferenceCharts.gridColumn.forEach(ele => {
        if (gridRef.current.getColumnIndex(ele.field) !== -1) {
          gridRef.current.setColumnWidth(ele.field, ele.width);
        }
      });
      gridRef.current.setColumnVisibilityModel(userPreferenceCharts.columnVisibilityModel);
      gridRef.current.setPinnedColumns(userPreferenceCharts.pinnedColumns);
      gridRef.current.setSortModel(userPreferenceCharts.sortModel || []);
      gridRef.current.setFilterModel(userPreferenceCharts === null || userPreferenceCharts === void 0 ? void 0 : userPreferenceCharts.filterModel);
      dispatchData({
        type: _actions.default.SET_CURRENT_PREFERENCE_NAME,
        payload: response !== null && response !== void 0 && response.prefValue ? response.prefName : 'CoolR Default'
      });
    }
    if (setIsGridPreferenceFetched) {
      setIsGridPreferenceFetched(true);
    }
  }
  function removeCurrentPreferenceName(_ref4) {
    let {
      dispatchData
    } = _ref4;
    dispatchData({
      type: _actions.default.SET_CURRENT_PREFERENCE_NAME,
      payload: null
    });
  }
  function formatDate(value, useSystemFormat) {
    let showOnlyDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let state = arguments.length > 3 ? arguments[3] : undefined;
    if (value) {
      const format = systemDateTimeFormat(useSystemFormat, showOnlyDate, state); // Pass 'state' as an argument
      return (0, _dayjs.default)(value).format(format);
    }
    return '-';
  }
  function useLocalization() {
    const currentLocaleData = stateData.dataLocalization;
    const localeData = _localization.locales[currentLocaleData];
    function getLocalizedString(key) {
      return stateData.dataLocalization === 'pt-PT' || stateData.dataLocalization === 'ptPT' ? localeData.components.MuiDataGrid.defaultProps.localeText[key] || key : localeData[key] || key;
    }
    return {
      getLocalizedString
    };
  }
  return /*#__PURE__*/_react.default.createElement(StateContext.Provider, {
    value: {
      stateData,
      dispatchData,
      systemDateTimeFormat,
      formatDate,
      removeCurrentPreferenceName,
      getAllSavedPreferences,
      applyDefaultPreferenceIfExists,
      useLocalization
    }
  }, children);
};
exports.StateProvider = StateProvider;
const RouterProvider = exports.RouterProvider = RouterContext.Provider;
const useRouter = () => {
  return (0, _react.useContext)(RouterContext);
};
exports.useRouter = useRouter;
const useStateContext = () => {
  const context = (0, _react.useContext)(StateContext);
  if (context === undefined) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};
exports.useStateContext = useStateContext;