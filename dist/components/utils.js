"use strict";

require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.push.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.for-each.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const emptyOperatorFilters = ["isEmpty", "isNotEmpty"];
const utils = {
  filterFieldDataTypes: {
    Number: 'number',
    String: 'string',
    Boolean: 'boolean'
  },
  fixedFilterFormat: {
    date: "YYYY-MM-DD",
    datetime: "YYYY-MM-DD hh:mm:ss a",
    dateTimeLocal: "YYYY-MM-DD hh:mm:ss a",
    OverrideDateFormat: "DD-MMM-YYYY"
  },
  t(sentence, i18nNext) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!i18nNext) {
      return sentence;
    }
    if (!sentence) {
      return;
    }
    const {
      t,
      i18n
    } = i18nNext;
    if (!(t || i18n)) {
      return sentence;
    }
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    const isEdge = !isIE && !!window.StyleMedia;

    // Additional condition added for Edge and Firefox as they do not return only en instead return en-IN
    if ((i18n === null || i18n === void 0 ? void 0 : i18n.language) === "en" || (i18n === null || i18n === void 0 ? void 0 : i18n.language.split('-')[0]) === "en") {
      return t(sentence, options);
    }
    const optionKeys = Object.keys(options);
    let loweredSentence = [];
    // In case of non en language do not lowercase the variable , as lowercase it will result in value not updating in string
    if (optionKeys.length) {
      loweredSentence = sentence.split(" ");
      loweredSentence = loweredSentence.map(item => {
        if (item.includes("{{") && item.includes("}}") && isEdge) {
          return item;
        } else {
          return item.toLowerCase();
        }
      });
    }
    const tString = loweredSentence.length ? loweredSentence.join(" ") : sentence.toString().toLowerCase();
    const transformed = t(tString, options);
    if (sentence === sentence.toString().toUpperCase()) {
      return transformed.toString().toUpperCase();
    } else if (sentence === sentence.toString().toLowerCase()) {
      return transformed.toString().toLowerCase();
    } else {
      return transformed[0].toUpperCase() + transformed.substring(1);
    }
  },
  /**
   * Build portal-controller style filter parameters from a "where" array.
   *
   * Converts an array of filter descriptors into the backend-expected
   * query parameter shape:
   *   filter[<i>][field] = <fieldName>
   *   filter[<i>][data][type] = <type>
   *   filter[<i>][data][value] = <value>
   *
   * Behavior:
   * - Iterates the `where` array and only processes entries that have a value:
   *   - array values must have length > 0
   *   - non-array values must be truthy
   * - Uses ele.field as the field name.
   * - Uses ele.type or defaults to 'string' for the data type.
   * - Writes results into the provided `filterParams` object (mutates).
   * - If `where` is falsy or empty, returns an empty object immediately.
   *
   * Params:
   * @param {Array<Object>} where - Array of filter descriptors. Typical shape:
   *    { fieldName?: string, field?: string, type?: string, value: any }
   *    (value can be an array or scalar)
   * @param {Object} [filterParams={}] - Optional object to populate with generated params.
   *    This object is mutated in-place. Example after call:
   *      filter[0][field] = 'Status'
   *      filter[0][data][type] = 'string'
   *      filter[0][data][value] = 'active'
   *
   * Returns:
   * - undefined (function mutates filterParams).
   * - Note: when `where` is falsy or empty the function returns an empty object {}.
   *
   * Usage:
   *  const params = {};
   *  const where = [
   *    { field: 'Status', type: 'string', value: 'active' },
   *    { fieldName: 'CreatedOn', type: 'date', value: ['2024-01-01','2024-12-31'] }
   *  ];
   *  utils.createFormDataFilter(where, params);
   *  // params now has portal-style filter keys ready to be sent in request
   * 
   * Returns:
   *   undefined if `where` is falsy or empty; otherwise, mutates `filterParams` in place.
   */
  createFormDataFilter: function createFormDataFilter(where) {
    let filterParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!where || !where.length) return;
    where.forEach((ele, index) => {
      var _ele$value;
      if (Array.isArray(ele.value) && (_ele$value = ele.value) !== null && _ele$value !== void 0 && _ele$value.length || !Array.isArray(ele.value) && ele.value) {
        const filterKeyName = "filter[".concat(index, "][field]");
        filterParams[filterKeyName] = ele.field;
        const typeKeyName = "filter[".concat(index, "][data][type]");
        filterParams[typeKeyName] = ele.type || 'string';
        const valueKeyName = "filter[".concat(index, "][data][value]");
        filterParams[valueKeyName] = ele.value;
      }
    });
  },
  filterChecker(items, filterIsEmpty) {
    let newItems = items;
    if (filterIsEmpty) {
      newItems = items.filter(item => {
        if (emptyOperatorFilters.includes(item.operatorValue) || emptyOperatorFilters.includes(item.operator)) {
          item.value = ['number', 'decimal'].includes(item.type) ? [null] : ['', null];
        }
        return item.value || emptyOperatorFilters.includes(item.operatorValue) || emptyOperatorFilters.includes(item.operator);
      });
    } else {
      newItems = items.filter(item => {
        if (emptyOperatorFilters.includes(item.operator)) {
          item.value = ['number', 'decimal'].includes(item.type) ? [null] : ['', null];
        }
        return item !== null && item !== void 0 && item.value ? item : null;
      });
    }
    return newItems;
  },
  checkForDateValue(item) {
    const newDate = new Date(item);
    if (newDate.toString() === "Invalid Date") {
      return false;
    } else {
      return true;
    }
  },
  createFilter(modelFilter) {
    let typeExport = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let filterIsEmpty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    let columnType = arguments.length > 3 ? arguments[3] : undefined;
    let snackbar = arguments.length > 4 ? arguments[4] : undefined;
    let t = arguments.length > 5 ? arguments[5] : undefined;
    let tOpts = arguments.length > 6 ? arguments[6] : undefined;
    if (!modelFilter || !modelFilter.items) {
      return false;
    }
    const items = this.filterChecker(modelFilter.items, filterIsEmpty);
    let filters = {},
      logicalOperator = modelFilter.logicalOperator || modelFilter.logicOperator || modelFilter.linkOperator;
    logicalOperator = logicalOperator.toUpperCase();
    if (typeExport) {
      const newFilters = items.map(item => {
        const isValueADate = this.checkForDateValue(item.value);
        const newItem = {};
        newItem[(item === null || item === void 0 ? void 0 : item.columnField) || item.field] = item.value;
        newItem["operatorValue"] = (item === null || item === void 0 ? void 0 : item.operatorValue) || (item === null || item === void 0 ? void 0 : item.operator) || "";
        newItem["isValueADate"] = isValueADate;
        return newItem;
      });
      return newFilters;
    }
    let applyFilter = true;
    items.map((item, key) => {
      const isEmptyFilter = emptyOperatorFilters.includes(item.operatorValue || item.operator);
      if (!filterIsEmpty) {
        if (item.value === '' || item.value === null || item.value === undefined) {
          applyFilter = false;
        }
        if (isEmptyFilter) {
          applyFilter = true;
        }
      }
      if (applyFilter) {
        let itemValues = Array.isArray(item.value) ? item.value : [item.value];
        const operator = item.operatorValue || item.operator;
        // Check for unsafe number values and exit if found.
        if (['decimal', 'number'].includes(columnType || item.type)) {
          for (const value of itemValues) {
            const numericValue = value ? Number(value) : "";
            if (isNaN(numericValue)) {
              snackbar === null || snackbar === void 0 || snackbar.showError(t("Please enter a valid number.", tOpts));
              return;
            }
            if (numericValue > SQL_INT_MAX) {
              snackbar === null || snackbar === void 0 || snackbar.showError(t("The entered value exceeds the allowed range. Please enter a smaller number.", tOpts));
              return; // Exit the function so that newItem is never created.
            }
            if (numericValue < SQL_INT_MIN) {
              snackbar === null || snackbar === void 0 || snackbar.showError(t("The entered value exceeds the allowed range. Please enter a larger number.", tOpts));
              return;
            }
          }
        }
        if (['decimal', 'number'].includes(columnType || item.type) && ['isEmpty', 'isNotEmpty'].includes(operator)) {
          itemValues = itemValues.map(val => val === '' ? 0 : val);
        }
        const newItem = {
          fieldName: item.columnField || item.field,
          operatorId: this.filterType[item.operatorValue || item.operator],
          convert: false,
          values: itemValues
        };
        if (!items[1]) {
          filters = newItem;
          return;
        }
        switch (key) {
          case 0:
            filters["left"] = newItem;
            break;
          case 1:
            filters["logicalOperator"] = logicalOperator;
            filters["right"] = newItem;
            break;
          default:
            let newFilter = {};
            if (!filters["right"] && filters["left"]) {
              newFilter = _objectSpread({}, filters);
              newFilter["logicalOperator"] = logicalOperator;
              newFilter["right"] = newItem;
            } else if (filters["right"] && filters["left"]) {
              newFilter = _objectSpread({}, filters);
              newFilter["left"] = filters;
              newFilter["logicalOperator"] = logicalOperator;
              newFilter["right"] = newItem;
            }
            filters = _objectSpread({}, newFilter);
            break;
        }
      }
    });
    return filters;
  },
  addToFilter(filter, item, operator) {
    let newFilter = {};
    operator = operator.toUpperCase();
    if (Object.keys(filter).length === 0) {
      return item;
    } else if (!filter["right"] && filter["left"]) {
      newFilter = _objectSpread({}, filter);
      newFilter["logicalOperator"] = operator;
      newFilter["right"] = item;
    } else if (filter["right"] && filter["left"]) {
      newFilter = _objectSpread({}, filter);
      newFilter["left"] = filter;
      newFilter["logicalOperator"] = operator;
      newFilter["right"] = item;
    } else {
      newFilter["left"] = _objectSpread({}, filter);
      newFilter["logicalOperator"] = operator;
      newFilter["right"] = item;
    }
    return newFilter;
  }
};
var _default = exports.default = utils;