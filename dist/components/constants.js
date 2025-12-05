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
    clearFilterText: "CLEAR THIS FILTER"
  },
  exportTypes: {
    PDF: 'PDF',
    CSV: 'text/csv',
    EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
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
  }
};
var _default = exports.default = constants;