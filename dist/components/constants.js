"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
    clearFilterText: "CLEAR THIS FILTER",
    filter: true,
    columns: true
  },
  exportTypes: {
    PDF: 'PDF',
    CSV: 'text/csv',
    EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  defaultPreferenceId: 0,
  actionTypes: {
    Copy: "Copy",
    Edit: "Edit",
    Delete: "Delete"
  },
  supportedLanguageCodes: {
    "en": "English",
    "tr-TR": "Turkish",
    "es-ES": "Spanish",
    "da-DK": "Danish",
    "de-DE": "German",
    "el-GR": "Greek",
    "fr-FR": "French",
    "pt-PT": "Portuguese",
    "it-IT": "Italian",
    "ru-RU": "Russian"
  },
  ShowCustomActions: [9, 58],
  pageSizeOptions: [5, 10, 20, 50, 100],
  OrderSuggestionHistoryFields: {
    OrderStatus: 'OrderStatusId'
  },
  gridGroupByColumnName: ['__row_group_by_columns_group__', '__detail_panel_toggle__'],
  SQL_INT_MAX: 2147483647,
  SQL_INT_MIN: -2147483648,
  GridOperators: {
    IsAnyOf: 'isAnyOf'
  },
  emptyIsAnyOfOperatorFilters: ["isEmpty", "isNotEmpty", "isAnyOf"],
  emptyNotEmptyOperators: ["isEmpty", "isNotEmpty"],
  contentTypeToFileType: {
    'text/csv': 'CSV',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/pdf': 'PDF'
  },
  filterFieldDataTypes: {
    Number: 'number',
    String: 'string',
    Boolean: 'boolean',
    Decimal: 'decimal',
    Percentage: 'percentage'
  },
  chartFilterFields: {
    SerialNumber: "SerialNumber",
    AssetType: "AssetType",
    Code: "LocationCode",
    MDMSerialNumber: "MDMSerialNumber",
    SmartDeviceSerialNumber: "SmartDeviceSerialNumber",
    PlanogramName: "PlanogramName",
    Status: "Status"
  },
  defaultLanguage: 'en',
  defaultPageSize: 10
};
var _default = exports.default = constants;