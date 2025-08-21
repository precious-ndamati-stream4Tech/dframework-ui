"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.for-each.js");
require("core-js/modules/esnext.iterator.map.js");
require("core-js/modules/esnext.json.parse.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _Delete = _interopRequireDefault(require("@mui/icons-material/Delete"));
var _Edit = _interopRequireDefault(require("@mui/icons-material/Edit"));
var _Save = _interopRequireDefault(require("@mui/icons-material/Save"));
var _Settings = _interopRequireDefault(require("@mui/icons-material/Settings"));
var _material = require("@mui/material");
var _xDataGridPremium = require("@mui/x-data-grid-premium");
var _formik = require("formik");
var yup = _interopRequireWildcard(require("yup"));
var _SnackBar = require("../SnackBar");
var _reactI18next = require("react-i18next");
var _httpRequest = _interopRequireDefault(require("./httpRequest"));
var _StateProvider = require("../useRouter/StateProvider");
var _actions = _interopRequireDefault(require("../useRouter/actions"));
var _Dialog = require("../Dialog");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const actionTypes = {
  Copy: "Copy",
  Edit: "Edit",
  Delete: "Delete"
};
const formTypes = {
  Add: "Add",
  Edit: "Edit",
  Manage: 'Manage'
};
const gridColumns = [{
  field: "prefName",
  type: 'string',
  width: 300,
  headerName: "Preference Name",
  sortable: false,
  filterable: false
}, {
  field: "prefDesc",
  type: 'string',
  width: 300,
  headerName: "Preference Description",
  sortable: false,
  filterable: false
}, {
  field: "isDefault",
  type: "boolean",
  width: 100,
  headerName: "Default",
  sortable: false,
  filterable: false
}, {
  field: 'editAction',
  type: 'actions',
  headerName: '',
  width: 20,
  getActions: () => [/*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridActionsCellItem, {
    key: 1,
    icon: /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
      title: actionTypes.Edit
    }, "   ", /*#__PURE__*/_react.default.createElement(_Edit.default, null)),
    tabIndex: 1,
    "data-action": actionTypes.Edit,
    label: "Edit",
    color: "primary"
  })]
}, {
  field: 'deleteAction',
  type: 'actions',
  headerName: '',
  width: 20,
  getActions: () => [/*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridActionsCellItem, {
    key: 2,
    icon: /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
      title: actionTypes.Delete
    }, /*#__PURE__*/_react.default.createElement(_Delete.default, null), " "),
    tabIndex: 2,
    "data-action": actionTypes.Delete,
    label: "Delete",
    color: "error"
  })]
}];
const initialValues = {
  prefName: '',
  prefDesc: '',
  isDefault: false
};
const pageSizeOptions = [5, 10, 20, 50, 100];
const GridPreferences = _ref => {
  var _stateData$gridSettin, _stateData$gridSettin2;
  let {
    tTranslate = key => key,
    model,
    gridRef,
    columns = [],
    setIsGridPreferenceFetched,
    initialGridRef
  } = _ref2;
  const {
    preferenceId: preferenceName
  } = model;
  const {
    stateData,
    dispatchData,
    removeCurrentPreferenceName,
    getAllSavedPreferences
  } = (0, _StateProvider.useStateContext)();
  const {
    navigate
  } = (0, _StateProvider.useRouter)();
  const apiRef = (0, _xDataGridPremium.useGridApiRef)();
  const snackbar = (0, _SnackBar.useSnackbar)();
  const {
    t: translate,
    i18n
  } = (0, _reactI18next.useTranslation)();
  const tOpts = {
    t: translate,
    i18n
  };
  const [openDialog, setOpenDialog] = (0, _react.useState)(false);
  const [openForm, setOpenForm] = (0, _react.useState)(false);
  const [filteredPrefs, setFilteredPrefs] = (0, _react.useState)([]);
  const [formType, setFormType] = (0, _react.useState)();
  const [menuAnchorEl, setMenuAnchorEl] = (0, _react.useState)();
  const [openPreferenceExistsModal, setOpenPreferenceExistsModal] = (0, _react.useState)(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = (0, _react.useState)({});
  const {
    Username
  } = stateData !== null && stateData !== void 0 && stateData.getUserData ? stateData.getUserData : {};
  const preferences = stateData === null || stateData === void 0 ? void 0 : stateData.preferences;
  const currentPreference = stateData === null || stateData === void 0 ? void 0 : stateData.currentPreference;
  const preferenceApi = stateData === null || stateData === void 0 || (_stateData$gridSettin = stateData.gridSettings) === null || _stateData$gridSettin === void 0 || (_stateData$gridSettin = _stateData$gridSettin.permissions) === null || _stateData$gridSettin === void 0 ? void 0 : _stateData$gridSettin.preferenceApi; // this is the api endpoint used to fetch, save, edit or delete the preferences, passed via redux form application.
  const defaultPreferenceEnums = stateData === null || stateData === void 0 || (_stateData$gridSettin2 = stateData.gridSettings) === null || _stateData$gridSettin2 === void 0 || (_stateData$gridSettin2 = _stateData$gridSettin2.permissions) === null || _stateData$gridSettin2 === void 0 ? void 0 : _stateData$gridSettin2.defaultPreferenceEnums;
  const filterModel = (0, _xDataGridPremium.useGridSelector)(gridRef, _xDataGridPremium.gridFilterModelSelector);
  const sortModel = (0, _xDataGridPremium.useGridSelector)(gridRef, _xDataGridPremium.gridSortModelSelector);
  const validationSchema = (0, _react.useMemo)(() => {
    const schema = yup.object({
      prefName: yup.string().trim(true).required('Preference Name is Required').max(20, 'Maximum Length is 20'),
      prefDesc: yup.string().max(100, "Description maximum length is 100")
    });
    return schema;
  }, []);
  (0, _react.useEffect)(() => {
    setFilteredPrefs(preferences === null || preferences === void 0 ? void 0 : preferences.filter(pref => pref.prefId !== 0));
  }, [preferences]);
  const formik = (0, _formik.useFormik)({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async values => {
      await savePreference(values);
    },
    mode: "onBlur"
  });
  const handleOpen = event => {
    setMenuAnchorEl(event === null || event === void 0 ? void 0 : event.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchorEl(null);
  };
  const handleDialogClose = () => {
    setFormType();
    handleClose();
    setOpenDialog(false);
  };
  const deletePreference = async (id, prefName) => {
    const params = {
      action: 'delete',
      id: preferenceName,
      Username,
      prefIdArray: id
    };
    const response = await (0, _httpRequest.default)({
      url: preferenceApi,
      params,
      history: navigate,
      dispatchData
    });
    if (response === true || response !== null && response !== void 0 && response.success) {
      if (prefName === currentPreference) {
        removeCurrentPreferenceName({
          dispatchData
        });
      }
      snackbar.showMessage('Preference Deleted Successfully.');
    }
  };
  const applySelectedPreference = async prefId => {
    if (setIsGridPreferenceFetched) {
      setIsGridPreferenceFetched(false);
    }
    await applyPreference(prefId);
  };
  const savePreference = async values => {
    var _filterModel$items;
    const presetName = values.prefName.trim();
    const preferenceAlreadyExists = preferences.findIndex(ele => ele.prefName === presetName);
    // if any default preferences maintain them inside the preferences array.
    if (preferenceAlreadyExists > -1 && (formType === formTypes.Add || preferences[preferenceAlreadyExists].prefId !== values.prefId)) {
      setOpenPreferenceExistsModal(true);
      return;
    }
    const {
      pinnedColumns
    } = gridRef.current.state;
    const {
      orderedFields,
      columnVisibilityModel,
      lookup
    } = gridRef.current.state.columns;
    const gridColumn = [];
    orderedFields === null || orderedFields === void 0 || orderedFields.forEach(ele => {
      const {
        field
      } = lookup[ele];
      const col = columns.find(ele => ele.field === field) || lookup[ele];
      col.width = lookup[ele].width;
      gridColumn.push(col);
    });
    const filter = filterModel === null || filterModel === void 0 || (_filterModel$items = filterModel.items) === null || _filterModel$items === void 0 ? void 0 : _filterModel$items.map(ele => {
      const {
        field,
        operator,
        value
      } = ele;
      return {
        field,
        operator,
        value
      };
    });
    filterModel.items = filter;
    const params = {
      action: 'save',
      id: preferenceName,
      prefName: presetName,
      prefDesc: values.prefDesc,
      prefValue: {
        sortModel,
        filterModel,
        columnVisibilityModel,
        gridColumn,
        pinnedColumns
      },
      isDefault: values.isDefault
    };
    if (values.prefId) {
      params["prefId"] = values.prefId;
    }
    const response = await (0, _httpRequest.default)({
      url: preferenceApi,
      params,
      history: navigate,
      dispatchData
    });
    const action = formType === formTypes.Add ? "Added" : "Saved";
    if (response === true || (response === null || response === void 0 ? void 0 : response.success) === true) {
      snackbar.showMessage("Preference ".concat(action, " Successfully."));
    }
    getAllSavedPreferences({
      preferenceName,
      Username,
      history: navigate,
      dispatchData,
      preferenceApi,
      defaultPreferenceEnums
    });
  };
  const applyPreference = async prefId => {
    let userPreferenceCharts;
    let defaultPreference = 'Default';
    // Check if prefId is 0, if so, use defaultPreferenceEnums, otherwise fetch from API
    if (prefId === 0) {
      userPreferenceCharts = defaultPreferenceEnums[preferenceName] || null;
    } else {
      const params = {
        action: 'load',
        id: preferenceName,
        prefId
      };
      const response = (await (0, _httpRequest.default)({
        url: preferenceApi,
        params,
        history: navigate,
        dispatchData
      })) || {};
      userPreferenceCharts = response.prefValue ? JSON.parse(response.prefValue) : null;
      if (response.prefName) {
        defaultPreference = response.prefName;
      }
    }

    // If userPreferenceCharts is available, apply preferences to the grid
    if (!userPreferenceCharts) return;
    const {
      gridColumn,
      columnVisibilityModel,
      pinnedColumns,
      sortModel,
      filterModel
    } = userPreferenceCharts;
    gridColumn.forEach(_ref2 => {
      let {
        field,
        width
      } = _ref2;
      if (gridRef.current.getColumnIndex(field) !== -1) {
        gridRef.current.setColumnWidth(field, width);
      }
    });
    gridRef.current.setColumnVisibilityModel(columnVisibilityModel);
    gridRef.current.state.columns.orderedFields = gridColumn.map(_ref3 => {
      let {
        field
      } = _ref3;
      return field;
    });
    gridRef.current.setPinnedColumns(pinnedColumns);
    gridRef.current.setSortModel(sortModel || []);
    gridRef.current.setFilterModel(filterModel);
    dispatchData({
      type: _actions.default.SET_CURRENT_PREFERENCE_NAME,
      payload: defaultPreference
    });
    setIsGridPreferenceFetched(true);
  };
  const getGridRowId = row => {
    return row['GridPreferenceId'];
  };
  const openModal = function openModal(params) {
    let openFormModal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    setFormType(params);
    handleClose();
    setOpenDialog(true);
    setOpenForm(openFormModal);
    if (openFormModal) {
      formik.resetForm();
    }
  };
  const confirmDeletePreference = async () => {
    const {
      prefId,
      preferenceName: currentPrefname
    } = openConfirmDeleteDialog;
    await deletePreference(prefId, currentPrefname);
    getAllSavedPreferences({
      preferenceName,
      history: navigate,
      dispatchData,
      Username,
      preferenceApi,
      defaultPreferenceEnums
    });
    setOpenConfirmDeleteDialog({});
  };
  const onCellClick = async cellParams => {
    const action = cellParams.field === 'editAction' ? actionTypes.Edit : cellParams.field === 'deleteAction' ? actionTypes.Delete : null;
    if (cellParams.id === 0 && (action === actionTypes.Edit || action === actionTypes.Delete)) {
      snackbar.showMessage("Default Preference Can Not Be ".concat(action === actionTypes.Edit ? 'Edited' : 'Deleted'));
      return;
    }
    if (action === actionTypes.Edit) {
      setFormType('Modify');
      formik.setValues(cellParams === null || cellParams === void 0 ? void 0 : cellParams.row);
      setOpenForm(true);
    }
    if (action === actionTypes.Delete) {
      setOpenConfirmDeleteDialog({
        prefId: cellParams.id,
        preferenceName: cellParams.row.prefName
      });
    }
  };
  const prefName = formik.values.prefName.trim();
  // represent manage preferences form type.
  const isManageForm = formType === formTypes.Manage;
  return /*#__PURE__*/_react.default.createElement(_material.Box, null, /*#__PURE__*/_react.default.createElement(_material.Button, {
    id: "grid-preferences-btn",
    "aria-controls": menuAnchorEl ? 'basic-menu' : undefined,
    "aria-haspopup": "true",
    "aria-expanded": menuAnchorEl ? 'true' : undefined,
    onClick: handleOpen,
    title: tTranslate('Preference', tOpts),
    startIcon: /*#__PURE__*/_react.default.createElement(_Settings.default, null)
  }, tTranslate('Preferences', tOpts), " ", currentPreference && "(".concat(currentPreference, ")")), /*#__PURE__*/_react.default.createElement(_material.Menu, {
    id: "grid-preference-menu",
    anchorEl: menuAnchorEl,
    open: !!menuAnchorEl,
    onClose: handleClose,
    component: _material.List,
    dense: true,
    MenuListProps: {
      'aria-labelledby': 'grid-preferences-btn'
    },
    sx: {
      '& .MuiMenu-paper': {
        minWidth: 240,
        maxHeight: 320
      },
      '& .MuiListItemSecondaryAction-root': {
        display: 'flex'
      },
      '& .Mui-selected': {
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'success.main'
        }
      }
    }
  }, /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    component: _material.ListItemButton,
    dense: true,
    onClick: () => openModal(formTypes.Add)
  }, tTranslate('Add Preference', tOpts)), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    component: _material.ListItemButton,
    dense: true,
    divider: (preferences === null || preferences === void 0 ? void 0 : preferences.length) > 0,
    onClick: () => openModal(formTypes.Manage, false)
  }, /*#__PURE__*/_react.default.createElement(_material.ListItemIcon, null, /*#__PURE__*/_react.default.createElement(_Settings.default, null)), tTranslate('Manage Preferences', tOpts)), (preferences === null || preferences === void 0 ? void 0 : preferences.length) > 0 && (preferences === null || preferences === void 0 ? void 0 : preferences.map(ele => {
    const {
      prefName,
      prefDesc,
      prefId
    } = ele;
    return /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
      onClick: () => applySelectedPreference(prefId),
      component: _material.ListItem,
      selected: currentPreference === prefName,
      key: "pref-item-".concat(prefId),
      title: tTranslate(prefDesc, tOpts),
      dense: true
    }, /*#__PURE__*/_react.default.createElement(_material.ListItemText, {
      primary: tTranslate(prefName, tOpts)
    }));
  }))), /*#__PURE__*/_react.default.createElement(_Dialog.DialogComponent, {
    open: openDialog,
    disableRestoreFocus: true,
    title: /*#__PURE__*/_react.default.createElement(_material.Stack, {
      direction: "row",
      columnGap: 2
    }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
      variant: "h5"
    }, formType, " ", tTranslate("Preference".concat(formType === formTypes.Manage ? 's' : ''), tOpts))),
    maxWidth: isManageForm ? 'md' : 'sm',
    fullWidth: true
  }, openForm && /*#__PURE__*/_react.default.createElement(_material.Grid, {
    component: 'form',
    onSubmit: formik.handleSubmit,
    rowGap: 2,
    container: true,
    sx: {
      '& .MuiFormLabel-root:not(.MuiTypography-root)': {
        fontWeight: 400,
        display: 'table',
        whiteSpace: 'pre-wrap' /* css-3 */,
        wordWrap: 'break-word' /* Internet Explorer 5.5+ */
      }
    }
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    size: 12
  }, /*#__PURE__*/_react.default.createElement(_material.TextField, {
    defaultValue: tTranslate(formik.values.prefName, tOpts),
    variant: "outlined",
    size: "small",
    margin: "dense",
    label: /*#__PURE__*/_react.default.createElement("span", null, tTranslate('Preference Name', tOpts), " ", /*#__PURE__*/_react.default.createElement("span", {
      style: {
        color: 'red'
      }
    }, "*")),
    autoFocus: true,
    name: 'prefName',
    onChange: formik.handleChange,
    error: !!formik.errors.prefName,
    helperText: formik.errors.prefName,
    fullWidth: true
  })), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    size: 12
  }, /*#__PURE__*/_react.default.createElement(_material.TextField, {
    defaultValue: tTranslate(formik.values.prefDesc, tOpts),
    variant: "outlined",
    multiline: true,
    rows: 2,
    size: "small",
    margin: "dense",
    label: tTranslate('Preference Description', tOpts),
    name: 'prefDesc',
    onChange: formik.handleChange,
    error: !!formik.errors.prefDesc,
    helperText: formik.errors.prefDesc,
    fullWidth: true
  })), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    size: 12
  }, /*#__PURE__*/_react.default.createElement(_material.FormControlLabel, {
    control: /*#__PURE__*/_react.default.createElement(_material.Checkbox, {
      checked: formik.values.isDefault,
      name: 'isDefault',
      onChange: formik.handleChange
    }),
    label: tTranslate('Default', tOpts)
  })), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    size: 12
  }, /*#__PURE__*/_react.default.createElement(_material.Stack, {
    direction: "row",
    columnGap: 1,
    style: {
      justifyContent: 'end'
    }
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    type: "submit",
    size: "small",
    startIcon: /*#__PURE__*/_react.default.createElement(_Save.default, null),
    color: "primary",
    variant: "contained",
    disableElevation: true
  }, tTranslate('Save', tOpts)), /*#__PURE__*/_react.default.createElement(_material.Button, {
    type: "button",
    startIcon: /*#__PURE__*/_react.default.createElement(_Close.default, null),
    color: "error",
    variant: "contained",
    size: "small",
    onClick: handleDialogClose,
    disableElevation: true
  }, tTranslate('Close', tOpts))))), openDialog && formType === formTypes.Manage && /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true,
    rowGap: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    size: 12
  }, /*#__PURE__*/_react.default.createElement(_xDataGridPremium.DataGridPremium, {
    sx: {
      "& .MuiTablePagination-selectLabel": {
        marginTop: 2
      },
      "& .MuiTablePagination-displayedRows": {
        marginTop: 2
      },
      "& .MuiDataGrid-columnHeader .MuiInputLabel-shrink": {
        display: "none"
      }
    },
    className: "pagination-fix",
    onCellClick: onCellClick,
    columns: gridColumns,
    pageSizeOptions: pageSizeOptions,
    pagination: true,
    rowCount: filteredPrefs.length,
    rows: filteredPrefs,
    getRowId: getGridRowId,
    slots: {
      headerFilterMenu: false
    },
    density: "compact",
    disableDensitySelector: true,
    apiRef: apiRef,
    disableAggregation: true,
    disableRowGrouping: true,
    disableRowSelectionOnClick: true,
    autoHeight: true
  })), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    size: 12
  }, /*#__PURE__*/_react.default.createElement(_material.Stack, {
    direction: "row",
    columnGap: 1,
    style: {
      justifyContent: 'end'
    }
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    type: "button",
    startIcon: /*#__PURE__*/_react.default.createElement(_Close.default, null),
    color: "error",
    variant: "contained",
    size: "small",
    onClick: handleDialogClose,
    disableElevation: true
  }, tTranslate('Close', tOpts)))))), /*#__PURE__*/_react.default.createElement(_Dialog.DialogComponent, {
    open: openPreferenceExistsModal,
    onConfirm: () => setOpenPreferenceExistsModal(false),
    title: "",
    okText: tTranslate('Ok', tOpts),
    cancelText: ""
  }, "\"", prefName, "\" ", tTranslate('name already in use, please use another name.', tOpts)), /*#__PURE__*/_react.default.createElement(_Dialog.DialogComponent, {
    open: openConfirmDeleteDialog.preferenceName,
    onConfirm: confirmDeletePreference,
    onCancel: () => setOpenConfirmDeleteDialog({}),
    title: "Confirm delete",
    yesNo: true
  }, "Are you sure you wish to delete \"", openConfirmDeleteDialog.preferenceName, "\""));
};
var _default = exports.default = GridPreferences;