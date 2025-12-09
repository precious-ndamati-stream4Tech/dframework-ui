"use strict";

require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.string.includes.js");
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
var _constants = _interopRequireDefault(require("../constants"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // import { useRouter } from '../useRouter/useRouter';
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

/**
 * Checks if a preference has a valid name for display
 * @param {Object} pref - The preference object to validate
 * @returns {boolean} True if the preference has a valid name, false otherwise
 */
const hasValidPreferenceName = pref => {
  return pref.prefName && pref.prefName.trim() !== '';
};

/**
 * Checks if a preference is valid for the management grid (excludes invalid names and CoolR Default)
 * @param {Object} pref - The preference object to validate
 * @returns {boolean} True if the preference should be displayed in management grid, false otherwise
 */
const isValidForManagement = pref => {
  var _pref$prefName;
  // Exclude default preference (prefId === 0) and "CoolR Default" preference
  if (pref.prefId === 0 || pref.prefId === _constants.default.defaultPreferenceId) {
    return false;
  }
  const prefNameLower = (_pref$prefName = pref.prefName) === null || _pref$prefName === void 0 ? void 0 : _pref$prefName.toLowerCase().trim();
  if (prefNameLower === 'coolr default') {
    return false;
  }
  return hasValidPreferenceName(pref);
};

/**
 * Creates validation schema for preference form
 * @param {Function} t - Translation function
 * @param {Object} tOpts - Translation options
 * @returns {Object} Yup validation schema
 */
const createValidationSchema = (t, tOpts) => {
  return yup.object({
    prefName: yup.string().required(t('Preference Name is Required', tOpts)).test('not-only-whitespace', t('Preference Name cannot contain only whitespace', tOpts), value => value && value.trim().length > 0).max(20, t('Maximum Length is 20', tOpts)),
    prefDesc: yup.string().max(100, t('Description maximum length is 100', tOpts))
  });
};
const initialValues = {
  prefName: '',
  prefDesc: '',
  isDefault: false
};
let coolrDefaultPreference = 'CoolR Default';
const getGridColumnsFromRef = _ref => {
  let {
    refColumns,
    columns
  } = _ref;
  const {
    orderedFields,
    columnVisibilityModel,
    lookup
  } = refColumns;
  const gridColumn = [];
  orderedFields === null || orderedFields === void 0 || orderedFields.forEach(ele => {
    const {
      field
    } = lookup[ele];
    let col = (columns === null || columns === void 0 ? void 0 : columns.find(ele => ele.field === field)) || lookup[ele];
    col = _objectSpread(_objectSpread({}, col), {}, {
      width: lookup[ele].width
    });
    gridColumn.push(col);
  });
  return {
    gridColumn,
    columnVisibilityModel
  };
};
const GridPreferences = _ref2 => {
  var _stateData$preference, _stateData$gridSettin, _formik$values$prefNa;
  let {
    tTranslate = key => key,
    model,
    gridRef,
    columns = [],
    setIsGridPreferenceFetched,
    setIsLoading,
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
  const [formType, setFormType] = (0, _react.useState)();
  const [menuAnchorEl, setMenuAnchorEl] = (0, _react.useState)();
  const [openPreferenceExistsModal, setOpenPreferenceExistsModal] = (0, _react.useState)(false);
  const {
    Username
  } = stateData !== null && stateData !== void 0 && stateData.getUserData ? stateData.getUserData : {};
  const preferences = (stateData === null || stateData === void 0 || (_stateData$preference = stateData.preferences) === null || _stateData$preference === void 0 ? void 0 : _stateData$preference.filter(isValidForManagement)) || [];
  const currentPreference = stateData === null || stateData === void 0 ? void 0 : stateData.currentPreference;
  const preferenceApi = stateData === null || stateData === void 0 || (_stateData$gridSettin = stateData.gridSettings) === null || _stateData$gridSettin === void 0 || (_stateData$gridSettin = _stateData$gridSettin.permissions) === null || _stateData$gridSettin === void 0 ? void 0 : _stateData$gridSettin.preferenceApi;
  const filterModel = (0, _xDataGridPremium.useGridSelector)(gridRef, _xDataGridPremium.gridFilterModelSelector);
  const sortModel = (0, _xDataGridPremium.useGridSelector)(gridRef, _xDataGridPremium.gridSortModelSelector);
  const validationSchema = (0, _react.useMemo)(() => {
    return createValidationSchema(tTranslate, tOpts);
  }, [tTranslate, tOpts]);

  // Dynamically generate columns for the preferences grid
  const gridColumns = (0, _react.useMemo)(() => {
    const baseColumns = [{
      field: 'prefName',
      headerName: tTranslate('Preference Name', tOpts),
      flex: 1
    }, {
      field: 'prefDesc',
      headerName: tTranslate('Preference Description', tOpts),
      flex: 1
    }, {
      field: 'isDefault',
      headerName: tTranslate('Default', tOpts),
      width: 100,
      type: 'boolean'
    }];

    // Only add action columns if there are valid preferences to manage
    if (preferences && preferences.length > 0) {
      baseColumns.push({
        field: 'editAction',
        headerName: '',
        width: 50,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: params => /*#__PURE__*/_react.default.createElement(_material.IconButton, {
          size: "small",
          onClick: () => handleEditClick(params)
        }, /*#__PURE__*/_react.default.createElement(_Edit.default, {
          fontSize: "small"
        }))
      }, {
        field: 'deleteAction',
        headerName: '',
        width: 50,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: params => /*#__PURE__*/_react.default.createElement(_material.IconButton, {
          size: "small",
          onClick: () => handleDeleteClick(params)
        }, /*#__PURE__*/_react.default.createElement(_Delete.default, {
          fontSize: "small"
        }))
      });
    }
    return baseColumns;
  }, [preferences, tTranslate, tOpts]);
  const formik = (0, _formik.useFormik)({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async values => {
      await savePreference(values);
    }
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
    let params = {
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
    if (response === true) {
      if (prefName === currentPreference) {
        removeCurrentPreferenceName({
          dispatchData
        });
      }
      snackbar.showMessage('Preference Deleted Successfully.');
      handleDialogClose();
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
    const preferenceAlreadyExists = preferences.findIndex(ele => {
      // When editing, exclude the current preference from duplicate check
      const isDifferentPreference = formType === formTypes.Edit ? ele.prefId !== values.prefId : true;
      return isDifferentPreference && ele.prefName.toLocaleLowerCase() === presetName.toLocaleLowerCase();
    });
    if (preferenceAlreadyExists > -1) {
      setOpenPreferenceExistsModal(true);
      return;
    }
    const {
      pinnedColumns
    } = gridRef.current.state;
    const {
      gridColumn,
      columnVisibilityModel
    } = getGridColumnsFromRef({
      refColumns: gridRef.current.state.columns,
      columns
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
    let params = {
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
    if (response === true) {
      snackbar.showMessage('Preference Saved Successfully.');
      handleDialogClose();
    }
    getAllSavedPreferences({
      preferenceName,
      Username,
      history: navigate,
      dispatchData,
      preferenceApi
    });
  };
  const applyPreference = async prefId => {
    if (setIsLoading) setIsLoading(true);
    let userPreferenceCharts;
    let currentPreferenceName = '';
    if (prefId > 0) {
      // If valid preference is selected, then fetch it's details
      const params = {
        action: 'load',
        id: preferenceName,
        prefId
      };
      const response = await (0, _httpRequest.default)({
        url: preferenceApi,
        params,
        history: navigate,
        dispatchData,
        disableLoader: true
      });
      userPreferenceCharts = response !== null && response !== void 0 && response.prefValue ? JSON.parse(response.prefValue) : null;
      if (response.prefValue) {
        currentPreferenceName = response.prefName;
      }
    } else {
      // If default preference is selected, then reset to the initial state
      // Use the deep-copied initial state from initialGridRef
      if (!initialGridRef.current) {
        console.error('Initial grid state not captured. Cannot reset to default.');
        if (setIsLoading) setIsLoading(false);
        return;
      }
      const initialState = initialGridRef.current;
      // Keep currentPreferenceName as empty string for default - no preference name should be displayed

      // Reconstruct gridColumn from initial state
      const gridColumn = initialState.columns.orderedFields.map(field => {
        const colData = initialState.columns.lookup[field];
        return {
          field: field,
          width: colData === null || colData === void 0 ? void 0 : colData.width,
          flex: colData === null || colData === void 0 ? void 0 : colData.flex
        };
      });
      userPreferenceCharts = {
        gridColumn: gridColumn,
        columnVisibilityModel: _objectSpread({}, initialState.columns.columnVisibilityModel),
        pinnedColumns: {
          left: [...initialState.pinnedColumns.left],
          right: [...initialState.pinnedColumns.right]
        },
        sortModel: [...initialState.sorting.sortModel],
        filterModel: {
          items: [...initialState.filter.filterModel.items],
          linkOperator: initialState.filter.filterModel.linkOperator
        }
      };
    }
    if (userPreferenceCharts) {
      const {
        gridColumn,
        columnVisibilityModel,
        pinnedColumns,
        sortModel,
        filterModel
      } = userPreferenceCharts;
      if (gridRef.current) {
        const gridColumns = gridColumn || gridRef.current.getAllColumns();
        const columnFields = gridColumns.map(column => column.field);

        // Apply column widths
        if (prefId === _constants.default.defaultPreferenceId) {
          // Reset to initial widths from the captured initial state
          gridColumns.forEach(col => {
            var _initialGridRef$curre;
            const initialColData = (_initialGridRef$curre = initialGridRef.current) === null || _initialGridRef$curre === void 0 || (_initialGridRef$curre = _initialGridRef$curre.columns) === null || _initialGridRef$curre === void 0 || (_initialGridRef$curre = _initialGridRef$curre.lookup) === null || _initialGridRef$curre === void 0 ? void 0 : _initialGridRef$curre[col.field];
            if (initialColData && initialColData.width) {
              gridRef.current.setColumnWidth(col.field, initialColData.width);
            }
          });
        } else {
          // Apply saved widths for custom preferences
          gridColumn.forEach(_ref3 => {
            let {
              field,
              width
            } = _ref3;
            if (columnFields.includes(field)) {
              const columnIndex = gridColumns.findIndex(column => column.field === field);
              if (columnIndex !== -1 && width) {
                gridRef.current.setColumnWidth(field, width);
              }
            }
          });
        }

        // Apply all preference settings to the grid
        const orderedFields = gridColumn.map(_ref4 => {
          let {
            field
          } = _ref4;
          return field;
        }).filter(field => columnFields.includes(field));
        gridRef.current.state.columns.orderedFields = orderedFields;
        gridRef.current.setColumnVisibilityModel(columnVisibilityModel);
        gridRef.current.setPinnedColumns(pinnedColumns);
        gridRef.current.setSortModel(sortModel || []);
        gridRef.current.setFilterModel(filterModel);
      }
      dispatchData({
        type: _actions.default.SET_CURRENT_PREFERENCE_NAME,
        payload: {
          model: preferenceName,
          currentPreference: currentPreferenceName
        }
      });
      setIsGridPreferenceFetched(true);
    }
    if (setIsLoading) setIsLoading(false);
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
  const closeModal = () => {
    setFormType(null);
    handleClose();
    setOpenDialog(false);
  };
  const handleResetPreferences = async () => {
    // Clear current preference for this model from state
    removeCurrentPreferenceName({
      dispatchData,
      model: preferenceName
    });
    // Apply default preference (this will reset all grid state)
    await applyPreference(_constants.default.defaultPreferenceId);
  };
  const handleEditClick = params => {
    if (params.id === 0) {
      snackbar.showMessage(tTranslate('Default Preference Can Not Be Edited', tOpts));
      return;
    }
    setFormType(formTypes.Edit);
    formik.setValues(params.row);
    setOpenForm(true);
  };
  const handleDeleteClick = async params => {
    var _params$row;
    if (params.id === 0) {
      snackbar.showMessage(tTranslate('Default Preference Can Not Be Deleted', tOpts));
      return;
    }
    await deletePreference(params.id, (_params$row = params.row) === null || _params$row === void 0 ? void 0 : _params$row.prefName);
    getAllSavedPreferences({
      preferenceName,
      Username,
      history: navigate,
      dispatchData,
      preferenceApi
    });
  };
  const onCellClick = async (cellParams, event, details) => {
    const action = cellParams.field;
    if (action === 'editAction') {
      handleEditClick(cellParams);
    } else if (action === 'deleteAction') {
      await handleDeleteClick(cellParams);
    }
  };
  return /*#__PURE__*/_react.default.createElement(_material.Box, null, /*#__PURE__*/_react.default.createElement(_material.Button, {
    id: "grid-preferences-btn",
    "aria-controls": menuAnchorEl ? 'basic-menu' : undefined,
    "aria-haspopup": "true",
    "aria-expanded": menuAnchorEl ? 'true' : undefined,
    onClick: handleOpen,
    title: tTranslate('Preference', tOpts),
    startIcon: /*#__PURE__*/_react.default.createElement(_Settings.default, null)
  }, tTranslate('Preferences', tOpts)), /*#__PURE__*/_react.default.createElement(_material.Menu, {
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
    onClick: () => openModal(formTypes.Manage, false)
  }, tTranslate('Manage Preferences', tOpts)), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    component: _material.ListItemButton,
    dense: true,
    divider: (preferences === null || preferences === void 0 ? void 0 : preferences.length) > 0,
    onClick: handleResetPreferences
  }, tTranslate('Reset Preferences', tOpts)), preferences === null || preferences === void 0 ? void 0 : preferences.filter(hasValidPreferenceName).map((ele, key) => {
    const {
      prefName,
      prefDesc,
      prefId
    } = ele;
    return /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
      onClick: () => applySelectedPreference(prefId, key),
      component: _material.ListItem,
      key: "pref-item-".concat(key),
      title: tTranslate(prefDesc, tOpts),
      dense: true
    }, /*#__PURE__*/_react.default.createElement(_material.ListItemText, {
      primary: tTranslate(prefName, tOpts)
    }));
  })), /*#__PURE__*/_react.default.createElement(_material.Dialog, {
    open: openDialog,
    maxWidth: formType === formTypes.Manage ? 'md' : 'sm',
    fullWidth: true
  }, /*#__PURE__*/_react.default.createElement(_material.DialogTitle, {
    sx: {
      backgroundColor: '#e0e0e0',
      mb: 2
    }
  }, /*#__PURE__*/_react.default.createElement(_material.Stack, {
    direction: "row",
    columnGap: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    variant: "h5"
  }, formType, " ", tTranslate('Preference', tOpts)))), /*#__PURE__*/_react.default.createElement(_material.DialogContent, null, openForm && /*#__PURE__*/_react.default.createElement(_material.Grid, {
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
    item: true,
    xs: 12
  }, /*#__PURE__*/_react.default.createElement(_material.TextField, {
    defaultValue: tTranslate(formik.values.prefName, tOpts),
    variant: "outlined",
    size: "small",
    margin: "dense",
    label: tTranslate('Preference Name', tOpts),
    name: 'prefName',
    onChange: formik.handleChange,
    error: !!formik.errors.prefName,
    helperText: formik.errors.prefName,
    required: true,
    fullWidth: true
  })), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: 12
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
    item: true,
    xs: 12
  }, /*#__PURE__*/_react.default.createElement(_material.FormControlLabel, {
    control: /*#__PURE__*/_react.default.createElement(_material.Checkbox, {
      checked: formik.values.isDefault,
      name: 'isDefault',
      onChange: formik.handleChange
    }),
    label: tTranslate('Default', tOpts)
  })), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: 12
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
    container: true
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: 12
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
    pageSizeOptions: _constants.default.pageSizeOptions,
    pagination: true,
    rowCount: preferences.length,
    rows: preferences,
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
    autoHeight: true,
    initialState: {
      pagination: {
        paginationModel: {
          pageSize: 10
        }
      }
    },
    localeText: {
      toolbarColumnsLabel: tTranslate('Select columns', tOpts),
      toolbarExportLabel: tTranslate('Export', tOpts),
      booleanCellFalseLabel: tTranslate('No', tOpts),
      paginationRowsPerPage: tTranslate('Rows per page', tOpts),
      paginationDisplayedRows: _ref5 => {
        let {
          from,
          to,
          count
        } = _ref5;
        return "".concat(from, "\u2013").concat(to, " ").concat(tTranslate('of', tOpts), " ").concat(count);
      },
      toolbarQuickFilterLabel: tTranslate('Search', tOpts),
      columnsManagementSearchTitle: tTranslate('Search', tOpts)
    }
  })))), formType === formTypes.Manage && /*#__PURE__*/_react.default.createElement(_material.DialogActions, null, /*#__PURE__*/_react.default.createElement(_material.Button, {
    color: "error",
    variant: "contained",
    size: "small",
    onClick: () => closeModal(),
    disableElevation: true
  }, tTranslate('Close', tOpts)))), /*#__PURE__*/_react.default.createElement(_material.Dialog, {
    open: openPreferenceExistsModal,
    maxWidth: "xs",
    fullWidth: true
  }, /*#__PURE__*/_react.default.createElement(_material.DialogContent, {
    sx: {
      fontSize: '16px'
    }
  }, "\"", (_formik$values$prefNa = formik.values.prefName) === null || _formik$values$prefNa === void 0 ? void 0 : _formik$values$prefNa.trim(), "\" ", tTranslate('name already in use, please use another name.', tOpts)), /*#__PURE__*/_react.default.createElement(_material.DialogActions, {
    sx: {
      justifyContent: 'center',
      marginTop: '4%'
    }
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    color: "success",
    variant: "contained",
    size: "small",
    onClick: () => setOpenPreferenceExistsModal(false),
    disableElevation: true
  }, tTranslate('Ok', tOpts)))));
};
var _default = exports.default = GridPreferences;