"use strict";

require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.ends-with.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.for-each.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/esnext.json.parse.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _xDataGridPremium = require("@mui/x-data-grid-premium");
var _Delete = _interopRequireDefault(require("@mui/icons-material/Delete"));
var _FileCopy = _interopRequireDefault(require("@mui/icons-material/FileCopy"));
var _Edit = _interopRequireDefault(require("@mui/icons-material/Edit"));
var _FilterListOff = _interopRequireDefault(require("@mui/icons-material/FilterListOff"));
var _Add = _interopRequireDefault(require("@mui/icons-material/Add"));
var _Remove = _interopRequireDefault(require("@mui/icons-material/Remove"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
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
var _utils = _interopRequireDefault(require("../utils"));
var _CustomToolbar = _interopRequireDefault(require("./CustomToolbar"));
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
  Delete: "Delete"
};
const constants = {
  gridFilterModel: {
    items: [],
    logicOperator: 'and',
    quickFilterValues: Array(0),
    quickFilterLogicOperator: 'and'
  },
  permissions: {
    edit: true,
    add: true,
    export: true,
    delete: true,
    clearFilterText: "CLEAR THIS FILTER"
  }
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
const ExportMenuItem = _ref => {
  let {
    tTranslate,
    tOpts,
    handleExport,
    contentType,
    type,
    isPivotExport = false,
    icon
  } = _ref;
  return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    onClick: handleExport,
    "data-type": type,
    "data-content-type": contentType,
    "data-is-pivot-export": isPivotExport
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
const CustomExportButton = props => /*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridToolbarExportContainer, props, (props === null || props === void 0 ? void 0 : props.showOnlyExcelExport) !== true && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
  icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.GridOn, {
    fontSize: "small"
  }),
  type: "CSV",
  contentType: "text/csv"
})), /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
  icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.TableChart, {
    fontSize: "small"
  }),
  type: "Excel",
  contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
})), props.showPivotExportBtn && /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
  icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.TableChart, {
    fontSize: "small"
  }),
  type: "Excel with Pivot",
  contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  isPivotExport: true
})), (props === null || props === void 0 ? void 0 : props.showOnlyExcelExport) !== true && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
  icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.Code, {
    fontSize: "small"
  }),
  type: "XML",
  contentType: "text/xml"
})), /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
  icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.Language, {
    fontSize: "small"
  }),
  type: "HTML",
  contentType: "text/html"
})), /*#__PURE__*/_react.default.createElement(ExportMenuItem, _extends({}, props, {
  icon: /*#__PURE__*/_react.default.createElement(_iconsMaterial.DataObject, {
    fontSize: "small"
  }),
  type: "JSON",
  contentType: "application/json"
}))));
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
const GridBase = /*#__PURE__*/(0, _react.memo)(_ref2 => {
  var _stateData$gridSettin, _stateData$gridSettin2, _stateData$gridSettin3, _model$tTranslate, _stateData$gridSettin4;
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
    title,
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
    onExportMenuClick
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
  const [selection, setSelection] = (0, _react.useState)([]);
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
    hideJsonExport = false
  } = model;
  const isReadOnly = model.readOnly === true;
  const isDoubleClicked = model.doubleClicked === false;
  const customExportRef = (0, _react.useRef)();
  const dataRef = (0, _react.useRef)(data);
  const showAddIcon = model.showAddIcon === true;
  const toLink = model.columns.map(item => item.link);
  const [isGridPreferenceFetched, setIsGridPreferenceFetched] = (0, _react.useState)(false);
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
  const effectivePermissions = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, constants.permissions), stateData.gridSettings.permissions), model.permissions), permissions);
  const {
    ClientId
  } = stateData !== null && stateData !== void 0 && stateData.getUserData ? stateData.getUserData : {};
  const {
    Username
  } = stateData !== null && stateData !== void 0 && stateData.getUserData ? stateData.getUserData : {};
  const routesWithNoChildRoute = ((_stateData$gridSettin = stateData.gridSettings.permissions) === null || _stateData$gridSettin === void 0 ? void 0 : _stateData$gridSettin.routesWithNoChildRoute) || [];
  const disablePivoting = !enablePivoting;
  const url = stateData === null || stateData === void 0 || (_stateData$gridSettin2 = stateData.gridSettings) === null || _stateData$gridSettin2 === void 0 || (_stateData$gridSettin2 = _stateData$gridSettin2.permissions) === null || _stateData$gridSettin2 === void 0 ? void 0 : _stateData$gridSettin2.Url;
  const withControllersUrl = stateData === null || stateData === void 0 || (_stateData$gridSettin3 = stateData.gridSettings) === null || _stateData$gridSettin3 === void 0 || (_stateData$gridSettin3 = _stateData$gridSettin3.permissions) === null || _stateData$gridSettin3 === void 0 ? void 0 : _stateData$gridSettin3.withControllersUrl;
  const currentPreference = stateData === null || stateData === void 0 ? void 0 : stateData.currentPreference;
  const emptyIsAnyOfOperatorFilters = ["isEmpty", "isNotEmpty", "isAnyOf"];
  const filterFieldDataTypes = {
    Number: 'number',
    String: 'string',
    Boolean: 'boolean'
  };
  const tTranslate = (_model$tTranslate = model.tTranslate) !== null && _model$tTranslate !== void 0 ? _model$tTranslate : key => key;
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
  }, [data]);
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
    if (apiRef.current) {
      // Wait for the grid to be fully initialized
      const timer = setTimeout(() => {
        if (!initialGridRef.current) {
          initialGridRef.current = _objectSpread({}, apiRef.current);
        }
      }, 100);
      return () => clearTimeout(timer);
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
      const actions = [];
      if (effectivePermissions !== null && effectivePermissions !== void 0 && effectivePermissions.edit) {
        actions.push(/*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridActionsCellItem, {
          icon: /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
            title: "Edit"
          }, "   ", /*#__PURE__*/_react.default.createElement(_Edit.default, null)),
          "data-action": actionTypes.Edit,
          label: "Edit",
          color: "primary"
        }));
      }
      if (effectivePermissions.add) {
        actions.push(/*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridActionsCellItem, {
          icon: /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
            title: "Copy"
          }, /*#__PURE__*/_react.default.createElement(_FileCopy.default, null), " "),
          "data-action": actionTypes.Copy,
          label: "Copy",
          color: "primary"
        }));
      }
      if (effectivePermissions.delete) {
        actions.push(/*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridActionsCellItem, {
          icon: /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
            title: "Delete"
          }, /*#__PURE__*/_react.default.createElement(_Delete.default, null), " "),
          "data-action": actionTypes.Delete,
          label: "Delete",
          color: "error"
        }));
      }
      if (actions.length > 0) {
        finalColumns.push({
          field: 'actions',
          type: 'actions',
          label: '',
          width: actions.length * 50,
          getActions: () => actions
        });
      }
      pinnedColumns.right.push('actions');
    }
    return {
      gridColumns: finalColumns,
      pinnedColumns,
      lookupMap
    };
  }, [columns, model, parent, permissions, forAssignment]);
  const fetchData = function fetchData() {
    var _chartFilters$items;
    let action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "list";
    let extraParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let contentType = arguments.length > 2 ? arguments[2] : undefined;
    let columns = arguments.length > 3 ? arguments[3] : undefined;
    let isPivotExport = arguments.length > 4 ? arguments[4] : undefined;
    let isElasticExport = arguments.length > 5 ? arguments[5] : undefined;
    const {
      pageSize,
      page
    } = paginationModel;
    let gridApi = "".concat(model.controllerType === 'cs' ? withControllersUrl : url).concat(model.api || api);
    let controllerType = model === null || model === void 0 ? void 0 : model.controllerType;
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
      field = constants.chartFilterFields[field];
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
      finalFilters.items = [...finalFilters.items, ...additionalFilters];
    }
    (0, _crudHelper.getList)({
      action,
      page: !contentType ? page : 0,
      pageSize: !contentType ? pageSize : 1000000,
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
      columns,
      template: isPivotExport ? model === null || model === void 0 ? void 0 : model.template : null,
      configFileName: isPivotExport ? model === null || model === void 0 ? void 0 : model.configFileName : null,
      dispatchData,
      showFullScreenLoader,
      history: navigate,
      baseFilters,
      isElasticExport,
      tOpts,
      tTranslate
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
  const onCellClickHandler = async (cellParams, event, details) => {
    if (!isReadOnly) {
      if (onCellClick) {
        const result = await onCellClick({
          cellParams,
          event,
          details
        });
        if (typeof result !== "boolean") {
          return;
        }
      }
      const {
        row: record
      } = cellParams;
      const columnConfig = lookupMap[cellParams.field] || {};
      if (columnConfig.linkTo) {
        navigate({
          pathname: _template.default.replaceTags(columnConfig.linkTo, record)
        });
        return;
      }
      let action = useLinkColumn && cellParams.field === model.linkColumn ? actionTypes.Edit : null;
      if (!action && cellParams.field === 'actions') {
        action = details === null || details === void 0 ? void 0 : details.action;
        if (!action) {
          const el = event.target.closest('button');
          if (el) {
            action = el.dataset.action;
          }
        }
      }
      if (action === actionTypes.Edit) {
        return openForm(record[idProperty]);
      }
      if (action === actionTypes.Copy) {
        return openForm(record[idProperty], {
          mode: 'copy'
        });
      }
      if (action === actionTypes.Delete) {
        setIsDeleting(true);
        setRecord({
          name: record[model === null || model === void 0 ? void 0 : model.linkColumn],
          id: record[idProperty]
        });
      }
    }
    if (isReadOnly && toLink) {
      if (model !== null && model !== void 0 && model.isAcostaController && onCellClick && cellParams.colDef.customCellClick === true) {
        onCellClick(cellParams.row);
        return;
      }
      const {
        row: record
      } = cellParams;
      const columnConfig = lookupMap[cellParams.field] || {};
      let historyObject = {
        pathname: _template.default.replaceTags(columnConfig.linkTo, record)
      };
      if (model.addRecordToState) {
        historyObject.state = record;
      }
      navigate(historyObject);
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
      const filters = JSON.parse(JSON.stringify(constants.gridFilterModel));
      setFilterModel(filters);
      if (clearChartFilter) {
        clearChartFilter();
      }
    }
  };
  const updateAssignment = _ref4 => {
    let {
      unassign,
      assign
    } = _ref4;
    const assignedValues = Array.isArray(selected) ? selected : selected.length ? selected.split(',') : [];
    const finalValues = unassign ? assignedValues.filter(id => !unassign.includes(parseInt(id))) : [...assignedValues, ...assign];
    onAssignChange(typeof selected === 'string' ? finalValues.join(',') : finalValues);
  };
  const onAssign = () => {
    updateAssignment({
      assign: selection
    });
  };
  const onUnassign = () => {
    updateAssignment({
      unassign: selection
    });
  };
  (0, _react.useEffect)(() => {
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
    applyDefaultPreferenceIfExists({
      preferenceName: model.preferenceId,
      history: navigate,
      dispatchData,
      Username,
      gridRef: apiRef,
      setIsGridPreferenceFetched,
      preferenceApi
    });
  }, []);
  const getGridRowId = row => {
    return row[idProperty];
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
      const hiddenColumns = Object.keys(columnVisibilityModel).filter(key => columnVisibilityModel[key] === false);
      const visibleColumns = orderedFields.filter(ele => !(hiddenColumns !== null && hiddenColumns !== void 0 && hiddenColumns.includes(ele)) && ele !== '__check__' && ele !== 'actions');
      if ((visibleColumns === null || visibleColumns === void 0 ? void 0 : visibleColumns.length) === 0) {
        snackbar.showMessage('You cannot export while all columns are hidden... please show at least 1 column before exporting');
        return;
      }
      visibleColumns.forEach(ele => {
        var _lookup$ele;
        columns[ele] = {
          field: ele,
          width: lookup[ele].width,
          headerName: lookup[ele].headerName,
          type: lookup[ele].type,
          keepLocal: lookup[ele].keepLocal === true,
          isParsable: (_lookup$ele = lookup[ele]) === null || _lookup$ele === void 0 ? void 0 : _lookup$ele.isParsable
        };
      });
      fetchData(isPivotExport ? 'export' : undefined, undefined, e.target.dataset.contentType, columns, isPivotExport, isElasticScreen);
    }
  };
  (0, _react.useEffect)(() => {
    if (isGridPreferenceFetched) {
      fetchData();
    }
  }, [paginationModel, sortModel, filterModel, api, gridColumns, model, parentFilters, assigned, selected, available, chartFilters, isGridPreferenceFetched, reRenderKey]);
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
    const sort = e.map(ele => {
      var _gridColumns$filter$2;
      const isKeywordField = isElasticScreen && ((_gridColumns$filter$2 = gridColumns.filter(element => element.field === ele.field)[0]) === null || _gridColumns$filter$2 === void 0 ? void 0 : _gridColumns$filter$2.isKeywordField);
      return _objectSpread(_objectSpread({}, ele), {}, {
        filterField: isKeywordField ? "".concat(ele.field, ".keyword") : ele.field
      });
    });
    setSortModel(sort);
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: gridStyle || customStyle
  }, /*#__PURE__*/_react.default.createElement(_Box.default, {
    className: "grid-parent-container"
  }, /*#__PURE__*/_react.default.createElement(_xDataGridPremium.DataGridPremium, {
    headerFilters: showHeaderFilters,
    checkboxSelection: forAssignment,
    loading: isLoading,
    showToolbar: true,
    className: "pagination-fix",
    onCellClick: onCellClickHandler,
    onCellDoubleClick: onCellDoubleClick,
    columns: gridColumns,
    paginationModel: paginationModel,
    pageSizeOptions: [5, 10, 20, 50, 100],
    onPaginationModelChange: setPaginationModel,
    pagination: true,
    rowCount: data.recordCount,
    rows: data.records,
    sortModel: sortModel,
    paginationMode: isClient,
    sortingMode: isClient,
    filterMode: isClient,
    disablePivoting: disablePivoting,
    keepNonExistentRowsSelected: true,
    onSortModelChange: updateSort,
    onFilterModelChange: updateFilters,
    rowSelection: selection,
    onRowSelectionModelChange: setSelection,
    filterModel: filterModel,
    getRowId: getGridRowId,
    onRowClick: onRowClick,
    slots: {
      headerFilterMenu: false,
      toolbar: _CustomToolbar.default,
      footer: _footer.Footer
    },
    slotProps: {
      toolbar: {
        model,
        customHeaderComponent,
        currentPreference,
        isReadOnly,
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
        effectivePermissions,
        tTranslate
      },
      footer: {
        pagination: true,
        apiRef,
        tTranslate: tTranslate
      }
    },
    hideFooterSelectedRowCount: rowsSelected,
    density: "compact",
    disableDensitySelector: true,
    apiRef: apiRef,
    disableAggregation: true,
    disableRowGrouping: true,
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
        labelDisplayedRows: _ref5 => {
          let {
            from,
            to,
            count
          } = _ref5;
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
      paginationDisplayedRows: _ref6 => {
        let {
          from,
          to,
          count
        } = _ref6;
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
  })), isOrderDetailModalOpen && selectedOrder && model.OrderModal && /*#__PURE__*/_react.default.createElement(model.OrderModal, {
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
  }, " ", 'Are you sure you want to delete'.concat(" ", record === null || record === void 0 ? void 0 : record.name, "?")));
}, areEqual);
var _default = exports.default = GridBase;