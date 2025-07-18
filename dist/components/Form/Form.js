"use strict";

require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/esnext.iterator.filter.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ActiveStepContext = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.promise.finally.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.string.search.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.for-each.js");
require("core-js/modules/esnext.json.parse.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url-search-params.js");
require("core-js/modules/web.url-search-params.delete.js");
require("core-js/modules/web.url-search-params.has.js");
require("core-js/modules/web.url-search-params.size.js");
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
var _StateProvider = require("../useRouter/StateProvider");
var _actions = _interopRequireDefault(require("../useRouter/actions"));
var _PageTitle = _interopRequireDefault(require("../PageTitle"));
var _utils = _interopRequireWildcard(require("../utils"));
var _relations = _interopRequireDefault(require("./relations"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const ActiveStepContext = exports.ActiveStepContext = /*#__PURE__*/(0, _react.createContext)(1);
const defaultFieldConfigs = {};
const consts = {
  object: "object",
  function: "function",
  baseData: "baseData",
  string: "string",
  create: "Create",
  copy: "Copy",
  edit: "Edit",
  number: "number"
};
const Form = _ref => {
  var _stateData$gridSettin;
  let {
    model,
    api,
    models,
    relationFilters = {},
    permissions = {},
    Layout = _fieldMapper.default,
    baseSaveData = {},
    sx,
    readOnly,
    beforeSubmit,
    deletePromptText
  } = _ref;
  const formTitle = model.formTitle || model.title;
  const {
    navigate,
    getParams,
    useParams,
    pathname
  } = (0, _StateProvider.useRouter)();
  const {
    relations = []
  } = model;
  const {
    dispatchData,
    stateData
  } = (0, _StateProvider.useStateContext)();
  const params = useParams() || getParams;
  const {
    id: idWithOptions = ""
  } = params;
  const id = idWithOptions.split("-")[0];
  const searchParams = new URLSearchParams(window.location.search);
  const baseDataFromParams = searchParams.has(consts.baseData) && searchParams.get(consts.baseData);
  if (baseDataFromParams) {
    const parsedData = JSON.parse(baseDataFromParams);
    if (typeof parsedData === consts.object && parsedData !== null) {
      baseSaveData = _objectSpread(_objectSpread({}, baseSaveData), parsedData);
    }
  }
  const [isLoading, setIsLoading] = (0, _react.useState)(true);
  const [data, setData] = (0, _react.useState)({});
  const [lookups, setLookups] = (0, _react.useState)(null);
  const [isDeleting, setIsDeleting] = (0, _react.useState)(false);
  const snackbar = (0, _SnackBar.useSnackbar)();
  const [validationSchema, setValidationSchema] = (0, _react.useState)(null);
  const [activeStep, setActiveStep] = (0, _react.useState)(0);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = (0, _react.useState)(false);
  const [deleteError, setDeleteError] = (0, _react.useState)(null);
  const [errorMessage, setErrorMessage] = (0, _react.useState)("");
  const url = (stateData === null || stateData === void 0 || (_stateData$gridSettin = stateData.gridSettings) === null || _stateData$gridSettin === void 0 || (_stateData$gridSettin = _stateData$gridSettin.permissions) === null || _stateData$gridSettin === void 0 ? void 0 : _stateData$gridSettin.Url) || '';
  const fieldConfigs = typeof model.applyFieldConfig === consts.function ? model.applyFieldConfig({
    data,
    lookups
  }) : defaultFieldConfigs;
  const gridApi = (0, _react.useMemo)(() => "".concat(url).concat(model.api || api || ''), [url, model.api, api]);
  const {
    mode
  } = stateData.dataForm;
  const userData = stateData.getUserData || {};
  const userDefinedPermissions = _objectSpread(_objectSpread({
    add: true,
    edit: true,
    delete: true
  }, model.permissions), permissions);
  const {
    canEdit
  } = (0, _utils.getPermissions)({
    userData,
    model,
    userDefinedPermissions
  });
  const {
    hideBreadcrumb = false,
    navigateBack
  } = model;
  const handleNavigation = () => {
    let navigatePath;
    switch (typeof navigateBack) {
      case consts.function:
        navigatePath = navigateBack({
          params,
          searchParams,
          data
        });
        break;
      case consts.number:
      case consts.string:
        navigatePath = navigateBack;
        break;
      default:
        navigatePath = pathname.substring(0, pathname.lastIndexOf("/"));
        break;
    }
    navigate(navigatePath);
  };
  const isNew = (0, _react.useMemo)(() => _utils.default.emptyIdValues.includes(id), [id]);
  const initialValues = (0, _react.useMemo)(() => isNew ? _objectSpread(_objectSpread(_objectSpread({}, model.initialValues), data), baseSaveData) : _objectSpread(_objectSpread(_objectSpread({}, baseSaveData), model.initialValues), data), [model.initialValues, data, id]);
  (0, _react.useEffect)(() => {
    if (!url) return;
    setValidationSchema(model.getValidationSchema({
      id,
      snackbar
    }));
    const options = idWithOptions.split("-");
    const params = {
      api: api || gridApi,
      model,
      setError: errorOnLoad
    };
    (0, _crudHelper.getRecord)(_objectSpread(_objectSpread({}, params), {}, {
      id: options.length > 1 ? options[1] : options[0],
      setIsLoading,
      setActiveRecord
    }));
  }, [id, idWithOptions, model, url]);
  const formik = (0, _formik.useFormik)({
    enableReinitialize: true,
    initialValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    onSubmit: async (values, _ref2) => {
      let {
        resetForm
      } = _ref2;
      Object.keys(values).forEach(key => {
        if (typeof values[key] === consts.string) {
          values[key] = values[key].trim();
        }
      });
      setIsLoading(true);
      (0, _crudHelper.saveRecord)({
        id,
        api: gridApi,
        values: values,
        setIsLoading,
        setError: snackbar.showError
      }).then(success => {
        if (!success) return;
        if (model.reloadOnSave) {
          return window.location.reload();
        }
        const message = success.info ? success.info : "Record ".concat(id === 0 ? "Added" : "Updated", " Successfully.");
        snackbar.showMessage(message);
        /**
        * Handle navigation after form operations
        * By default, the form navigates back to the grid after save/cancel operations.
        * This behavior can be controlled by setting navigateBack "false" / false in model config which disables navigation completely.
        */
        navigateBack !== false && handleNavigation();
      }).catch(err => {
        snackbar.showError("An error occured.", err);
        if (model.reloadOnSave) {
          resetForm();
        }
      }).finally(() => setIsLoading(false));
    }
  });
  const {
    dirty
  } = formik;
  const handleDiscardChanges = () => {
    formik.resetForm();
    setIsDiscardDialogOpen(false);
    handleNavigation();
  };
  const errorOnLoad = function errorOnLoad(title, error) {
    snackbar.showError(title, error);
    handleNavigation();
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
    const pageTitle = isNew ? consts.create : isCopy ? consts.copy : consts.edit;
    const linkColumn = isNew ? "" : record[model.linkColumn];
    const breadcrumbs = [{
      text: model.breadCrumbs
    }, {
      text: pageTitle
    }];
    if (isCopy) {
      record[model.linkColumn] = "";
    }
    model.columns.forEach(item => {
      if (item.skipCopy && isCopy) {
        record[item.field] = "";
      }
    });
    setData(record);
    setLookups(lookups);
    if (linkColumn !== "") {
      breadcrumbs.push({
        text: linkColumn
      });
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
      setIsDiscardDialogOpen(true);
    } else {
      handleNavigation();
    }
    event.preventDefault();
  };
  const handleDelete = async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await (0, _crudHelper.deleteRecord)({
        id,
        api: api || model.api,
        setIsLoading,
        setError: snackbar.showError,
        setErrorMessage
      });
      if (response === true) {
        snackbar.showMessage("Record Deleted Successfully.");
        handleNavigation();
      }
    } catch (error) {
      snackbar.showError("An error occured, please try after some time.");
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
        display: "flex",
        pt: "20%",
        justifyContent: "center"
      }
    }, /*#__PURE__*/_react.default.createElement(_CircularProgress.default, null));
  }
  const handleChange = function handleChange(e) {
    const {
      name,
      value
    } = e.target;
    setData(_objectSpread(_objectSpread({}, data), {}, {
      [name]: value
    }));
  };
  const handleSubmit = async function handleSubmit(e) {
    if (e) e.preventDefault();
    if (typeof beforeSubmit === consts.function) {
      await beforeSubmit({
        formik
      });
    }
    const {
      errors
    } = formik;
    formik.handleSubmit();
    const fieldName = Object.keys(errors)[0];
    const errorMessage = errors[fieldName];
    if (errorMessage) {
      snackbar.showError(errorMessage, null, "error");
    }
    const fieldConfig = model.columns.find(column => column.field === fieldName) || {};
    if (fieldConfig.tab) {
      setActiveStep(Object.keys(model.tabs).indexOf(fieldConfig.tab));
    }
  };
  const breadcrumbs = [{
    text: formTitle
  }, {
    text: id === "0" ? "New" : "Update"
  }];
  const showRelations = Number(id) !== 0 && Boolean(relations.length);
  const showSaveButton = searchParams.has("showRelation");
  const recordEditable = !("canEdit" in data) || data.canEdit;
  const readOnlyRelations = !recordEditable || data.readOnlyRelations;
  deletePromptText = deletePromptText || "Are you sure you want to delete ?";
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_PageTitle.default, {
    navigate: navigate,
    title: formTitle,
    showBreadcrumbs: !hideBreadcrumb,
    breadcrumbs: breadcrumbs,
    model: model
  }), /*#__PURE__*/_react.default.createElement(ActiveStepContext.Provider, {
    value: {
      activeStep,
      setActiveStep
    }
  }, /*#__PURE__*/_react.default.createElement(_Paper.default, {
    sx: _objectSpread({
      padding: 2
    }, sx)
  }, /*#__PURE__*/_react.default.createElement("form", null, /*#__PURE__*/_react.default.createElement(_Stack.default, {
    direction: "row",
    spacing: 2,
    justifyContent: "flex-end",
    mb: 1
  }, canEdit && recordEditable && !showSaveButton && !readOnly && /*#__PURE__*/_react.default.createElement(_Button.default, {
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
  }, deletePromptText), showRelations ? /*#__PURE__*/_react.default.createElement(_relations.default, {
    readOnly: readOnlyRelations,
    models: models,
    relationFilters: relationFilters,
    relations: relations,
    parent: model.name || model.title || ""
  }) : null)));
};
var _default = exports.default = Form;