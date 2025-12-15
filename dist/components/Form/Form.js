"use strict";

require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ActiveStepContext = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.object.from-entries.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.promise.finally.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.for-each.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/esnext.iterator.reduce.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _formik = require("formik");
var _crudHelper = require("../Grid/crud-helper");
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Paper = _interopRequireDefault(require("@mui/material/Paper"));
var _Stack = _interopRequireDefault(require("@mui/material/Stack"));
var _CircularProgress = _interopRequireDefault(require("@mui/material/CircularProgress"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _fieldMapper = _interopRequireDefault(require("./field-mapper"));
var _SnackBar = require("../SnackBar");
var _Dialog = require("../Dialog");
var _PageTitle = _interopRequireDefault(require("../PageTitle"));
var _StateProvider = require("../useRouter/StateProvider");
var _actions = _interopRequireDefault(require("../useRouter/actions"));
var _utils = _interopRequireDefault(require("../utils"));
var _reactI18next = require("react-i18next");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const ActiveStepContext = exports.ActiveStepContext = /*#__PURE__*/(0, _react.createContext)(1);
const defaultFieldConfigs = {};
const t = _utils.default.t;
const Form = _ref => {
  var _stateData$gridSettin;
  let {
    model,
    api,
    permissions = model.modelPermissions || {
      edit: true,
      export: true,
      delete: true
    },
    Layout = _fieldMapper.default
  } = _ref;
  console.log('Form component mounted', {
    model,
    api
  });
  const {
    dispatchData,
    stateData
  } = (0, _StateProvider.useStateContext)();
  const {
    navigate,
    useParams
  } = (0, _StateProvider.useRouter)();
  console.log('useRouter result:', {
    navigate,
    useParams
  });
  const params = useParams ? useParams() : {};
  console.log('params from useParams:', params);
  const {
    id: idWithOptions
  } = params;
  const id = idWithOptions === null || idWithOptions === void 0 ? void 0 : idWithOptions.split('-')[0];
  console.log('Extracted ID:', {
    idWithOptions,
    id
  });
  const [isLoading, setIsLoading] = (0, _react.useState)(true);
  const [data, setData] = (0, _react.useState)(null);
  const [lookups, setLookups] = (0, _react.useState)(null);
  const [isDeleting, setIsDeleting] = (0, _react.useState)(false);
  const snackbar = (0, _SnackBar.useSnackbar)();
  const [validationSchema, setValidationSchema] = (0, _react.useState)(null);
  const [activeStep, setActiveStep] = (0, _react.useState)(0);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = (0, _react.useState)(false);
  const [deleteError, setDeleteError] = (0, _react.useState)(null);
  const [errorMessage, setErrorMessage] = (0, _react.useState)('');
  const {
    t: translate,
    i18n
  } = (0, _reactI18next.useTranslation)();
  const tOpts = {
    t: translate,
    i18n
  };
  const url = stateData === null || stateData === void 0 || (_stateData$gridSettin = stateData.gridSettings) === null || _stateData$gridSettin === void 0 || (_stateData$gridSettin = _stateData$gridSettin.permissions) === null || _stateData$gridSettin === void 0 ? void 0 : _stateData$gridSettin.Url;
  const fieldConfigs = model !== null && model !== void 0 && model.applyFieldConfig ? model === null || model === void 0 ? void 0 : model.applyFieldConfig({
    data,
    lookups
  }) : defaultFieldConfigs;
  let gridApi = "".concat(url).concat(model.api || api);
  const {
    mode
  } = stateData.dataForm;
  const urlId = mode === 'copy' ? idWithOptions === null || idWithOptions === void 0 ? void 0 : idWithOptions.split('-')[1] : id;
  const isValidUrl = _utils.default.isValidIdUrl(urlId);
  const userData = (stateData === null || stateData === void 0 ? void 0 : stateData.getUserData) || {};
  const {
    ClientId = 0
  } = (userData === null || userData === void 0 ? void 0 : userData.tags) || {};
  const isClientSelected = ClientId && ClientId != 0;
  (0, _react.useEffect)(() => {
    setValidationSchema(model === null || model === void 0 ? void 0 : model.getValidationSchema({
      id,
      snackbar,
      t,
      tOpts
    }));
    const options = idWithOptions === null || idWithOptions === void 0 ? void 0 : idWithOptions.split('-');
    try {
      (0, _crudHelper.getRecord)({
        id: options.length > 1 ? options[1] : options[0],
        api: gridApi,
        modelConfig: model,
        setIsLoading,
        setError: errorOnLoad,
        setActiveRecord
      });
    } catch (error) {
      snackbar.showError(t('An error occurred, please try again later', tOpts));
      navigate(model.backURL || './');
    } finally {
      setIsLoading(false);
    }
    return () => {
      _utils.default.removeBackButton(dispatchData);
    };
  }, [id, idWithOptions]);
  (0, _react.useEffect)(() => {
    if (model.overrideBackRouteAndSearch) {
      dispatchData({
        type: _actions.default.SET_PAGE_BACK_BUTTON,
        payload: {
          status: true,
          backRoute: model.backURL
        }
      });
      dispatchData({
        type: _actions.default.PASS_FILTERS_TOHEADER,
        payload: {
          hidden: {
            search: true,
            operation: false,
            export: false,
            print: false,
            filter: true
          }
        }
      });
    }
  }, []);
  const formik = (0, _formik.useFormik)({
    enableReinitialize: true,
    initialValues: _objectSpread(_objectSpread({}, model.initialValues), data),
    validationSchema: validationSchema,
    validateOnBlur: false,
    onSubmit: async (values, _ref2) => {
      let {
        resetForm
      } = _ref2;
      setIsLoading(true);
      // Remove display fields when selectField is specified
      const fieldsToRemove = [];
      model.columns.forEach(col => {
        if (col.selectField && col.field !== col.selectField) {
          fieldsToRemove.push(col.field);
        }
      });
      fieldsToRemove.forEach(field => {
        delete values[field];
      });

      // Remove fields specified in excludeColumnsOnSave
      if (model.excludeColumnsOnSave) {
        model.excludeColumnsOnSave.forEach(field => {
          delete values[field];
        });
      }
      if (model.saveOnlyModifiedValues) {
        var _model$columns$filter;
        const formColumns = (_model$columns$filter = model.columns.filter(ele => ele.showOnForm !== false)) === null || _model$columns$filter === void 0 ? void 0 : _model$columns$filter.map(item => item.field);
        if (!formColumns.includes('ClientId')) {
          formColumns.push("ClientId");
        }
        values = formColumns.reduce((acc, key) => {
          if (key in values) acc[key] = values[key];
          return acc;
        }, {});
      }
      if (model.fieldValidation) {
        values = model.fieldValidation(values); // Apply validation
      }
      (0, _crudHelper.saveRecord)({
        id,
        api: gridApi,
        values,
        setIsLoading,
        setError: snackbar.showError,
        tTranslate: translate,
        tOpts,
        modelConfig: model
      }).then(success => {
        if (success) {
          snackbar.showMessage(t('Record Updated Successfully', tOpts));
          navigate(model.backURL || './');
        }
      }).catch(err => {
        snackbar.showError(t('An error occurred, please try again later', tOpts));
      }).finally(() => setIsLoading(false));
    }
  });
  const {
    dirty
  } = formik;
  const handleDiscardChanges = () => {
    formik.resetForm();
    setIsDiscardDialogOpen(false);
    navigate(model.backURL || '.');
  };
  const warnUnsavedChanges = () => {
    if (dirty) {
      setIsDiscardDialogOpen(true);
    }
  };
  const errorOnLoad = function errorOnLoad(title, error) {
    snackbar.showError(title, error);
    navigate(model.backURL || './');
  };
  const setActiveRecord = function setActiveRecord(_ref3) {
    let {
      id,
      title,
      record,
      lookups
    } = _ref3;
    const isCopy = idWithOptions.indexOf("-") > -1;
    const isNew = !id || id === "0";
    const localTitle = isNew ? "Create" : isCopy ? "Copy" : "Edit";
    const breadCrumbColumn = (model === null || model === void 0 ? void 0 : model.linkColumn) || (model === null || model === void 0 ? void 0 : model.breadCrumbColumn);
    const localValue = isNew ? "" : record[breadCrumbColumn];
    const breadcrumbs = [{
      text: model === null || model === void 0 ? void 0 : model.breadCrumbs
    }, {
      text: localTitle
    }];
    let tempRecord = _objectSpread({}, record);
    if (isCopy) {
      tempRecord[model.linkColumn] += " (Copy)";
    }
    if (model.calculatedColumns) {
      tempRecord = Object.fromEntries(Object.entries(tempRecord).filter(_ref4 => {
        let [key] = _ref4;
        return !model.calculatedColumns.includes(key);
      }));
    }
    if (isNew && !isCopy && userData) {
      var _model$columns;
      (_model$columns = model.columns) === null || _model$columns === void 0 || _model$columns.forEach(column => {
        // Check if field has defaultToClientValue flag
        if (column.defaultToClientValue) {
          var _userData$tags;
          // Use selectField if specified, otherwise use field
          const fieldKey = column.selectField || column.field;
          // Get the value from userData.tags using the fieldKey
          const defaultValue = ((_userData$tags = userData.tags) === null || _userData$tags === void 0 ? void 0 : _userData$tags[fieldKey]) || userData[fieldKey];

          // Only apply default if field is not already set and default value exists
          if (defaultValue !== null && defaultValue !== undefined && !tempRecord[fieldKey]) {
            tempRecord[fieldKey] = defaultValue;
          }
        }
      });
    }
    setData(tempRecord);
    setLookups(lookups);
    if (localValue !== "") {
      breadcrumbs.push({
        text: localValue
      });
    }
    if (!tempRecord.GroupName) {
      tempRecord.GroupName = localValue;
    }
    dispatchData({
      type: _actions.default.PAGE_TITLE_DETAILS,
      payload: {
        showBreadcrumbs: true,
        breadcrumbs: breadcrumbs
      }
    });
  };
  const handleFormCancel = function handleFormCancel(event) {
    if (dirty) {
      warnUnsavedChanges();
      event.preventDefault();
    } else {
      navigate(model.backURL || '.');
    }
  };
  const handleDelete = async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await (0, _crudHelper.deleteRecord)({
        id,
        api: api || (model === null || model === void 0 ? void 0 : model.api),
        setIsLoading,
        setError: snackbar.showError,
        setErrorMessage,
        tTranslate: translate,
        tOpts,
        modelConfig: model
      });
      if (response === true) {
        snackbar.showMessage(t('Record Deleted Successfully', tOpts));
        navigate(model.backURL || './');
      }
    } catch (error) {
      setDeleteError(t('An error occurred, please try again later', tOpts));
    } finally {
      setIsDeleting(false);
    }
  };
  const clearError = () => {
    setErrorMessage(null);
    setIsDeleting(false);
  };
  if (isLoading) {
    return /*#__PURE__*/_react.default.createElement(_Box.default, {
      sx: {
        display: 'flex',
        pt: '20%',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement(_CircularProgress.default, null));
  }
  const handleChange = function handleChange(e) {
    const {
      name,
      value
    } = e.target;
    const gridData = _objectSpread({}, data);
    gridData[name] = value;
    setData(gridData);
  };
  const handleSubmit = function handleSubmit(e) {
    if (e) e.preventDefault();
    const {
      errors
    } = formik;
    if (model.calculatedColumns) {
      formik.values = Object.fromEntries(Object.entries(formik.values).filter(_ref5 => {
        let [key] = _ref5;
        return !model.calculatedColumns.includes(key);
      }));
    }
    if (!isClientSelected) {
      snackbar.showError("Can't save without client. Please select client first", null, "error");
      return;
    }
    formik.handleSubmit();
    const fieldName = Object.keys(errors)[0];
    const errorMessage = errors[fieldName];
    if (errorMessage) {
      snackbar.showError(errorMessage, null, "error");
    }
    const fieldConfig = model.columns.find(column => column.field === fieldName);
    if (fieldConfig && fieldConfig.tab) {
      const tabKeys = Object.keys(model.tabs);
      setActiveStep(tabKeys.indexOf(fieldConfig.tab));
    }
  };
  return isValidUrl ? /*#__PURE__*/_react.default.createElement(ActiveStepContext.Provider, {
    value: {
      activeStep,
      setActiveStep
    }
  }, /*#__PURE__*/_react.default.createElement(_Paper.default, {
    sx: {
      padding: 2
    }
  }, /*#__PURE__*/_react.default.createElement("form", null, /*#__PURE__*/_react.default.createElement(_Stack.default, {
    direction: "row",
    spacing: 2,
    justifyContent: "flex-end",
    mb: 1
  }, permissions.edit && /*#__PURE__*/_react.default.createElement(_Button.default, {
    variant: "contained",
    type: "submit",
    color: "success",
    onClick: handleSubmit
  }, "Save"), /*#__PURE__*/_react.default.createElement(_Button.default, {
    variant: "contained",
    type: "cancel",
    color: "error",
    onClick: handleFormCancel
  }, "Cancel"), permissions.delete && /*#__PURE__*/_react.default.createElement(_Button.default, {
    variant: "contained",
    color: "error",
    onClick: () => setIsDeleting(true)
  }, "Delete")), /*#__PURE__*/_react.default.createElement(Layout, {
    model: model,
    formik: formik,
    data: data,
    fieldConfigs: fieldConfigs,
    onChange: handleChange,
    lookups: lookups,
    id: id,
    handleSubmit: handleSubmit,
    mode: mode
  })), errorMessage && /*#__PURE__*/_react.default.createElement(_Dialog.DialogComponent, {
    open: !!errorMessage,
    onConfirm: clearError,
    onCancel: clearError,
    title: "Info",
    hideCancelButton: true
  }, " ", errorMessage), /*#__PURE__*/_react.default.createElement(_Dialog.DialogComponent, {
    open: isDiscardDialogOpen,
    onConfirm: handleDiscardChanges,
    onCancel: () => setIsDiscardDialogOpen(false),
    title: "Changes not saved",
    okText: "Discard",
    cancelText: "Continue"
  }, "Would you like to continue to edit or discard changes?"), /*#__PURE__*/_react.default.createElement(_Dialog.DialogComponent, {
    open: isDeleting,
    onConfirm: handleDelete,
    onCancel: () => {
      setIsDeleting(false);
      setDeleteError(null);
    },
    title: deleteError ? "Error Deleting Record" : "Confirm Delete"
  }, "Are you sure you want to delete ".concat((data === null || data === void 0 ? void 0 : data.GroupName) || (data === null || data === void 0 ? void 0 : data.SurveyName), "?")))) : /*#__PURE__*/_react.default.createElement("div", null, "Wrong action");
};
var _default = exports.default = Form;