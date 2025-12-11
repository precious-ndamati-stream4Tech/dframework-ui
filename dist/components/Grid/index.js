"use strict";

require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.ends-with.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.every.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.for-each.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/esnext.iterator.reduce.js");
require("core-js/modules/esnext.iterator.some.js");
require("core-js/modules/esnext.json.parse.js");
require("core-js/modules/esnext.set.difference.v2.js");
require("core-js/modules/esnext.set.intersection.v2.js");
require("core-js/modules/esnext.set.is-disjoint-from.v2.js");
require("core-js/modules/esnext.set.is-subset-of.v2.js");
require("core-js/modules/esnext.set.is-superset-of.v2.js");
require("core-js/modules/esnext.set.symmetric-difference.v2.js");
require("core-js/modules/esnext.set.union.v2.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _xDataGridPremium = require("@mui/x-data-grid-premium");
var _Delete = _interopRequireDefault(require("@mui/icons-material/Delete"));
var _FileCopy = _interopRequireDefault(require("@mui/icons-material/FileCopy"));
var _Edit = _interopRequireDefault(require("@mui/icons-material/Edit"));
var _Handyman = _interopRequireDefault(require("@mui/icons-material/Handyman"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _index = require("../SnackBar/index");
var _index2 = require("../Dialog/index");
var _crudHelper = require("./crud-helper");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _footer = require("./footer");
var _template = _interopRequireDefault(require("./template"));
var _material = require("@mui/material");
var _Check = _interopRequireDefault(require("@mui/icons-material/Check"));
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _core = require("@material-ui/core");
var _StateProvider = require("../useRouter/StateProvider");
var _LocalizedDatePicker = _interopRequireDefault(require("./LocalizedDatePicker"));
var _actions = _interopRequireDefault(require("../useRouter/actions"));
var _CustomDropdownmenu = _interopRequireDefault(require("./CustomDropdownmenu"));
var _reactI18next = require("react-i18next");
var _iconsMaterial = require("@mui/icons-material");
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _uuid = require("uuid");
var _utils = _interopRequireDefault(require("../utils"));
var _CustomToolbar = _interopRequireDefault(require("./CustomToolbar"));
var _constants = _interopRequireDefault(require("../constants"));
var _ChildGridComponent = _interopRequireDefault(require("./ChildGridComponent"));
const _excluded = ["row", "field", "id"],
  _excluded2 = ["filterField"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const defaultPageSize = 10;
const t = _utils.default.t;
const sortRegex = /(\w+)( ASC| DESC)?/i;
const recordCounts = 60000;
const actionTypes = {
  Copy: "Copy",
  Edit: "Edit",
  Delete: "Delete",
  Resolve: "Resolve",
  Assign: "Assign"
};
const booleanIconRenderer = params => {
  if (params.value) {
    return /*#__PURE__*/_react.default.createElement(_Check.default, {
      style: {
        color: 'green'
      }
    });
  } else {
    return /*#__PURE__*/_react.default.createElement(_Close.default, {
      style: {
        color: 'gray'
      }
    });
  }
};
const ExportMenuItem = _ref => {
  let {
    handleExport,
    contentType,
    type,
    isPivotExport = false,
    isDetailsExport = false,
    isLatestExport = false,
    isFieldStatusPivotExport = false,
    isInstallationPivotExport = false,
    onExportMenuClick,
    icon
  } = _ref;
  const onMenuClick = e => {
    if (isDetailsExport && onExportMenuClick) {
      onExportMenuClick({
        callback: handleExport,
        exportParams: e
      });
    } else {
      handleExport(e);
    }
  };
  return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    onClick: onMenuClick,
    "data-type": type,
    "data-content-type": contentType,
    "data-is-pivot-export": isPivotExport,
    "data-is-details-export": isDetailsExport,
    "data-is-latest-export": isLatestExport,
    "data-is-infield-export": isFieldStatusPivotExport,
    "data-is-installation-export": isInstallationPivotExport
  }, /*#__PURE__*/_react.default.createElement(_Box.default, {
    className: "grid-icons",
    sx: {
      pointerEvents: 'none'
    }
  }, icon), type);
};
ExportMenuItem.propTypes = {
  hideMenu: _propTypes.default.func
};
const CustomExportButton = props => {
  const {
    t,
    tOpts
  } = props;
  // Fallback to t if tTranslate is not provided (for backwards compatibility)
  const tTranslate = t || (key => key);
  return /*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridToolbarExportContainer, props, (props === null || props === void 0 ? void 0 : props.showOnlyExcelExport) !== true && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.GridOn, {
      fontSize: "small"
    }),
    type: "CSV",
    contentType: "text/csv"
  })), props.hideExcelExport === false && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.TableChart, {
      fontSize: "small"
    }),
    type: "Excel",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  })), props.showExportWithDetails && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.TableChart, {
      fontSize: "small"
    }),
    onExportMenuClick: props.onExportMenuClick,
    type: tTranslate(props.detailExportLabel, tOpts) || tTranslate("Excel with Details", tOpts),
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    isDetailsExport: true
  })), props.showExportWithLatestData && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.TableChart, {
      fontSize: "small"
    }),
    type: tTranslate("Excel with Latest Data", tOpts),
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    isLatestExport: true
  })), props.showPivotExportBtn && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.TableChart, {
      fontSize: "small"
    }),
    type: tTranslate("Excel with Pivot", tOpts),
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    isPivotExport: true
  })), props.showInFieldStatusPivotExportBtn && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.TableChart, {
      fontSize: "small"
    }),
    type: tTranslate("Excel with In-field Pivot", tOpts),
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    isFieldStatusPivotExport: true
  })), props.showInstallationPivotExportBtn && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.TableChart, {
      fontSize: "small"
    }),
    type: tTranslate("Excel with Installation Pivot", tOpts),
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    isInstallationPivotExport: true
  })), (props === null || props === void 0 ? void 0 : props.showOnlyExcelExport) !== true && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, props.hideXmlExport === false && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.Code, {
      fontSize: "small"
    }),
    type: "XML",
    contentType: "text/xml"
  })), props.hideHtmlExport === false && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.Language, {
      fontSize: "small"
    }),
    type: "HTML",
    contentType: "text/html"
  })), props.hideJsonExport === false && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
    icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.DataObject, {
      fontSize: "small"
    }),
    type: "JSON",
    contentType: "application/json"
  }))));
};
const areEqual = function areEqual() {
  let prevProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let nextProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let equal = true;
  for (const o in prevProps) {
    if (prevProps[o] !== nextProps[o]) {
      equal = false;
      console.error({
        o,
        prev: prevProps[o],
        next: nextProps[o]
      });
    }
  }
  for (const o in nextProps) {
    if (!prevProps.hasOwnProperty(o)) {
      equal = false;
      console.error({
        o,
        prev: prevProps[o],
        next: nextProps[o]
      });
    }
  }
  return equal;
};
const useStyles = (0, _core.makeStyles)({
  buttons: {
    margin: '6px !important'
  }
});
const convertDefaultSort = defaultSort => {
  const orderBy = [];
  if (typeof defaultSort === 'string') {
    const sortFields = defaultSort.split(',');
    for (const sortField of sortFields) {
      sortRegex.lastIndex = 0;
      const sortInfo = sortRegex.exec(sortField);
      if (sortInfo) {
        const [, field, direction = 'ASC'] = sortInfo;
        orderBy.push({
          field: field.trim(),
          sort: direction.trim().toLowerCase()
        });
      }
    }
  }
  return orderBy;
};
const GridBase = /*#__PURE__*/(0, _react.memo)(_ref2 => {
  var _stateData$gridSettin, _stateData$gridSettin2, _stateData$gridSettin3, _model$tTranslate, _stateData$gridSettin4, _apiRef$current4, _model$globalFilters3;
  let {
    useLinkColumn = true,
    model,
    columns,
    api,
    defaultSort,
    setActiveRecord,
    parentFilters,
    parent,
    where,
    customHeaderComponent,
    makeExternalRequest,
    setColumns,
    showModal,
    OrderModal,
    permissions,
    selected,
    assigned,
    available,
    disableCellRedirect = false,
    onAssignChange,
    customStyle,
    onCellClick,
    showRowsSelected,
    chartFilters,
    clearChartFilter,
    showFullScreenLoader,
    customFilters,
    onRowDoubleClick,
    baseFilters,
    onRowClick = () => {},
    gridStyle,
    reRenderKey,
    additionalFilters,
    selectedClients = null,
    onExportMenuClick,
    onResolveClick,
    onAssignmentClick,
    getRowClassName,
    showExportWithDetails = false,
    showExportWithLatestData = false,
    showInFieldStatusPivotExportBtn = false,
    showInstallationPivotExportBtn = false,
    detailExportLabel = "Excel with Details",
    rowSelectionModel = undefined,
    GlobalFiltersComponent = null,
    customApplyFunction = null,
    globalHeaderFilters = [],
    HeaderFiltersComponent = null,
    updateParentFilters,
    renderField,
    onDataLoaded,
    gridExtraParams,
    afterDataSet,
    importUrl,
    exportUrl,
    exportNote,
    disable,
    openModal,
    setOpenModal,
    manageDataName,
    showExportOption,
    setFetchData,
    childTabTitle,
    gridPivotFilter,
    onDoubleClick,
    additionalFiltersForExport,
    isClientSelected = true,
    showPivotExportBtn = false
  } = _ref2;
  const [paginationModel, setPaginationModel] = (0, _react.useState)({
    pageSize: defaultPageSize,
    page: 0
  });
  const [data, setData] = (0, _react.useState)({
    recordCount: 0,
    records: [],
    lookups: {}
  });
  const [isLoading, setIsLoading] = (0, _react.useState)(false);
  const forAssignment = !!onAssignChange;
  const rowsSelected = showRowsSelected;
  const [selection, setSelection] = (0, _react.useState)({
    type: 'include',
    ids: new Set([])
  });
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = (0, _react.useState)(false);
  const [selectedOrder, setSelectedOrder] = (0, _react.useState)(null);
  const [visibilityModel, setVisibilityModel] = (0, _react.useState)(_objectSpread({
    CreatedOn: false,
    CreatedByUser: false
  }, model === null || model === void 0 ? void 0 : model.columnVisibilityModel));
  const [isDeleting, setIsDeleting] = (0, _react.useState)(false);
  const [record, setRecord] = (0, _react.useState)(null);
  const snackbar = (0, _index.useSnackbar)();
  const {
    t: translate,
    i18n
  } = (0, _reactI18next.useTranslation)();
  const tOpts = {
    t: translate,
    i18n
  };
  const isClient = model.isClient === true ? 'client' : 'server';
  const [errorMessage, setErrorMessage] = (0, _react.useState)('');
  const [sortModel, setSortModel] = (0, _react.useState)(convertDefaultSort(defaultSort || (model === null || model === void 0 ? void 0 : model.defaultSort)));
  const [isDataFetchedInitially, setIsDataFetchedInitially] = (0, _react.useState)(false);
  const initialFilterModel = {
    items: [],
    logicOperator: 'and',
    quickFilterValues: Array(0),
    quickFilterLogicOperator: 'and'
  };
  if (model.defaultFilters) {
    initialFilterModel.items = [];
    model.defaultFilters.forEach(ele => {
      initialFilterModel.items.push(ele);
    });
  }
  const [filterModel, setFilterModel] = (0, _react.useState)(_objectSpread({}, initialFilterModel));
  const {
    pathname,
    navigate
  } = (0, _StateProvider.useRouter)();
  const apiRef = (0, _xDataGridPremium.useGridApiRef)();
  const initialGridRef = (0, _react.useRef)(null);
  const {
    idProperty = "id",
    showHeaderFilters = true,
    disableRowSelectionOnClick = true,
    createdOnKeepLocal = true,
    hideBackButton = false,
    hideTopFilters = true,
    updatePageTitle = true,
    isElasticScreen = false,
    enablePivoting = false,
    showCreateButton,
    hideExcelExport = false,
    hideXmlExport = false,
    hideHtmlExport = false,
    hideJsonExport = false,
    disableRowGrouping = true
  } = model;
  const isReadOnly = model.readOnly === true;
  const isDoubleClicked = model.doubleClicked === false;
  const customExportRef = (0, _react.useRef)();
  const dataRef = (0, _react.useRef)(data);
  const showAddIcon = model.showAddIcon === true;
  const toLink = model.columns.some(item => item.link === true);
  const globalSort = globalHeaderFilters !== null && globalHeaderFilters !== void 0 && globalHeaderFilters.length ? globalHeaderFilters.filter(ele => ele.isGlobalSort) : [];
  const [groupingModel, setGroupingModel] = (0, _react.useState)([]);
  const rowGroupBy = globalSort !== null && globalSort !== void 0 && globalSort.length ? [globalSort[0].field] : [''];
  const groupingModelRef = (0, _react.useRef)(null);
  const [isGridPreferenceFetched, setIsGridPreferenceFetched] = (0, _react.useState)(false);
  const [columnOrderModel, setColumnOrderModel] = (0, _react.useState)([]);
  const columnWidthsRef = (0, _react.useRef)({});
  const classes = useStyles();
  const {
    systemDateTimeFormat,
    stateData,
    dispatchData,
    formatDate,
    removeCurrentPreferenceName,
    getAllSavedPreferences,
    applyDefaultPreferenceIfExists
  } = (0, _StateProvider.useStateContext)();
  const modelPermissions = model.modelPermissions || permissions;
  const effectivePermissions = _objectSpread(_objectSpread(_objectSpread({}, _constants.default.permissions), stateData.gridSettings.permissions), modelPermissions);
  const {
    ClientId = 0
  } = (stateData === null || stateData === void 0 ? void 0 : stateData.getUserData) || {};
  const {
    Username
  } = stateData !== null && stateData !== void 0 && stateData.getUserData ? stateData.getUserData : {};
  const routesWithNoChildRoute = ((_stateData$gridSettin = stateData.gridSettings.permissions) === null || _stateData$gridSettin === void 0 ? void 0 : _stateData$gridSettin.routesWithNoChildRoute) || [];
  const disablePivoting = !enablePivoting;
  const url = stateData === null || stateData === void 0 || (_stateData$gridSettin2 = stateData.gridSettings) === null || _stateData$gridSettin2 === void 0 || (_stateData$gridSettin2 = _stateData$gridSettin2.permissions) === null || _stateData$gridSettin2 === void 0 ? void 0 : _stateData$gridSettin2.Url;
  const withControllersUrl = stateData === null || stateData === void 0 || (_stateData$gridSettin3 = stateData.gridSettings) === null || _stateData$gridSettin3 === void 0 || (_stateData$gridSettin3 = _stateData$gridSettin3.permissions) === null || _stateData$gridSettin3 === void 0 ? void 0 : _stateData$gridSettin3.withControllersUrl;
  const currentPreference = (stateData === null || stateData === void 0 ? void 0 : stateData.currentPreference) === 'CoolR Default' ? null : stateData === null || stateData === void 0 ? void 0 : stateData.currentPreference;
  const emptyIsAnyOfOperatorFilters = ["isEmpty", "isNotEmpty", "isAnyOf"];
  const filterFieldDataTypes = {
    Number: 'number',
    String: 'string',
    Boolean: 'boolean'
  };
  const tTranslate = (_model$tTranslate = model.tTranslate) !== null && _model$tTranslate !== void 0 ? _model$tTranslate : key => key;

  // GroupBy logic
  const groupBy = (stateData === null || stateData === void 0 ? void 0 : stateData.dataGroupBy) || '';
  const {
    groupBy: modelGroupBy = ''
  } = model;

  // Child tabs state
  const [parentGridFilter, setParentGridFilter] = (0, _react.useState)({});
  const [childGridTitle, setChildGridTitle] = (0, _react.useState)();
  const [showChildGrids, setShowChildGrids] = (0, _react.useState)(false);

  // External header filters state
  const [externalHeaderFilters, setExternalHeaderFilters] = (0, _react.useState)((model === null || model === void 0 ? void 0 : model.initialHeaderFilters) || {});
  const [headerFilters, setHeaderFilters] = (0, _react.useState)((model === null || model === void 0 ? void 0 : model.initialHeaderFilterValues) || []);
  const OrderSuggestionHistoryFields = {
    OrderStatus: 'OrderStatusId'
  };
  const preferenceApi = stateData === null || stateData === void 0 || (_stateData$gridSettin4 = stateData.gridSettings) === null || _stateData$gridSettin4 === void 0 || (_stateData$gridSettin4 = _stateData$gridSettin4.permissions) === null || _stateData$gridSettin4 === void 0 ? void 0 : _stateData$gridSettin4.preferenceApi;
  const gridColumnTypes = {
    "radio": {
      "type": "singleSelect",
      "valueOptions": "lookup"
    },
    "string": {
      "filterOperators": (0, _xDataGridPremium.getGridStringOperators)().filter(op => !['doesNotContain', 'doesNotEqual'].includes(op.value))
    },
    "date": {
      "valueFormatter": value => formatDate(value, true, false, stateData.dateTime),
      "filterOperators": (0, _LocalizedDatePicker.default)({
        columnType: "date"
      })
    },
    "dateTime": {
      "valueFormatter": value => formatDate(value, false, false, stateData.dateTime),
      "filterOperators": (0, _LocalizedDatePicker.default)({
        columnType: "datetime"
      })
    },
    "dateTimeLocal": {
      "valueFormatter": value => formatDate(value, false, false, stateData.dateTime),
      "filterOperators": (0, _LocalizedDatePicker.default)({
        type: "dateTimeLocal",
        convert: true
      })
    },
    "boolean": {
      renderCell: booleanIconRenderer
    }
  };
  (0, _react.useEffect)(() => {
    dataRef.current = data;
    if (typeof onDataLoaded === 'function') {
      onDataLoaded(data);
    }
  }, [data, onDataLoaded]);

  // Handle Group By changes from global filters
  (0, _react.useEffect)(() => {
    if (disableRowGrouping || !globalSort.length || groupingModelRef.current === globalSort[0].field) {
      // Clear grouping if no globalSort and previously had grouping
      if (!globalSort.length && groupingModelRef.current !== null) {
        setGroupingModel([]);
        setSortModel(convertDefaultSort(defaultSort || (model === null || model === void 0 ? void 0 : model.defaultSort)));
        groupingModelRef.current = null;
      }
      return;
    }
    const {
      field,
      sort
    } = globalSort[0];
    setGroupingModel([field]);
    setSortModel([{
      field: field,
      sort: sort
    }]);
    groupingModelRef.current = field;
  }, [JSON.stringify(globalSort), disableRowGrouping]);
  (0, _react.useEffect)(() => {
    if (customFilters && Object.keys(customFilters) != 0) {
      if (customFilters.clear) {
        let filterObject = {
          items: [],
          logicOperator: "and",
          quickFilterValues: [],
          quickFilterLogicOperator: "and"
        };
        setFilterModel(filterObject);
        return;
      } else {
        const newArray = [];
        for (const key in customFilters) {
          if (key === 'startDate' || key === 'endDate') {
            newArray.push(customFilters[key]);
          } else {
            if (customFilters.hasOwnProperty(key)) {
              const newObj = {
                field: key,
                value: customFilters[key],
                operator: "equals",
                type: "string"
              };
              newArray.push(newObj);
            }
          }
        }
        let filterObject = {
          items: newArray,
          logicOperator: "and",
          quickFilterValues: [],
          quickFilterLogicOperator: "and"
        };
        setFilterModel(filterObject);
      }
    }
  }, [customFilters]);
  const lookupOptions = _ref3 => {
    let {
        row,
        field,
        id
      } = _ref3,
      others = _objectWithoutProperties(_ref3, _excluded);
    const lookupData = dataRef.current.lookups || {};
    return lookupData[lookupMap[field].lookup] || [];
  };

  // Helper function to create a deep copy of initial grid state
  const captureInitialGridState = () => {
    if (apiRef.current && !initialGridRef.current) {
      var _apiRef$current$state, _apiRef$current$state2, _apiRef$current$state3, _apiRef$current$state4, _apiRef$current$state5;
      const currentColumns = apiRef.current.getAllColumns();
      const columnState = apiRef.current.state.columns;

      // Deep copy initial state with all relevant properties
      initialGridRef.current = {
        columns: {
          orderedFields: [...(columnState.orderedFields || [])],
          columnVisibilityModel: _objectSpread({}, columnState.columnVisibilityModel || {}),
          lookup: currentColumns.reduce((acc, col) => {
            acc[col.field] = {
              field: col.field,
              width: col.width,
              flex: col.flex
            };
            return acc;
          }, {})
        },
        sorting: {
          sortModel: [...(((_apiRef$current$state = apiRef.current.state.sorting) === null || _apiRef$current$state === void 0 ? void 0 : _apiRef$current$state.sortModel) || [])]
        },
        filter: {
          filterModel: {
            items: [...(((_apiRef$current$state2 = apiRef.current.state.filter) === null || _apiRef$current$state2 === void 0 || (_apiRef$current$state2 = _apiRef$current$state2.filterModel) === null || _apiRef$current$state2 === void 0 ? void 0 : _apiRef$current$state2.items) || [])],
            linkOperator: ((_apiRef$current$state3 = apiRef.current.state.filter) === null || _apiRef$current$state3 === void 0 || (_apiRef$current$state3 = _apiRef$current$state3.filterModel) === null || _apiRef$current$state3 === void 0 ? void 0 : _apiRef$current$state3.linkOperator) || 'and'
          }
        },
        pinnedColumns: {
          left: [...(((_apiRef$current$state4 = apiRef.current.state.pinnedColumns) === null || _apiRef$current$state4 === void 0 ? void 0 : _apiRef$current$state4.left) || [])],
          right: [...(((_apiRef$current$state5 = apiRef.current.state.pinnedColumns) === null || _apiRef$current$state5 === void 0 ? void 0 : _apiRef$current$state5.right) || [])]
        }
      };
    }
  };
  (0, _react.useEffect)(() => {
    if (hideTopFilters) {
      dispatchData({
        type: _actions.default.PASS_FILTERS_TOHEADER,
        payload: {
          filterButton: null,
          hidden: {
            search: true,
            operation: true,
            export: true,
            print: true,
            filter: true
          }
        }
      });
    }

    // Capture initial grid state for preferences reset functionality
    if (apiRef.current) {
      const captureTimer = setTimeout(() => {
        captureInitialGridState();
      }, 100);
      return () => clearTimeout(captureTimer);
    }
  }, []);
  const {
    gridColumns,
    pinnedColumns,
    lookupMap
  } = (0, _react.useMemo)(() => {
    const baseColumnList = columns || (model === null || model === void 0 ? void 0 : model.gridColumns) || (model === null || model === void 0 ? void 0 : model.columns);
    const pinnedColumns = {
      left: [_xDataGridPremium.GRID_CHECKBOX_SELECTION_COL_DEF.field],
      right: []
    };
    const finalColumns = [];
    const lookupMap = {};
    for (const column of baseColumnList) {
      const overrides = {};
      if (column.headerName === null) {
        continue;
      }
      if (parent && column.lookup === parent) {
        continue;
      }
      if (column.type === 'oneToMany') {
        if (column.countInList === false) {
          continue;
        }
        overrides.type = 'number';
        overrides.field = column.field.replace(/s$/, 'Count');
      }
      if (gridColumnTypes[column.type]) {
        Object.assign(overrides, gridColumnTypes[column.type]);
      }
      if (overrides.valueOptions === "lookup") {
        overrides.valueOptions = lookupOptions;
        let lookupFilters = [...(0, _xDataGridPremium.getGridDateOperators)(), ...(0, _xDataGridPremium.getGridStringOperators)()].filter(operator => ['is', 'not', 'isAnyOf'].includes(operator.value));
        overrides.filterOperators = lookupFilters.map(operator => _objectSpread(_objectSpread({}, operator), {}, {
          InputComponent: operator.InputComponent ? params => /*#__PURE__*/_react.default.createElement(_CustomDropdownmenu.default, _extends({
            column: _objectSpread(_objectSpread({}, column), {}, {
              dataRef: dataRef
            })
          }, params, {
            autoHighlight: true
          })) : undefined
        }));
      }
      if (column.linkTo) {
        overrides.cellClassName = "mui-grid-linkColumn";
      }
      if (column.link) {
        overrides.cellClassName = "mui-grid-linkColumn";
      }
      // Enable row grouping for columns when not disabled
      if (!disableRowGrouping) {
        overrides.groupable = column.groupable;
      }
      // Disable filtering for the currently grouped column
      overrides.filterable = column.filterable === false ? false : column.field !== groupingModelRef.current;

      // Apply custom label processor if available
      if (model.customLabelProcessor && typeof model.customLabelProcessor === 'function') {
        column.label = model.customLabelProcessor({
          column,
          t: tTranslate,
          tOpts
        });
      }
      finalColumns.push(_objectSpread(_objectSpread({
        headerName: tTranslate(column.headerName || column.label, tOpts)
      }, column), overrides));
      if (column.pinned) {
        pinnedColumns[column.pinned === 'right' ? 'right' : 'left'].push(column.field);
      }
      lookupMap[column.field] = column;
      column.label = column === null || column === void 0 ? void 0 : column.label;
    }
    const auditColumns = model.standard === true;
    if (auditColumns && (model === null || model === void 0 ? void 0 : model.addCreatedModifiedColumns) !== false) {
      if ((model === null || model === void 0 ? void 0 : model.addCreatedOnColumn) !== false) {
        finalColumns.push({
          field: "CreatedOn",
          type: "dateTime",
          headerName: "Created On",
          width: 200,
          filterOperators: (0, _LocalizedDatePicker.default)({
            columnType: "date"
          }),
          valueFormatter: gridColumnTypes.dateTime.valueFormatter,
          keepLocal: true
        });
      }
      if ((model === null || model === void 0 ? void 0 : model.addCreatedByColumn) !== false) {
        finalColumns.push({
          field: "CreatedByUser",
          type: "string",
          headerName: "Created By",
          width: 200
        });
      }
      if ((model === null || model === void 0 ? void 0 : model.addModifiedOnColumn) !== false) {
        finalColumns.push({
          field: "ModifiedOn",
          type: "dateTime",
          headerName: "Modified On",
          width: 200,
          filterOperators: (0, _LocalizedDatePicker.default)({
            columnType: "date"
          }),
          valueFormatter: gridColumnTypes.dateTime.valueFormatter,
          keepLocal: true
        });
      }
      if ((model === null || model === void 0 ? void 0 : model.addModifiedByColumn) !== false) {
        finalColumns.push({
          field: "ModifiedByUser",
          type: "string",
          headerName: "Modified By",
          width: 200
        });
      }
    }
    if (!forAssignment && !isReadOnly) {
      const actionsLength = [effectivePermissions.edit, effectivePermissions.add, effectivePermissions.delete, effectivePermissions.resolve, effectivePermissions.assign].filter(Boolean).length;
      if (actionsLength > 0) {
        finalColumns.push({
          headerName: tTranslate("Actions", tOpts),
          field: 'actions',
          type: 'actions',
          label: '',
          width: actionsLength * (model.actionWidth || 50),
          getActions: params => {
            const useCustomActions = model.isCustomActionsGrid || false;
            const actions = [];

            // Resolve action (first - only for custom actions)
            if (useCustomActions && effectivePermissions.resolve && onResolveClick) {
              actions.push(/*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridActionsCellItem, {
                key: "resolve",
                icon: /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
                  title: tTranslate("Resolve", tOpts)
                }, /*#__PURE__*/_react.default.createElement(_Handyman.default, {
                  fontSize: "medium"
                })),
                label: "Resolve",
                color: "primary",
                onClick: e => {
                  e.stopPropagation();
                  onResolveClick({
                    record: params.row
                  });
                }
              }));
            }

            // Delete action (second)
            if (effectivePermissions.delete) {
              actions.push(/*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridActionsCellItem, {
                key: "delete",
                icon: /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
                  title: tTranslate("Delete", tOpts)
                }, /*#__PURE__*/_react.default.createElement(_Delete.default, {
                  fontSize: "medium"
                })),
                label: "Delete",
                color: "error",
                onClick: e => {
                  e.stopPropagation();
                  setIsDeleting(true);
                  setRecord({
                    name: params.row[model === null || model === void 0 ? void 0 : model.linkColumn],
                    id: params.row[idProperty]
                  });
                }
              }));
            }

            // Copy action (third)
            if (effectivePermissions.add) {
              actions.push(/*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridActionsCellItem, {
                key: "copy",
                icon: /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
                  title: tTranslate("Copy", tOpts)
                }, /*#__PURE__*/_react.default.createElement(_FileCopy.default, {
                  fontSize: "medium"
                })),
                label: "Copy",
                color: "primary",
                onClick: e => {
                  e.stopPropagation();
                  openForm(params.row[idProperty], {
                    mode: 'copy'
                  });
                }
              }));
            }

            // Edit action (fourth)
            if (effectivePermissions.edit) {
              actions.push(/*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridActionsCellItem, {
                key: "edit",
                icon: /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
                  title: tTranslate("Edit", tOpts)
                }, /*#__PURE__*/_react.default.createElement(_Edit.default, {
                  fontSize: "medium"
                })),
                label: "Edit",
                color: "primary",
                onClick: e => {
                  e.stopPropagation();
                  openForm(params.row[idProperty]);
                }
              }));
            }

            // Assign action (last - only for custom actions)
            if (useCustomActions && modelPermissions.assign && onAssignmentClick) {
              actions.push(/*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridActionsCellItem, {
                key: "assign",
                icon: /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
                  title: tTranslate("Assign", tOpts)
                }, /*#__PURE__*/_react.default.createElement("span", {
                  style: {
                    fontSize: "medium"
                  }
                }, tTranslate('Assign', tOpts))),
                label: "Assign",
                color: "primary",
                onClick: e => {
                  e.stopPropagation();
                  onAssignmentClick({
                    record: params.row
                  });
                }
              }));
            }
            return actions;
          }
        });
        pinnedColumns.right.push('actions');
      }
    }
    return {
      gridColumns: finalColumns,
      pinnedColumns,
      lookupMap
    };
  }, [columns, model, parent, permissions, forAssignment, rowGroupBy]);
  const fetchData = function fetchData() {
    var _chartFilters$items, _model$globalFilters, _model$globalFilters2;
    let action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "list";
    let extraParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let contentType = arguments.length > 2 ? arguments[2] : undefined;
    let columns = arguments.length > 3 ? arguments[3] : undefined;
    let isPivotExport = arguments.length > 4 ? arguments[4] : undefined;
    let isElasticExport = arguments.length > 5 ? arguments[5] : undefined;
    let isDetailsExport = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    let isLatestExport = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    let isFieldStatusPivotExport = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : false;
    let isInstallationPivotExport = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : false;
    const {
      pageSize,
      page
    } = paginationModel;
    let gridApi = "".concat(model.controllerType === 'cs' ? withControllersUrl : url).concat(model.api || api);
    let controllerType = model === null || model === void 0 ? void 0 : model.controllerType;
    const isPivotGrid = (model === null || model === void 0 ? void 0 : model.isPivotGrid) || false;
    if (isPivotExport) {
      gridApi = "".concat(withControllersUrl).concat(model === null || model === void 0 ? void 0 : model.pivotAPI);
      controllerType = 'cs';
    }
    if (assigned || available) {
      extraParams[assigned ? "include" : "exclude"] = Array.isArray(selected) ? selected.join(',') : selected;
    }
    let filters = _objectSpread({}, filterModel),
      finalFilters = _objectSpread({}, filterModel);
    if ((chartFilters === null || chartFilters === void 0 || (_chartFilters$items = chartFilters.items) === null || _chartFilters$items === void 0 ? void 0 : _chartFilters$items.length) > 0) {
      let {
        columnField: field,
        operatorValue: operator
      } = chartFilters.items[0];
      field = _constants.default.chartFilterFields[field];
      const chartFilter = [{
        field: field,
        operator: operator,
        isChartFilter: false
      }];
      filters.items = [...chartFilter];
      if (JSON.stringify(filterModel) !== JSON.stringify(filters)) {
        setFilterModel(_objectSpread({}, filters));
        finalFilters = filters;
        chartFilters.items.length = 0;
      }
    }
    if (additionalFilters) {
      // Ensure each additional filter has an id field required by MUI X
      const filtersWithIds = additionalFilters.map((filter, index) => {
        if (!filter.id) {
          return _objectSpread(_objectSpread({}, filter), {}, {
            id: filter.field || "additional-filter-".concat(index)
          });
        }
        return filter;
      });
      finalFilters.items = [...finalFilters.items, ...filtersWithIds];
    }

    // Process external header filters
    if (model !== null && model !== void 0 && model.initialHeaderFilterValues) {
      const filtersWithIds = model.initialHeaderFilterValues.map((filter, index) => _objectSpread(_objectSpread({}, filter), {}, {
        id: filter.id || filter.field || "filter-".concat(Date.now(), "-").concat(index)
      }));
      finalFilters.items = [...finalFilters.items, ...filtersWithIds];
    }
    if (headerFilters !== null && headerFilters !== void 0 && headerFilters.length) {
      const filtersWithIds = headerFilters.map((filter, index) => _objectSpread(_objectSpread({}, filter), {}, {
        id: filter.id || filter.field || "filter-".concat(Date.now(), "-").concat(index)
      }));
      finalFilters.items = [...finalFilters.items, ...filtersWithIds];
    }

    // Handle client selection - if selectedClients is provided, use it; otherwise default to current ClientId
    const applyDefaultClientFilter = model.applyDefaultClientFilter !== false;
    let clientsSelected = (applyDefaultClientFilter && !selectedClients ? [Number(ClientId)] : selectedClients || []).filter(ele => ele !== 0);
    const globalFilters = {};

    // Process global filters if configuration exists
    if ((model !== null && model !== void 0 && (_model$globalFilters = model.globalFilters) !== null && _model$globalFilters !== void 0 && (_model$globalFilters = _model$globalFilters.filterConfig) !== null && _model$globalFilters !== void 0 && _model$globalFilters.length || model !== null && model !== void 0 && model.addGlobalFilters) && globalHeaderFilters !== null && globalHeaderFilters !== void 0 && globalHeaderFilters.length) {
      var _model$fieldsToRemove;
      let updatedFilters = globalHeaderFilters;
      if (model !== null && model !== void 0 && (_model$fieldsToRemove = model.fieldsToRemoveFromGlobalFilter) !== null && _model$fieldsToRemove !== void 0 && _model$fieldsToRemove.length) {
        updatedFilters = globalHeaderFilters.filter(ele => !model.fieldsToRemoveFromGlobalFilter.includes(ele.field));
      }
      // Convert header filters array to object
      Object.assign(globalFilters, updatedFilters.filter(filter => !filter.isExternalFilter).reduce((acc, _ref4) => {
        let {
          field,
          value
        } = _ref4;
        acc[field] = value;
        return acc;
      }, {}));

      // Update client selection if ClientId exists in global filters
      if ('ClientId' in globalFilters) {
        clientsSelected = globalFilters.ClientId;
      }
    }
    if (model !== null && model !== void 0 && (_model$globalFilters2 = model.globalFilters) !== null && _model$globalFilters2 !== void 0 && _model$globalFilters2.gridExternalFilters) {
      const externalFilters = globalHeaderFilters.filter(filter => filter.isExternalFilter);
      if (externalFilters !== null && externalFilters !== void 0 && externalFilters.length) {
        finalFilters.items = [...finalFilters.items, ...externalFilters];
      }
    }

    // Process external header filters
    if (model !== null && model !== void 0 && model.initialHeaderFilterValues) {
      const headerFilterItems = headerFilters.map((filter, index) => ({
        id: filter.id || filter.field || "filter-".concat(Date.now(), "-").concat(index),
        field: filter.field,
        operator: filter.operator,
        value: filter.value,
        type: filter.type
      }));
      finalFilters.items = [...finalFilters.items, ...headerFilterItems];
    }

    // Add client filter to extraParams if clients are selected
    if (clientsSelected && clientsSelected.length > 0 && model.isClient) {
      extraParams.ClientId = clientsSelected.join(',');
    }

    // Merge gridExtraParams into extraParams
    if (gridExtraParams) {
      Object.assign(extraParams, gridExtraParams);
    }
    if (model.updateSortFields) {
      model.updateSortFields({
        sort: sortModel,
        groupBy
      });
    }
    if (model.updateFilterFields) {
      finalFilters = model.updateFilterFields({
        filter: finalFilters,
        groupBy
      });
    }
    (0, _crudHelper.getList)({
      action,
      page,
      pageSize,
      sortModel,
      filterModel: finalFilters,
      controllerType: controllerType,
      api: gridApi,
      setIsLoading,
      setData,
      gridColumns,
      modelConfig: model,
      parentFilters,
      extraParams,
      setError: snackbar.showError,
      contentType,
      selectedClients: clientsSelected,
      activeClients: selectedClients !== null && selectedClients !== void 0 && selectedClients.length ? selectedClients : [Number(ClientId)].filter(ele => ele !== 0),
      columns,
      template: isPivotExport ? model === null || model === void 0 ? void 0 : model.template : null,
      configFileName: isPivotExport ? model === null || model === void 0 ? void 0 : model.configFileName : null,
      dispatchData,
      showFullScreenLoader,
      history: navigate,
      baseFilters,
      isElasticExport,
      globalFilters,
      tOpts,
      tTranslate,
      groupBy: isPivotGrid ? [groupBy] : modelGroupBy,
      afterDataSet,
      setColumns,
      setIsDataFetchedInitially,
      isDataFetchedInitially,
      fromSelfServe: false,
      isDetailsExport: isDetailsExport,
      setFetchData,
      isChildGrid: model === null || model === void 0 ? void 0 : model.isChildGrid,
      isPivotGrid,
      isPivotExport,
      gridPivotFilter,
      isLatestExport,
      payloadFilter: null,
      isFieldStatusPivotExport,
      isInstallationPivotExport,
      additionalFiltersForExport: additionalFiltersForExport,
      uiClientIds: isPivotExport && Array.isArray(clientsSelected) && clientsSelected.join(','),
      exportFileName: tTranslate((model === null || model === void 0 ? void 0 : model.exportFileName) || (model === null || model === void 0 ? void 0 : model.title), tOpts),
      languageSelected: _constants.default.supportedLanguageCodes[i18n.language || _constants.default.defaultLanguage]
    });
  };
  const openForm = function openForm(id) {
    let {
      mode
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (setActiveRecord) {
      (0, _crudHelper.getRecord)({
        id,
        api: api || (model === null || model === void 0 ? void 0 : model.api),
        setIsLoading,
        setActiveRecord,
        modelConfig: model,
        parentFilters,
        where
      });
      return;
    }
    let path = pathname;
    if (!path.endsWith("/")) {
      path += "/";
    }
    if (mode === "copy") {
      path += "0-" + id;
      dispatchData({
        type: 'UPDATE_FORM_MODE',
        payload: 'copy'
      });
    } else {
      path += id;
      dispatchData({
        type: 'UPDATE_FORM_MODE',
        payload: ''
      });
    }
    navigate(path);
  };
  const externalFilterHandleChange = (event, operator, type) => {
    const {
      name,
      value,
      label,
      isAutoComplete
    } = event.target;
    const tempValue = isAutoComplete ? label : value;
    const filters = _objectSpread(_objectSpread({}, externalHeaderFilters), {}, {
      [name]: value
    });
    const gridHeaderFilters = [...headerFilters];
    const isFilterExistsIndex = gridHeaderFilters.findIndex(ele => ele.field === name);
    if (isFilterExistsIndex > -1) {
      gridHeaderFilters[isFilterExistsIndex] = {
        field: name,
        value: tempValue,
        operator,
        type
      };
    } else {
      gridHeaderFilters.push({
        field: name,
        value: tempValue,
        operator,
        type
      });
    }
    setHeaderFilters(gridHeaderFilters);
    setExternalHeaderFilters(filters);
  };
  const onExternalFiltersApplyClick = () => {
    const initialValues = (model === null || model === void 0 ? void 0 : model.initialHeaderFilters) || {};
    if (externalHeaderFilters !== initialValues) {
      fetchData("list", {}, null, null, false, false);
    }
    if (updateParentFilters) {
      updateParentFilters(externalHeaderFilters);
    }
  };
  const onExternalFiltersResetClick = () => {
    const initialValues = (model === null || model === void 0 ? void 0 : model.initialHeaderFilters) || {};
    if (externalHeaderFilters !== initialValues) {
      setExternalHeaderFilters((model === null || model === void 0 ? void 0 : model.initialHeaderFilters) || {});
      setHeaderFilters((model === null || model === void 0 ? void 0 : model.initialHeaderFilterValues) || []);
      fetchData("list", {}, null, null, false, false);
      if (updateParentFilters) {
        updateParentFilters((model === null || model === void 0 ? void 0 : model.initialHeaderFilters) || {});
      }
    }
  };
  const onCellClickHandler = async (cellParams, event, details) => {
    var _model$childTabLinkin;
    // Call onCellClick and return early if result is not false
    if (onCellClick) {
      const result = await onCellClick({
        cellParams,
        event,
        details,
        row: cellParams === null || cellParams === void 0 ? void 0 : cellParams.row
      });
      if (result !== false) {
        return;
      }
    }
    const {
      row: record
    } = cellParams;
    const columnConfig = lookupMap[cellParams.field] || {};
    if (!isReadOnly) {
      if (columnConfig.linkTo) {
        navigate({
          pathname: _template.default.replaceTags(columnConfig.linkTo, record)
        });
        return;
      }

      // Handle link column click for edit
      if (useLinkColumn && cellParams.field === model.linkColumn) {
        return openForm(record[idProperty]);
      }
    }
    if (isReadOnly && toLink) {
      if (model !== null && model !== void 0 && model.isAcostaController && onCellClick && cellParams.colDef.customCellClick === true) {
        onCellClick(cellParams.row);
        return;
      }
      let historyObject = {
        pathname: _template.default.replaceTags(columnConfig.linkTo, record)
      };
      navigate(historyObject);
    }

    // Handle child tabs linking (outside isReadOnly check)
    if (model !== null && model !== void 0 && (_model$childTabLinkin = model.childTabLinkingKey) !== null && _model$childTabLinkin !== void 0 && _model$childTabLinkin.length) {
      const includeFilter = {};
      let title = [];
      for (const column of model === null || model === void 0 ? void 0 : model.columns) {
        const keyName = model === null || model === void 0 ? void 0 : model.childParentKeyMapping[column.field];
        if (model.childTabLinkingKey.includes(keyName)) {
          includeFilter[keyName] = record[keyName];
          title.push(record[column.field]);
          if (column.field === cellParams.field) {
            break;
          }
        }
      }
      title = title.join(' - ');
      setParentGridFilter(includeFilter);
      if (!showChildGrids) {
        setShowChildGrids(true);
      }
      setChildGridTitle(title);
    }
  };
  const handleDelete = async function handleDelete() {
    let gridApi = "".concat(model.controllerType === 'cs' ? withControllersUrl : url).concat(model.api || api);
    const result = await (0, _crudHelper.deleteRecord)({
      id: record === null || record === void 0 ? void 0 : record.id,
      api: gridApi,
      setIsLoading,
      setError: snackbar.showError,
      setErrorMessage
    });
    if (result === true) {
      setIsDeleting(false);
      snackbar.showMessage('Record Deleted Successfully.');
      fetchData();
    } else {
      setTimeout(() => {
        setIsDeleting(false);
      }, 200);
    }
  };
  const clearError = () => {
    setErrorMessage(null);
    setIsDeleting(false);
  };
  const onCellDoubleClick = event => {
    const {
      row: record
    } = event;
    if (!isReadOnly && !isDoubleClicked && !disableCellRedirect) {
      openForm(record[idProperty]);
    }
    if (isReadOnly && model.rowRedirectLink) {
      let historyObject = {
        pathname: _template.default.replaceTags(model.rowRedirectLink, record)
      };
      if (model.addRecordToState) {
        historyObject.state = record;
      }
      navigate(historyObject);
    }
    if (onRowDoubleClick) {
      onRowDoubleClick(event);
    }
  };
  const handleCloseOrderDetailModal = () => {
    setIsOrderDetailModalOpen(false);
    setSelectedOrder(null);
    fetchData();
  };
  const onAdd = () => {
    openForm(0);
  };
  const clearFilters = () => {
    var _filterModel$items;
    if ((filterModel === null || filterModel === void 0 || (_filterModel$items = filterModel.items) === null || _filterModel$items === void 0 ? void 0 : _filterModel$items.length) > 0) {
      const filters = JSON.parse(JSON.stringify(_constants.default.gridFilterModel));
      setFilterModel(filters);
      if (clearChartFilter) {
        clearChartFilter();
      }
    }
  };
  const updateAssignment = _ref5 => {
    let {
      unassign = new Set(),
      assign = new Set()
    } = _ref5;
    const assignedValues = Array.isArray(selected) ? selected : selected.length ? selected.split(',') : [];
    const unassignSet = unassign instanceof Set ? unassign : (unassign === null || unassign === void 0 ? void 0 : unassign.ids) instanceof Set ? unassign.ids : new Set();
    const assignSet = assign instanceof Set ? assign : (assign === null || assign === void 0 ? void 0 : assign.ids) instanceof Set ? assign.ids : new Set();
    const filtered = assignedValues.filter(id => !unassignSet.has(parseInt(id)));
    const finalValues = [...new Set([...filtered, ...assignSet])];
    onAssignChange(typeof selected === 'string' ? finalValues.join(',') : finalValues);
  };
  const onAssign = () => {
    updateAssignment({
      assign: selection.ids
    });
  };
  const onUnassign = () => {
    updateAssignment({
      unassign: selection.ids
    });
  };
  (0, _react.useEffect)(() => {
    const currentFields = new Set(columnOrderModel);
    const newFields = gridColumns.map(col => col.field).filter(field => !currentFields.has(field));
    if (newFields.length > 0) {
      setColumnOrderModel(prev => [...prev, ...newFields]);
    }
  }, [gridColumns, columnOrderModel.length]);

  // Synchronize columnOrderModel with grid's orderedFields to maintain column order consistency
  const prevOrderedFieldsRef = (0, _react.useRef)([]);
  (0, _react.useEffect)(() => {
    var _apiRef$current;
    const currentOrderedFields = ((_apiRef$current = apiRef.current) === null || _apiRef$current === void 0 || (_apiRef$current = _apiRef$current.state) === null || _apiRef$current === void 0 || (_apiRef$current = _apiRef$current.columns) === null || _apiRef$current === void 0 ? void 0 : _apiRef$current.orderedFields) || [];
    const prevOrderedFields = prevOrderedFieldsRef.current;

    // Check if orderedFields actually changed
    if (currentOrderedFields.length !== prevOrderedFields.length || !currentOrderedFields.every((field, index) => field === prevOrderedFields[index])) {
      prevOrderedFieldsRef.current = [...currentOrderedFields];
      setColumnOrderModel(currentOrderedFields);
    }
  });
  (0, _react.useEffect)(() => {
    const loadPreferences = async () => {
      if (model.preferenceId) {
        removeCurrentPreferenceName({
          dispatchData
        });
        getAllSavedPreferences({
          preferenceName: model.preferenceId,
          history: navigate,
          dispatchData,
          Username,
          preferenceApi
        });
        const appliedPreference = await applyDefaultPreferenceIfExists({
          preferenceName: model.preferenceId,
          history: navigate,
          dispatchData,
          Username,
          gridRef: apiRef,
          setIsGridPreferenceFetched,
          preferenceApi
        });

        // Update React states to match the applied preference
        if (appliedPreference && apiRef.current) {
          if (appliedPreference.sortModel) {
            setSortModel(appliedPreference.sortModel);
          }
          if (appliedPreference.filterModel) {
            setFilterModel(appliedPreference.filterModel);
          }
          if (appliedPreference.columnOrder) {
            setColumnOrderModel(appliedPreference.columnOrder);
          }
          if (appliedPreference.columnVisibilityModel) {
            // Use API to set column visibility instead of controlled state
            apiRef.current.setColumnVisibilityModel(appliedPreference.columnVisibilityModel);
          }
        }
      } else {
        setIsGridPreferenceFetched(true);
      }
    };
    loadPreferences();
  }, []);

  // Load initial column widths from grid API after preferences are applied
  (0, _react.useEffect)(() => {
    if (isClientSelected && isGridPreferenceFetched && apiRef.current) {
      const currentColumns = apiRef.current.getAllColumns();
      const initialWidths = {};
      currentColumns.forEach(col => {
        if (col.width) {
          initialWidths[col.field] = col.width;
        }
      });
      columnWidthsRef.current = initialWidths;
    }
  }, [isGridPreferenceFetched]);
  const getGridRowId = row => {
    const idValue = row[idProperty];
    return idValue && idValue.toString().trim() !== "" ? idValue : (0, _uuid.v4)();
  };
  const handleExport = e => {
    if ((data === null || data === void 0 ? void 0 : data.recordCount) > recordCounts) {
      snackbar.showMessage('Cannot export more than 60k records, please apply filters or reduce your results using filters');
      return;
    } else {
      const {
        orderedFields,
        columnVisibilityModel,
        lookup
      } = apiRef.current.state.columns;
      const columns = {};
      const isPivotExport = e.target.dataset.isPivotExport === 'true';
      const isDetailsExport = e.target.dataset.isDetailsExport === 'true';
      const isLatestExport = e.target.dataset.isLatestExport === 'true';
      const isFieldStatusPivotExport = e.target.dataset.isInfieldExport === 'true';
      const isInstallationPivotExport = e.target.dataset.isInstallationExport === 'true';
      const hiddenColumns = Object.keys(columnVisibilityModel).filter(key => columnVisibilityModel[key] === false);
      const visibleColumns = orderedFields.filter(ele => !(hiddenColumns !== null && hiddenColumns !== void 0 && hiddenColumns.includes(ele)) && ele !== '__check__' && ele !== 'actions');
      if ((visibleColumns === null || visibleColumns === void 0 ? void 0 : visibleColumns.length) === 0) {
        snackbar.showMessage('You cannot export while all columns are hidden... please show at least 1 column before exporting');
        return;
      }
      visibleColumns.forEach(ele => {
        if (!_constants.default.gridGroupByColumnName.includes(ele)) {
          var _lookup$ele;
          // do not include group by column in export
          columns[ele] = {
            field: ele,
            width: lookup[ele].width,
            headerName: lookup[ele].headerName,
            type: lookup[ele].type,
            keepLocal: lookup[ele].keepLocal === true,
            isParsable: (_lookup$ele = lookup[ele]) === null || _lookup$ele === void 0 ? void 0 : _lookup$ele.isParsable
          };
        }
      });
      fetchData(isPivotExport ? 'export' : undefined, undefined, e.target.dataset.contentType, columns, isPivotExport, isElasticScreen, isDetailsExport, isLatestExport, isFieldStatusPivotExport, isInstallationPivotExport);
    }
  };

  // Filter out globalHeaderFilters with isGlobalSort flag from dependencies
  // Group By changes are handled separately in their own useEffect to update groupingModel
  const filteredDependencies = (0, _react.useMemo)(() => {
    const removeGlobalSort = Array.isArray(globalHeaderFilters) ? globalHeaderFilters.filter(f => !f.isGlobalSort) : [];
    return removeGlobalSort;
  }, [globalHeaderFilters]);

  // Build dependency array similar to frontend implementation
  const commonDependencies = [api, gridColumns, model, parentFilters, assigned, selected, available, chartFilters, isGridPreferenceFetched, reRenderKey, filteredDependencies, renderField, selectedClients];
  const gridDependencyArray = (0, _react.useMemo)(() => {
    return model !== null && model !== void 0 && model.isClient ? commonDependencies : [paginationModel, sortModel, filterModel, ...commonDependencies];
  }, [model === null || model === void 0 ? void 0 : model.isClient, paginationModel, sortModel, filterModel, ...commonDependencies]);

  // Use ref to track previous stringified dependencies for deep comparison
  const previousGridDependencyRef = (0, _react.useRef)(JSON.stringify(gridDependencyArray));
  (0, _react.useEffect)(() => {
    if (isGridPreferenceFetched) {
      const currentGridDependencyArray = JSON.stringify(gridDependencyArray);

      // Only fetch if dependencies actually changed
      if (previousGridDependencyRef.current !== currentGridDependencyArray) {
        previousGridDependencyRef.current = currentGridDependencyArray;
        fetchData();
      }
    }
  }, [gridDependencyArray, isGridPreferenceFetched]);
  (0, _react.useEffect)(() => {
    if (forAssignment || !updatePageTitle) {
      return;
    }
    dispatchData({
      type: _actions.default.PAGE_TITLE_DETAILS,
      payload: {
        icon: "",
        titleHeading: (model === null || model === void 0 ? void 0 : model.pageTitle) || (model === null || model === void 0 ? void 0 : model.title),
        titleDescription: model === null || model === void 0 ? void 0 : model.titleDescription,
        title: model === null || model === void 0 ? void 0 : model.title
      }
    });
    return () => {
      dispatchData({
        type: _actions.default.PAGE_TITLE_DETAILS,
        payload: null
      });
    };
  }, []);
  (0, _react.useEffect)(() => {
    if (makeExternalRequest && typeof makeExternalRequest === 'function') {
      makeExternalRequest();
    }
  }, []);
  (0, _react.useEffect)(() => {
    let backRoute = pathname;

    // we do not need to show the back button for these routes
    if (hideBackButton || routesWithNoChildRoute.includes(backRoute)) {
      dispatchData({
        type: _actions.default.SET_PAGE_BACK_BUTTON,
        payload: {
          status: false,
          backRoute: ''
        }
      });
      return;
    }
    backRoute = backRoute.split("/");
    backRoute.pop();
    backRoute = backRoute.join("/");
    dispatchData({
      type: _actions.default.SET_PAGE_BACK_BUTTON,
      payload: {
        status: true,
        backRoute: backRoute
      }
    });
  }, [isLoading]);
  const handleColumnOrder = _ref6 => {
    var _apiRef$current2;
    let {
      column,
      oldIndex,
      targetIndex
    } = _ref6;
    if (!column || oldIndex === undefined || targetIndex === undefined || !apiRef.current) return;
    const newOrder = apiRef.current.getAllColumns().map(col => col.field);
    setColumnOrderModel(newOrder);
    // Also update the grid's internal orderedFields
    if ((_apiRef$current2 = apiRef.current) !== null && _apiRef$current2 !== void 0 && (_apiRef$current2 = _apiRef$current2.state) !== null && _apiRef$current2 !== void 0 && _apiRef$current2.columns) {
      apiRef.current.state.columns.orderedFields = newOrder;
    }
  };

  // Handle column width changes to persist across re-renders
  const handleColumnWidthChange = (0, _react.useCallback)(params => {
    // Store immediately without triggering re-render
    columnWidthsRef.current = _objectSpread(_objectSpread({}, columnWidthsRef.current), {}, {
      [params.colDef.field]: params.width
    });
  }, []);
  const updateFilters = e => {
    var _e$items, _chartFilters$items2;
    const {
      items
    } = e;
    const updatedItems = items.map(item => {
      const {
        field,
        operator,
        type,
        value
      } = item;
      const column = gridColumns.find(col => col.field === field);
      const isNumber = (column === null || column === void 0 ? void 0 : column.type) === filterFieldDataTypes.Number;
      if (field === OrderSuggestionHistoryFields.OrderStatus) {
        const {
            filterField
          } = item,
          newItem = _objectWithoutProperties(item, _excluded2);
        return newItem;
      }
      if (emptyIsAnyOfOperatorFilters.includes(operator) || isNumber && !isNaN(value) || !isNumber) {
        var _gridColumns$filter$;
        const isKeywordField = isElasticScreen && ((_gridColumns$filter$ = gridColumns.filter(element => element.field === item.field)[0]) === null || _gridColumns$filter$ === void 0 ? void 0 : _gridColumns$filter$.isKeywordField);
        if (isKeywordField) {
          item.filterField = "".concat(item.field, ".keyword");
        }
        if (column !== null && column !== void 0 && column.useCustomFilterField) {
          item.filterField = renderField;
        } else {
          item.filterField = null;
        }
        return item;
      }
      const updatedValue = isNumber ? null : value;
      return {
        field,
        operator,
        type,
        value: updatedValue
      };
    });
    e.items = updatedItems;
    setFilterModel(e);
    if ((e === null || e === void 0 || (_e$items = e.items) === null || _e$items === void 0 ? void 0 : _e$items.findIndex(ele => ele.isChartFilter && !['isEmpty', 'isNotEmpty'].includes(ele.operator))) === -1) {
      if (clearChartFilter) {
        clearChartFilter();
      }
    }
    if ((chartFilters === null || chartFilters === void 0 || (_chartFilters$items2 = chartFilters.items) === null || _chartFilters$items2 === void 0 ? void 0 : _chartFilters$items2.length) > 0) {
      if (e.items.length === 0) {
        if (clearChartFilter) {
          clearChartFilter();
        }
      } else {
        const chartFilterIndex = chartFilters === null || chartFilters === void 0 ? void 0 : chartFilters.items.findIndex(ele => ele.columnField === e.items[0].field);
        if (chartFilterIndex > -1) {
          if (clearChartFilter) {
            clearChartFilter();
          }
        }
      }
    }
  };
  const updateSort = e => {
    if (e[0]) {
      if (_constants.default.gridGroupByColumnName.includes(e[0].field)) {
        snackbar.showMessage(tTranslate('Group By is applied on the same column, please remove it in order to apply sorting.'));
        return;
      }
    }
    const sort = e.map(ele => {
      var _gridColumns$filter$2;
      const isKeywordField = isElasticScreen && ((_gridColumns$filter$2 = gridColumns.filter(element => element.field === ele.field)[0]) === null || _gridColumns$filter$2 === void 0 ? void 0 : _gridColumns$filter$2.isKeywordField);
      return _objectSpread(_objectSpread({}, ele), {}, {
        filterField: isKeywordField ? "".concat(ele.field, ".keyword") : ele.field
      });
    });
    setSortModel(sort);
  };
  const orderedColumns = (0, _react.useMemo)(() => {
    var _apiRef$current3;
    let columns = gridColumns;

    // Apply stored column widths from ref (only when grid re-renders)
    const currentWidths = columnWidthsRef.current;
    if (Object.keys(currentWidths).length > 0) {
      columns = columns.map(col => {
        const storedWidth = currentWidths[col.field];
        return storedWidth ? _objectSpread(_objectSpread({}, col), {}, {
          width: storedWidth
        }) : col;
      });
    }

    // Apply column ordering from grid state (for preferences) or component state
    // After preferences are loaded, prefer the grid's orderedFields
    const orderedFields = (_apiRef$current3 = apiRef.current) === null || _apiRef$current3 === void 0 || (_apiRef$current3 = _apiRef$current3.state) === null || _apiRef$current3 === void 0 || (_apiRef$current3 = _apiRef$current3.columns) === null || _apiRef$current3 === void 0 ? void 0 : _apiRef$current3.orderedFields;
    const orderToUse = isGridPreferenceFetched && orderedFields && Array.isArray(orderedFields) && orderedFields.length > 0 ? orderedFields : columnOrderModel && columnOrderModel.length > 0 ? columnOrderModel : orderedFields;

    // If no order specified, return all columns
    if (!orderToUse || !Array.isArray(orderToUse) || !orderToUse.length) return columns;
    const fieldMap = new Map(columns.map(c => [c.field, c]));

    // Get ordered columns that exist in fieldMap
    const orderedCols = orderToUse.map(field => fieldMap.get(field)).filter(Boolean);

    // Add any columns from gridColumns that aren't in the order
    const orderedFieldsSet = new Set(orderedCols.map(c => c.field));
    const missingCols = columns.filter(c => !orderedFieldsSet.has(c.field));

    // Return ordered columns + any missing columns at the end
    return [...orderedCols, ...missingCols];
  }, [gridColumns, columnOrderModel, isGridPreferenceFetched, (_apiRef$current4 = apiRef.current) === null || _apiRef$current4 === void 0 || (_apiRef$current4 = _apiRef$current4.state) === null || _apiRef$current4 === void 0 || (_apiRef$current4 = _apiRef$current4.columns) === null || _apiRef$current4 === void 0 ? void 0 : _apiRef$current4.orderedFields]);
  const hideFooter = model.showFooter === false;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, (model === null || model === void 0 || (_model$globalFilters3 = model.globalFilters) === null || _model$globalFilters3 === void 0 || (_model$globalFilters3 = _model$globalFilters3.filterConfig) === null || _model$globalFilters3 === void 0 ? void 0 : _model$globalFilters3.length) && GlobalFiltersComponent && /*#__PURE__*/_react.default.createElement(GlobalFiltersComponent, {
    filterGroupByConfig: model.globalFilters,
    addExternalClientDependency: model === null || model === void 0 ? void 0 : model.addExternalClientDependency,
    customApplyFunction: customApplyFunction
  }), model !== null && model !== void 0 && model.externalHeaderFilters && HeaderFiltersComponent ? /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginBottom: 10,
      display: 'flex',
      paddingTop: 10,
      paddingBottom: 10
    }
  }, /*#__PURE__*/_react.default.createElement(HeaderFiltersComponent, {
    model: model,
    onHandleChange: externalFilterHandleChange,
    values: externalHeaderFilters,
    onApplyClick: onExternalFiltersApplyClick,
    onResetClick: onExternalFiltersResetClick
  })) : null, /*#__PURE__*/_react.default.createElement("div", {
    style: gridStyle || customStyle
  }, /*#__PURE__*/_react.default.createElement(_Box.default, {
    className: "grid-parent-container"
  }, /*#__PURE__*/_react.default.createElement(_xDataGridPremium.DataGridPremium, {
    showToolbar: true,
    headerFilters: showHeaderFilters,
    checkboxSelection: forAssignment,
    loading: isLoading,
    className: "pagination-fix",
    onCellClick: onCellClickHandler,
    onCellDoubleClick: onCellDoubleClick,
    columns: orderedColumns,
    onColumnOrderChange: handleColumnOrder,
    onColumnWidthChange: handleColumnWidthChange,
    paginationModel: paginationModel,
    pageSizeOptions: [5, 10, 20, 50, 100],
    onPaginationModelChange: setPaginationModel,
    pagination: true,
    rowCount: data.recordCount || 0,
    rows: data.records || [],
    sortModel: sortModel,
    paginationMode: isClient,
    sortingMode: isClient,
    filterMode: isClient,
    disablePivoting: disablePivoting,
    keepNonExistentRowsSelected: true,
    onSortModelChange: updateSort,
    onFilterModelChange: updateFilters,
    onRowSelectionModelChange: newRowSelectionModel => {
      setSelection(newRowSelectionModel);
    },
    rowSelectionModel: rowSelectionModel !== undefined ? rowSelectionModel : selection,
    filterModel: filterModel,
    getRowId: getGridRowId,
    getRowClassName: getRowClassName,
    onRowClick: onRowClick,
    slots: {
      toolbar: _CustomToolbar.default,
      footer: _footer.Footer,
      headerFilterMenu: null
    },
    slotProps: {
      headerFilterCell: {
        showClearIcon: true
      },
      toolbar: {
        model,
        customHeaderComponent,
        currentPreference,
        isReadOnly,
        modelPermissions,
        forAssignment,
        showAddIcon,
        showCreateButton,
        available,
        assigned,
        t,
        tOpts,
        classes,
        onAdd,
        onAssign,
        onUnassign,
        clearFilters,
        handleExport,
        onExportMenuClick,
        hideExcelExport,
        hideXmlExport,
        hideHtmlExport,
        hideJsonExport,
        apiRef,
        gridColumns,
        setIsGridPreferenceFetched,
        initialGridRef,
        setIsLoading,
        CustomExportButton,
        showExportWithDetails,
        showExportWithLatestData,
        showPivotExportBtn,
        showInFieldStatusPivotExportBtn,
        showInstallationPivotExportBtn,
        detailExportLabel,
        effectivePermissions,
        tTranslate
      },
      footer: {
        pagination: true,
        apiRef,
        tTranslate
      },
      pagination: {
        backIconButtonProps: {
          title: tTranslate('Go to previous page', tOpts),
          'aria-label': tTranslate('Go to previous page', tOpts)
        },
        nextIconButtonProps: {
          title: tTranslate('Go to next page', tOpts),
          'aria-label': tTranslate('Go to next page', tOpts)
        }
      }
    },
    hideFooterSelectedRowCount: rowsSelected,
    density: "compact",
    hideFooter: hideFooter,
    disableDensitySelector: true,
    apiRef: apiRef,
    disableAggregation: true,
    disableRowGrouping: disableRowGrouping,
    columnOrderModel: columnOrderModel,
    rowGroupingModel: groupingModel,
    disableRowSelectionOnClick: disableRowSelectionOnClick,
    initialState: {
      columns: {
        columnVisibilityModel: visibilityModel
      },
      pinnedColumns: pinnedColumns
    },
    localeText: {
      noRowsLabel: t('No data', tOpts),
      footerTotalRows: "".concat(t('Total rows', tOpts), ":"),
      MuiTablePagination: {
        labelRowsPerPage: t('Rows per page', tOpts),
        labelDisplayedRows: _ref7 => {
          let {
            from,
            to,
            count
          } = _ref7;
          return "".concat(from, "\u2013").concat(to, " ").concat(t('of', tOpts), " ").concat(count);
        }
      },
      toolbarQuickFilterPlaceholder: t((model === null || model === void 0 ? void 0 : model.searchPlaceholder) || 'Search...', tOpts),
      toolbarColumns: t('Columns', tOpts),
      toolbarFilters: t('Filters', tOpts),
      toolbarExport: t('Export', tOpts),
      filterPanelAddFilter: t('Add filter', tOpts),
      filterPanelRemoveAll: t('Remove all', tOpts),
      filterPanelDeleteIconLabel: t('Delete', tOpts),
      filterPanelColumns: t('Columns', tOpts),
      filterPanelOperator: t('Operator', tOpts),
      filterPanelValue: t('Value', tOpts),
      filterPanelInputLabel: t('Value', tOpts),
      filterPanelInputPlaceholder: t('Filter value', tOpts),
      columnMenuLabel: t('Menu', tOpts),
      columnMenuShowColumns: t('Show columns', tOpts),
      columnMenuManageColumns: t('Manage columns', tOpts),
      columnMenuFilter: t('Filter', tOpts),
      columnMenuHideColumn: t('Hide column', tOpts),
      columnMenuManagePivot: t('Manage pivot', tOpts),
      toolbarColumnsLabel: t('Select columns', tOpts),
      toolbarExportLabel: t('Export', tOpts),
      pivotDragToColumns: t('Drag here to pivot by', tOpts),
      pivotDragToRows: t('Drag here to group by', tOpts),
      pivotDragToValues: t('Drag here to create values', tOpts),
      pivotColumns: t('Pivot columns', tOpts),
      pivotRows: t('Row groups', tOpts),
      pivotValues: t('Values', tOpts),
      pivotMenuRows: t('Rows', tOpts),
      pivotMenuColumns: t('Columns', tOpts),
      pivotMenuValues: t('Values', tOpts),
      pivotToggleLabel: t('Pivot', tOpts),
      pivotSearchControlPlaceholder: t('Search pivot columns', tOpts),
      columnMenuUnsort: t('Unsort', tOpts),
      columnMenuSortAsc: t('Sort by ascending', tOpts),
      columnMenuSortDesc: t('Sort by descending', tOpts),
      columnMenuUnpin: t('Unpin', tOpts),
      columnsPanelTextFieldLabel: t('Find column', tOpts),
      columnsPanelTextFieldPlaceholder: t('Column title', tOpts),
      columnsPanelHideAllButton: t('Hide all', tOpts),
      columnsPanelShowAllButton: t('Show all', tOpts),
      pinToLeft: t('Pin to left', tOpts),
      pinToRight: t('Pin to right', tOpts),
      unpin: t('Unpin', tOpts),
      filterValueAny: t('any', tOpts),
      filterValueTrue: t('true', tOpts),
      filterValueFalse: t('false', tOpts),
      filterOperatorIs: t('is', tOpts),
      filterOperatorNot: t('is not', tOpts),
      filterOperatorIsAnyOf: t('is any of', tOpts),
      filterOperatorContains: t('contains', tOpts),
      filterOperatorDoesNotContain: t('does not contain', tOpts),
      filterOperatorEquals: t('equals', tOpts),
      filterOperatorDoesNotEqual: t('does not equal', tOpts),
      filterOperatorStartsWith: t('starts with', tOpts),
      filterOperatorEndsWith: t('ends with', tOpts),
      filterOperatorIsEmpty: t('is empty', tOpts),
      filterOperatorIsNotEmpty: t('is not empty', tOpts),
      filterOperatorAfter: t('is after', tOpts),
      filterOperatorOnOrAfter: t('is on or after', tOpts),
      filterOperatorBefore: t('is before', tOpts),
      filterOperatorOnOrBefore: t('is on or before', tOpts),
      toolbarFiltersTooltipHide: t('Hide filters', tOpts),
      toolbarFiltersTooltipShow: t('Show filters', tOpts),
      //filter textfield labels
      headerFilterOperatorContains: t('contains', tOpts),
      headerFilterOperatorEquals: t('equals', tOpts),
      headerFilterOperatorStartsWith: t('starts with', tOpts),
      headerFilterOperatorEndsWith: t('ends with', tOpts),
      headerFilterOperatorIsEmpty: t('is empty', tOpts),
      headerFilterOperatorIsNotEmpty: t('is not empty', tOpts),
      headerFilterOperatorAfter: t('is after', tOpts),
      headerFilterOperatorOnOrAfter: t('is on or after', tOpts),
      headerFilterOperatorBefore: t('is before', tOpts),
      headerFilterOperatorOnOrBefore: t('is on or before', tOpts),
      headerFilterOperatorIs: t('is', tOpts),
      'headerFilterOperator=': t('equals', tOpts),
      'headerFilterOperator!=': t('does not equal', tOpts),
      'headerFilterOperator>': t('greater than', tOpts),
      'headerFilterOperator>=': t('greater than or equal to', tOpts),
      'headerFilterOperator<': t('less than', tOpts),
      'headerFilterOperator<=': t('less than or equal to', tOpts),
      columnsManagementSearchTitle: t('Search', tOpts),
      columnsManagementNoColumns: t('No columns', tOpts),
      paginationRowsPerPage: t('Rows per page', tOpts),
      paginationDisplayedRows: _ref8 => {
        let {
          from,
          to,
          count
        } = _ref8;
        return "".concat(from, "\u2013").concat(to, " ").concat(t('of', tOpts), " ").concat(count);
      },
      toolbarQuickFilterLabel: t('Search', tOpts),
      toolbarFiltersTooltipActive: count => "".concat(count, " ").concat(t("active filter".concat(count > 1 ? 's' : ''), tOpts)),
      columnHeaderSortIconLabel: t('Sort', tOpts),
      filterPanelOperatorAnd: t('And', tOpts),
      filterPanelOperatorOr: t('Or', tOpts),
      noResultsOverlayLabel: t('No results found', tOpts),
      columnHeaderFiltersTooltipActive: count => "".concat(count, " ").concat(t(count === 1 ? 'active filter' : 'active filters', tOpts)),
      detailPanelToggle: t("Detail panel toggle", tOpts),
      checkboxSelectionHeaderName: t('Checkbox selection', tOpts),
      columnsManagementShowHideAllText: t('Show/Hide all', tOpts),
      noColumnsOverlayLabel: t('No columns', tOpts),
      noColumnsOverlayManageColumns: t('Manage columns', tOpts),
      columnsManagementReset: t('Reset', tOpts),
      groupColumn: name => "".concat(t('Group by', tOpts), " ").concat(name),
      unGroupColumn: name => "".concat(t('Ungroup', tOpts), " ").concat(name),
      footerRowSelected: count => count !== 1 ? "".concat(count.toLocaleString(), " ").concat(t('items selected', tOpts)) : "1 ".concat(t('item selected', tOpts))
    },
    columnHeaderHeight: 70,
    sx: {
      "& .MuiDataGrid-toolbarContainer": {
        flexShrink: 0,
        marginTop: 1,
        borderBottom: 'none !important'
      }
    }
  })), model !== null && model !== void 0 && model.childTabs ? /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_ChildGridComponent.default, {
    tabs: model === null || model === void 0 ? void 0 : model.childTabs,
    selected: parentGridFilter,
    hideChildGrids: () => setShowChildGrids(false),
    childGridTitle: childGridTitle,
    showChildGrids: showChildGrids
  })) : null, isOrderDetailModalOpen && selectedOrder && model.OrderModal && /*#__PURE__*/_react.default.createElement(model.OrderModal, {
    orderId: selectedOrder.OrderId,
    isOpen: true,
    orderTotal: selectedOrder.OrderTotal,
    orderDate: selectedOrder.OrderDateTime,
    orderStatus: selectedOrder.OrderStatus,
    customerNumber: selectedOrder.CustomerPhoneNumber,
    customerName: selectedOrder.CustomerName,
    customerEmail: selectedOrder.CustomerEmailAddress,
    onClose: handleCloseOrderDetailModal
  }), errorMessage && /*#__PURE__*/_react.default.createElement(_index2.DialogComponent, {
    open: !!errorMessage,
    onConfirm: clearError,
    onCancel: clearError,
    title: "Info",
    hideCancelButton: true
  }, " ", errorMessage), isDeleting && !errorMessage && /*#__PURE__*/_react.default.createElement(_index2.DialogComponent, {
    open: isDeleting,
    onConfirm: handleDelete,
    onCancel: () => setIsDeleting(false),
    title: "Confirm Delete"
  }, " ", 'Are you sure you want to delete'.concat(" ", record === null || record === void 0 ? void 0 : record.name, "?"))));
}, areEqual);
var _default = exports.default = GridBase;