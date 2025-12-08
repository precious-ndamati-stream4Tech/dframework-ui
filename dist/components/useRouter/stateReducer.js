"use strict";

require("core-js/modules/es.array.push.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.for-each.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.error.cause.js");
var _actions = _interopRequireDefault(require("./actions"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const stateReducer = (state, action) => {
  switch (action.type) {
    case _actions.default.UPDATE_LOCALIZATION:
      return _objectSpread(_objectSpread({}, state), {}, {
        dataLocalization: action.payload
      });
    case _actions.default.UPDATE_DATE_TIME:
      return _objectSpread(_objectSpread({}, state), {}, {
        dateTime: action.payload
      });
    case _actions.default.UPDATE_FORM_MODE:
      return _objectSpread(_objectSpread({}, state), {}, {
        dataForm: action.payload
      });
    case _actions.default.PAGE_TITLE_DETAILS:
      return _objectSpread(_objectSpread({}, state), {}, {
        pageTitleDetails: action.payload
      });
    case _actions.default.OPEN_MODAL:
      return _objectSpread(_objectSpread({}, state), {}, {
        modal: action.payload
      });
    case _actions.default.SET_PAGE_BACK_BUTTON:
      return _objectSpread(_objectSpread({}, state), {}, {
        pageBackButton: action.payload
      });
    case _actions.default.SET_GRID_SETTINGS:
      return _objectSpread(_objectSpread({}, state), {}, {
        gridSettings: action.payload
      });
    case _actions.default.SET_LOCAL_LOCALIZATION:
      return _objectSpread(_objectSpread({}, state), {}, {
        getLocal: action.payload
      });
    case _actions.default.USER_DATA:
      return _objectSpread(_objectSpread({}, state), {}, {
        getUserData: action.payload
      });
    case _actions.default.UDPATE_PREFERENCES:
      return _objectSpread(_objectSpread({}, state), {}, {
        preferences: action.payload
      });
    case _actions.default.SET_CURRENT_PREFERENCE_NAME:
      // Handle both object payload (with model key) and string payload (for backward compatibility)
      if (typeof action.payload === 'object' && action.payload !== null && action.payload.model) {
        return _objectSpread(_objectSpread({}, state), {}, {
          currentPreference: _objectSpread(_objectSpread({}, state.currentPreference || {}), {}, {
            [action.payload.model]: action.payload.currentPreference
          })
        });
      }
      return _objectSpread(_objectSpread({}, state), {}, {
        currentPreference: action.payload
      });
    case _actions.default.TOTAL_PREFERENCES:
      return _objectSpread(_objectSpread({}, state), {}, {
        totalPreferences: action.payload
      });
    case _actions.default.UPDATE_LOADER_STATE:
      return _objectSpread(_objectSpread({}, state), {}, {
        loaderOpen: action.payload
      });
    case _actions.default.PASS_FILTERS_TOHEADER:
      return _objectSpread(_objectSpread({}, state), {}, {
        filtersInHeader: action.payload
      });
    default:
      return state;
  }
};
var _default = exports.default = stateReducer;