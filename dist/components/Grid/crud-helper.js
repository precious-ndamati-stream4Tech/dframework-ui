"use strict";

require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveRecord = exports.getRecord = exports.getList = exports.deleteRecord = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.every.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.for-each.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/esnext.set.difference.v2.js");
require("core-js/modules/esnext.set.intersection.v2.js");
require("core-js/modules/esnext.set.is-disjoint-from.v2.js");
require("core-js/modules/esnext.set.is-subset-of.v2.js");
require("core-js/modules/esnext.set.is-superset-of.v2.js");
require("core-js/modules/esnext.set.symmetric-difference.v2.js");
require("core-js/modules/esnext.set.union.v2.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url-search-params.js");
require("core-js/modules/web.url-search-params.delete.js");
require("core-js/modules/web.url-search-params.has.js");
require("core-js/modules/web.url-search-params.size.js");
var _dayjs = _interopRequireDefault(require("dayjs"));
var _utc = _interopRequireDefault(require("dayjs/plugin/utc"));
var _actions = _interopRequireDefault(require("../useRouter/actions"));
var _httpRequest = _interopRequireWildcard(require("./httpRequest"));
var _constants = _interopRequireDefault(require("../constants"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Add = _interopRequireDefault(require("@mui/icons-material/Add"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
_dayjs.default.extend(_utc.default);
const dateDataTypes = ['date', 'dateTime'];
const getList = async _ref => {
  var _filterModel$items;
  let {
    gridColumns,
    setIsLoading,
    setData,
    page,
    pageSize,
    sortModel,
    filterModel,
    api,
    parentFilters,
    action = 'list',
    setError,
    extraParams,
    contentType,
    columns,
    controllerType = 'node',
    template = null,
    configFileName = null,
    dispatchData,
    showFullScreenLoader = false,
    oderStatusId = 0,
    modelConfig = null,
    baseFilters = null,
    isElasticExport,
    fromSelfServe = false,
    isDetailsExport = false,
    setFetchData = () => {},
    selectedClients = [],
    isChildGrid = false,
    groupBy,
    isPivotExport = false,
    gridPivotFilter = [],
    activeClients,
    isLatestExport = false,
    payloadFilter = [],
    isFieldStatusPivotExport = false,
    isInstallationPivotExport = false,
    uiClientIds = '',
    globalFilters = {},
    additionalFiltersForExport,
    setColumns,
    afterDataSet,
    setIsDataFetchedInitially,
    isDataFetchedInitially,
    exportFileName = null,
    tTranslate = null,
    tOpts = null,
    languageSelected,
    formatMerchandisingDateRange = null
  } = _ref;
  if (!contentType) {
    setIsLoading(true);
    if (showFullScreenLoader) {
      dispatchData({
        type: _actions.default.UPDATE_LOADER_STATE,
        payload: true
      });
    }
  }
  let isPortalController = controllerType === 'cs';
  if (fromSelfServe) {
    isPortalController = false;
    api = (modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.selfServerAPI) || api;
  }
  const lookups = [];
  const dateColumns = [];
  gridColumns.forEach(_ref2 => {
    let {
      lookup,
      type,
      field,
      keepUTC = false
    } = _ref2;
    if (dateDataTypes.includes(type)) {
      dateColumns.push({
        field,
        keepUTC
      });
    }
    if (!lookup) {
      return;
    }
    if (!lookups.includes(lookup)) {
      lookups.push(lookup);
    }
  });
  const where = [];
  if (filterModel !== null && filterModel !== void 0 && (_filterModel$items = filterModel.items) !== null && _filterModel$items !== void 0 && _filterModel$items.length) {
    filterModel.items.forEach(filter => {
      var _constants$emptyNotEm;
      if ((_constants$emptyNotEm = _constants.default.emptyNotEmptyOperators) !== null && _constants$emptyNotEm !== void 0 && _constants$emptyNotEm.includes(filter.operator) || filter.value || filter.value === false || filter.value === 0) {
        var _column$, _column$2;
        const {
          field,
          operator,
          filterField
        } = filter;
        let {
          value
        } = filter;
        const column = gridColumns.filter(item => item.field === filter.field);
        let type = (filter === null || filter === void 0 ? void 0 : filter.type) || ((_column$ = column[0]) === null || _column$ === void 0 ? void 0 : _column$.type);
        const sqlType = (_column$2 = column[0]) === null || _column$2 === void 0 ? void 0 : _column$2.sqlType;
        if (type === 'boolean') {
          if (isPortalController) {
            value = typeof value === 'string' ? value === 'true' : value;
          } else {
            value = Boolean(value) ? 1 : 0;
          }
        } else if (type === 'number') {
          value = Array.isArray(value) ? value.filter(e => e) : value;
        }
        value = filter.filterValues || value;
        where.push({
          field: filterField || field,
          operator: operator,
          value: value,
          type: type,
          sqlType: sqlType
        });
      }
    });
  }
  if (parentFilters) {
    where.push(...parentFilters);
  }
  if (baseFilters) {
    where.push(...baseFilters);
  }
  const requestData = _objectSpread(_objectSpread({
    start: page * pageSize,
    limit: modelConfig !== null && modelConfig !== void 0 && modelConfig.isClient ? 0 : isElasticExport ? modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.exportSize : pageSize
  }, extraParams), {}, {
    logicalOperator: filterModel.logicOperator,
    sort: sortModel.map(sort => (sort.filterField || sort.field) + ' ' + sort.sort).join(','),
    where,
    selectedClients,
    oderStatusId: oderStatusId,
    isElasticExport,
    fileName: tTranslate(exportFileName || (modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.title) || (modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.overrideFileName), tOpts),
    fromSelfServe,
    isChildGrid,
    groupBy,
    isLatestExport,
    globalFilters
  });
  if (lookups) {
    requestData.lookups = lookups.join(',');
  }
  if (modelConfig !== null && modelConfig !== void 0 && modelConfig.limitToSurveyed) {
    requestData.limitToSurveyed = modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.limitToSurveyed;
  }
  if (modelConfig !== null && modelConfig !== void 0 && modelConfig.includeColumns) {
    requestData.columns = gridColumns;
  }
  if (modelConfig !== null && modelConfig !== void 0 && modelConfig.gridType) {
    requestData.gridType = modelConfig.gridType;
  }
  const headers = {};
  if (isPortalController && contentType) {
    action = 'export';
  }
  let url = isPortalController ? isDetailsExport ? "".concat(api) : "".concat(api, "?action=").concat(action, "&asArray=0") : "".concat(api, "/").concat(action);
  const isPivot = isPivotExport || isFieldStatusPivotExport || isInstallationPivotExport;
  if (template !== null) {
    url += "&template=".concat(template);
  }
  if (configFileName !== null) {
    url += "&configFileName=".concat(configFileName);
  }
  if (isPivot) {
    url += "&uiClientIds=".concat(uiClientIds);
    if (isPortalController && exportFileName) {
      url += "&exportFileName=".concat(exportFileName);
    }
  }
  if (modelConfig !== null && modelConfig !== void 0 && modelConfig.customApi) {
    url = modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.customApi;
  }
  let exportParams = {
    exportFileName: tTranslate ? tTranslate(exportFileName || (modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.title) || (modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.overrideFileName), tOpts) : exportFileName || (modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.title) || (modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.overrideFileName),
    action,
    exportFormat: 'XLSX',
    title: modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.pageTitle,
    sort: sortModel.map(sort => (sort.filterField || sort.field) + ' ' + sort.sort).join(','),
    TimeOffSet: new Date().getTimezoneOffset()
  };
  if (isDetailsExport && additionalFiltersForExport) {
    requestData['additionalFiltersForExport'] = additionalFiltersForExport;
    exportParams['additionalFiltersForExport'] = additionalFiltersForExport;
  }
  if (contentType) {
    if (isDetailsExport) {
      url = url + "?v=" + new Date() + '&' + 'forExport=true';
    }
    if (where !== null && where !== void 0 && where.length && modelConfig !== null && modelConfig !== void 0 && modelConfig.convertFiltersToPortalFormat) {
      // Note: This requires utils.createFilter which may need to be imported or implemented
      exportParams['filter'] = where[0] || '';
    }
    const form = document.createElement("form");
    requestData.responseType = contentType;
    requestData.columns = columns;
    if (isPortalController) {
      var _constants$contentTyp;
      requestData.exportFormat = ((_constants$contentTyp = _constants.default.contentTypeToFileType) === null || _constants$contentTyp === void 0 ? void 0 : _constants$contentTyp[contentType]) || 'XLSX';
      requestData.selectedFields = Object.keys(columns).join();
      if (requestData.sort && !Object.keys(columns).includes(requestData.sort)) {
        requestData.selectedFields += ",".concat(requestData.sort);
      }
      requestData.cols = Object.keys(columns).map(col => {
        return {
          ColumnName: columns[col].field,
          Header: columns[col].headerName,
          Width: columns[col].width
        };
      });
      delete requestData.columns;
      delete requestData.responseType;
    }
    requestData.userTimezoneOffset = new Date().getTimezoneOffset() * -1;
    requestData.languageSelected = languageSelected;
    form.setAttribute("method", "POST");
    form.setAttribute("id", "exportForm");
    form.setAttribute("target", "_blank");
    let arr = isDetailsExport && action === 'export' ? exportParams : requestData;
    arr['isDetailsExport'] = isDetailsExport;
    if (isPivot && gridPivotFilter !== null && gridPivotFilter !== void 0 && gridPivotFilter.length) {
      for (const item of gridPivotFilter) {
        let v = item.value;
        if (v === undefined || v === null) {
          continue;
        } else if (typeof v !== 'string') {
          v = JSON.stringify(v);
        }
        let hiddenTag = document.createElement('input');
        hiddenTag.type = "hidden";
        hiddenTag.name = item.field;
        hiddenTag.value = v;
        form.append(hiddenTag);
      }
    }
    if (modelConfig !== null && modelConfig !== void 0 && modelConfig.addSelectedClientsForExport) {
      let hiddenTag = document.createElement('input');
      hiddenTag.type = "hidden";
      hiddenTag.name = "activeClients";
      hiddenTag.value = activeClients.toString();
      form.append(hiddenTag);
    }
    if (template === null) {
      for (const key in arr) {
        let v = arr[key];
        if (v === undefined || v === null) {
          continue;
        } else if (typeof v !== 'string') {
          v = JSON.stringify(v);
        }
        let hiddenTag = document.createElement('input');
        hiddenTag.type = "hidden";
        hiddenTag.name = key;
        hiddenTag.value = v;
        form.append(hiddenTag);
      }
    }
    form.setAttribute('action', url);
    document.body.appendChild(form);
    form.submit();
    setTimeout(() => {
      document.getElementById("exportForm").remove();
    }, 3000);
    return;
  }
  try {
    let params = {
      url,
      method: 'POST',
      data: requestData,
      headers: _objectSpread({
        "Content-Type": "application/json"
      }, headers),
      credentials: 'include'
    };
    let response;
    if (isPortalController) {
      response = await (0, _httpRequest.default)({
        url,
        params: requestData,
        history,
        dispatchData
      });
      setData(response);
    } else {
      response = await (0, _httpRequest.transport)(params);
      if (response.status === _httpRequest.HTTP_STATUS_CODES.OK) {
        var _response$data2, _response$data3;
        const {
          records,
          userCurrencySymbol
        } = response.data;
        if (records) {
          records.forEach(record => {
            if (record.hasOwnProperty("TotalOrder")) {
              record["TotalOrder"] = "".concat(userCurrencySymbol).concat(record["TotalOrder"]);
            }
            dateColumns.forEach(column => {
              const {
                field,
                keepUTC
              } = column;
              if (record[field]) {
                record[field] = keepUTC ? _dayjs.default.utc(record[field]) : new Date(record[field]);
              }
            });
          });
        }
        if (modelConfig !== null && modelConfig !== void 0 && modelConfig.dynamicColumns && setColumns) {
          var _response$data;
          const existingLabels = new Set(gridColumns === null || gridColumns === void 0 ? void 0 : gridColumns.map(col => col.label));
          const dynamicResponseColumns = ((_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.dynamicColumns) || [];
          const isMerchandisingColumn = dynamicResponseColumns === null || dynamicResponseColumns === void 0 ? void 0 : dynamicResponseColumns.every(col => col.key);
          let newDynamicColumns;
          if (isMerchandisingColumn) {
            newDynamicColumns = dynamicResponseColumns === null || dynamicResponseColumns === void 0 ? void 0 : dynamicResponseColumns.filter(col => !existingLabels.has(col.key));
            existingLabels.clear();
            newDynamicColumns = newDynamicColumns.map(col => {
              if (col.addDrillDownIcon) {
                col.renderCell = params => {
                  return /*#__PURE__*/React.createElement(_IconButton.default, {
                    onClick: e => modelConfig.onDrillDown(params, col),
                    size: "small",
                    style: {
                      padding: 1
                    }
                  }, /*#__PURE__*/React.createElement(_Add.default, null));
                };
              }
              if (col.key && !col.addDrillDownIcon && formatMerchandisingDateRange) {
                if (typeof formatMerchandisingDateRange === 'function') {
                  col.label = formatMerchandisingDateRange(col.label);
                }
              }
              return col;
            });
          } else {
            if (modelConfig.updateDynamicColumns) {
              newDynamicColumns = modelConfig.updateDynamicColumns({
                dynamicResponseColumns,
                t,
                tOpts
              });
            }
          }
          if (newDynamicColumns.length) {
            setColumns([...modelConfig.columns, ...newDynamicColumns]);
          }
        }
        // Ensure records and recordCount always have defaults
        setData(_objectSpread(_objectSpread({}, response.data), {}, {
          records: ((_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : _response$data2.records) || [],
          recordCount: ((_response$data3 = response.data) === null || _response$data3 === void 0 ? void 0 : _response$data3.recordCount) || 0
        }));
        if (setFetchData) setFetchData(true);
        if (afterDataSet && !isDataFetchedInitially) {
          afterDataSet();
          setIsDataFetchedInitially(true);
        }
      } else {
        setError(response.statusText);
      }
    }
  } catch (err) {
    let errorMessage = err;
    if (tTranslate && tOpts) {
      errorMessage = tTranslate(err.message, tOpts);
    }
    setError(errorMessage);
  } finally {
    if (!contentType) {
      setIsLoading(false);
      if (showFullScreenLoader) {
        dispatchData({
          type: _actions.default.UPDATE_LOADER_STATE,
          payload: false
        });
      }
    }
  }
};
exports.getList = getList;
const getRecord = async _ref3 => {
  var _Object$keys;
  let {
    api,
    id,
    setIsLoading,
    setActiveRecord,
    modelConfig,
    parentFilters,
    where = {},
    setError
  } = _ref3;
  api = api || (modelConfig === null || modelConfig === void 0 ? void 0 : modelConfig.api);
  setIsLoading(!(modelConfig !== null && modelConfig !== void 0 && modelConfig.overrideLoaderOnInitialRender));
  const searchParams = new URLSearchParams();
  const url = "".concat(api, "/").concat(id === undefined || id === null ? '-' : id);
  const lookupsToFetch = [];
  const fields = modelConfig.formDef || modelConfig.columns;
  fields === null || fields === void 0 || fields.forEach(field => {
    if (field.lookup && !lookupsToFetch.includes(field.lookup)) {
      lookupsToFetch.push(field.lookup);
    }
  });
  searchParams.set("lookups", lookupsToFetch);
  if (where && (_Object$keys = Object.keys(where)) !== null && _Object$keys !== void 0 && _Object$keys.length) {
    searchParams.set("where", JSON.stringify(where));
  }
  ;
  try {
    const response = await (0, _httpRequest.transport)({
      url: "".concat(url, "?").concat(searchParams.toString()),
      method: 'GET',
      credentials: 'include'
    });
    if (response.status === _httpRequest.HTTP_STATUS_CODES.OK) {
      const {
        data: record,
        lookups
      } = response.data;
      let title = record[modelConfig.linkColumn];
      const columnConfig = modelConfig.columns.find(a => a.field === modelConfig.linkColumn);
      if (columnConfig && columnConfig.lookup) {
        var _lookups$columnConfig;
        if (lookups && lookups[columnConfig.lookup] && (_lookups$columnConfig = lookups[columnConfig.lookup]) !== null && _lookups$columnConfig !== void 0 && _lookups$columnConfig.length) {
          const lookupValue = lookups[columnConfig.lookup].find(a => a.value === title);
          if (lookupValue) {
            title = lookupValue.label;
          }
        }
      }
      const defaultValues = _objectSpread({}, modelConfig.defaultValues);
      setActiveRecord({
        id,
        title: title,
        record: _objectSpread(_objectSpread(_objectSpread({}, defaultValues), record), parentFilters),
        lookups
      });
    } else if (response.status === _httpRequest.HTTP_STATUS_CODES.UNAUTHORIZED) {
      setError('Session Expired!');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      setError('Could not load record', response.body.toString());
    }
  } catch (error) {
    setError('Could not load record', error);
  } finally {
    setIsLoading(false);
  }
};
exports.getRecord = getRecord;
const deleteRecord = exports.deleteRecord = async function deleteRecord(_ref4) {
  let {
    id,
    api,
    setIsLoading,
    setError,
    setErrorMessage,
    tTranslate,
    tOpts
  } = _ref4;
  let result = {
    success: false,
    error: ''
  };
  if (!id) {
    const errorMsg = tTranslate ? tTranslate('Deleted failed. No active record', tOpts) : 'Deleted failed. No active record';
    setError(errorMsg);
    return;
  }
  setIsLoading(true);
  try {
    const response = await (0, _httpRequest.transport)({
      url: "".concat(api, "/").concat(id),
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.status === _httpRequest.HTTP_STATUS_CODES.OK) {
      result.success = true;
      return true;
    }
    if (response.status === _httpRequest.HTTP_STATUS_CODES.UNAUTHORIZED) {
      const errorMsg = tTranslate ? tTranslate('Session Expired!', tOpts) : 'Session Expired!';
      setError(errorMsg);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      const errorMsg = tTranslate ? tTranslate('Delete failed', tOpts) : 'Delete failed';
      const bodyMsg = tTranslate ? tTranslate(response.body, tOpts) : response.body;
      setError(errorMsg, bodyMsg);
    }
  } catch (error) {
    var _error$response;
    const errorMessage = error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.error;
    result.error = errorMessage;
    const errorMsg = tTranslate ? tTranslate(errorMessage, tOpts) : errorMessage;
    setErrorMessage(errorMsg);
  } finally {
    setIsLoading(false);
  }
  return result;
};
const saveRecord = exports.saveRecord = async function saveRecord(_ref5) {
  let {
    id,
    api,
    values,
    setIsLoading,
    setError,
    tTranslate,
    tOpts
  } = _ref5;
  let url, method;
  if (id) {
    url = "".concat(api, "/").concat(id);
    method = 'PUT';
  } else {
    url = api;
    method = 'POST';
  }
  try {
    setIsLoading(true);
    const response = await (0, _httpRequest.transport)({
      url,
      method,
      data: values,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (response.status === _httpRequest.HTTP_STATUS_CODES.OK) {
      const {
        data = {}
      } = response.data;
      if (data.success) {
        return data;
      }
      const errorMsg = tTranslate ? tTranslate('Save failed', tOpts) : 'Save failed';
      const dataMsg = tTranslate ? tTranslate(data.err || data.message, tOpts) : data.err || data.message;
      setError(errorMsg, dataMsg);
      return;
    }
    if (response.status === _httpRequest.HTTP_STATUS_CODES.UNAUTHORIZED) {
      const errorMsg = tTranslate ? tTranslate('Session Expired!', tOpts) : 'Session Expired!';
      setError(errorMsg);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      const errorMsg = tTranslate ? tTranslate('Save failed', tOpts) : 'Save failed';
      const bodyMsg = tTranslate ? tTranslate(response.body, tOpts) : response.body;
      setError(errorMsg, bodyMsg);
    }
  } catch (error) {
    const errorMsg = tTranslate ? tTranslate('Save failed', tOpts) : 'Save failed';
    const errMsg = tTranslate ? tTranslate(error, tOpts) : error;
    setError(errorMsg, errMsg);
  } finally {
    setIsLoading(false);
  }
  return false;
};