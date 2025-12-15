"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.for-each.js");
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
  defaultPageSize: 10,
  combosLookupIds: {
    State: 273
  },
  createCsControllerPayload: function createCsControllerPayload(action) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const formData = new FormData();
    formData.append('action', action);
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value === null || value === undefined) return;

      // 1. Handle arrays
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      // 2. Handle Dayjs or Date objects
      if (value instanceof Date || dayjs.isDayjs(value)) {
        formData.append(key, dayjs(value).format('MM/DD/YYYY'));
        return;
      }

      // 3. Auto-detect timestamp formats like: 20250226101918703 (17 digits) or 20250226 (8 digits)
      if (typeof value === 'string' || typeof value === 'number') {
        const stringVal = String(value).trim();

        // YYYYMMDD or YYYYMMDDHHmmss or YYYYMMDDHHmmssSSS
        if (/^\d{8}(\d{6}(\d{3})?)?$/.test(stringVal)) {
          const parsed = dayjs(stringVal, ["YYYYMMDDHHmmssSSS", "YYYYMMDDHHmmss", "YYYYMMDD"]);
          if (parsed.isValid()) {
            formData.append(key, parsed.format("MM/DD/YYYY"));
            return;
          }
        }

        // Join primitive values
        formData.append(key, value);
        return;
      }

      // 4. Handle plain objects
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
        return;
      }

      // Default fallback for primitives
      formData.append(key, value);
    });
    return formData;
  }
};
var _default = exports.default = constants;