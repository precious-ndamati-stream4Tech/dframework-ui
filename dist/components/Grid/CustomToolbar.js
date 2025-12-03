"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
var _react = _interopRequireDefault(require("react"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _xDataGridPremium = require("@mui/x-data-grid-premium");
var _Add = _interopRequireDefault(require("@mui/icons-material/Add"));
var _Remove = _interopRequireDefault(require("@mui/icons-material/Remove"));
var _FilterListOff = _interopRequireDefault(require("@mui/icons-material/FilterListOff"));
var _GridPreference = _interopRequireDefault(require("../GridPreference"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// CustomToolbar component - defined outside GridBase to prevent remounting
const CustomToolbar = function CustomToolbar(props) {
  const {
    model,
    customHeaderComponent,
    currentPreference,
    isReadOnly,
    modelPermissions,
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
    CustomExportButton
  } = props;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "grid-header-alignment"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "grid-toolbar-heading"
  }, model.hasCustomHeaderComponent && customHeaderComponent, model.gridSubTitle && /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    component: "h3",
    textAlign: "center",
    sx: {
      ml: 1
    }
  }, " ", t(model.gridSubTitle, tOpts)), (currentPreference === null || currentPreference === void 0 ? void 0 : currentPreference[model.preferenceId]) && model.preferenceId && /*#__PURE__*/_react.default.createElement(_Typography.default, {
    className: "preference-name-text",
    variant: "h6",
    component: "h6",
    textAlign: "center",
    sx: {
      ml: 1
    }
  }, " ", t(currentPreference === null || currentPreference === void 0 ? void 0 : currentPreference[model.preferenceId], tOpts)), (isReadOnly || !modelPermissions.add && !forAssignment && !model.hideSubTitle) && /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    component: "h3",
    textAlign: "center",
    sx: {
      ml: 1
    }
  }, " ", isReadOnly ? "" : t(model.title, tOpts)), !forAssignment && modelPermissions.add && !isReadOnly && !showCreateButton && /*#__PURE__*/_react.default.createElement(_Button.default, {
    startIcon: showAddIcon ? /*#__PURE__*/_react.default.createElement(_Add.default, null) : null,
    onClick: onAdd,
    size: "medium",
    variant: "contained",
    className: classes.buttons
  }, model !== null && model !== void 0 && model.customAddTextTitle ? t(model.customAddTextTitle, tOpts) : " ".concat(showAddIcon ? "".concat(t("Add", tOpts)) : "", " ").concat(t(model.title, tOpts))), available && /*#__PURE__*/_react.default.createElement(_Button.default, {
    startIcon: !showAddIcon ? null : /*#__PURE__*/_react.default.createElement(_Add.default, null),
    onClick: onAssign,
    size: "medium",
    variant: "contained",
    className: classes.buttons
  }, t("Assign", tOpts)), assigned && !(model !== null && model !== void 0 && model.childTabs || model !== null && model !== void 0 && model.isChildGrid) && /*#__PURE__*/_react.default.createElement(_Button.default, {
    startIcon: !showAddIcon ? null : /*#__PURE__*/_react.default.createElement(_Remove.default, null),
    onClick: onUnassign,
    size: "medium",
    variant: "contained",
    className: classes.buttons
  }, t("Remove", tOpts))), /*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridToolbarContainer, null, /*#__PURE__*/_react.default.createElement(_Box.default, {
    sx: {
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
      alignItems: 'center',
      width: '100%'
    }
  }, modelPermissions.columns && /*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridToolbarColumnsButton, null), modelPermissions.filter && /*#__PURE__*/_react.default.createElement(_xDataGridPremium.GridToolbarFilterButton, null), modelPermissions.filter && /*#__PURE__*/_react.default.createElement(_Button.default, {
    startIcon: /*#__PURE__*/_react.default.createElement(_FilterListOff.default, null),
    onClick: clearFilters,
    size: "small",
    sx: {
      width: 'max-content'
    }
  }, t("CLEAR FILTER", tOpts)), modelPermissions.export && /*#__PURE__*/_react.default.createElement(CustomExportButton, {
    onExportMenuClick: onExportMenuClick,
    handleExport: handleExport,
    showInFieldStatusPivotExportBtn: model === null || model === void 0 ? void 0 : model.showInFieldStatusPivotExportBtn,
    showInstallationPivotExportBtn: model === null || model === void 0 ? void 0 : model.showInstallationPivotExportBtn,
    showPivotExportBtn: model === null || model === void 0 ? void 0 : model.showPivotExportBtn,
    showOnlyExcelExport: model.showOnlyExcelExport,
    showExportWithDetails: model === null || model === void 0 ? void 0 : model.showExportWithDetails,
    hideExcelExport: hideExcelExport,
    hideXmlExport: hideXmlExport,
    hideHtmlExport: hideHtmlExport,
    hideJsonExport: hideJsonExport,
    showExportWithLatestData: model === null || model === void 0 ? void 0 : model.showExportWithLatestData,
    detailExportLabel: model === null || model === void 0 ? void 0 : model.detailExportLabel,
    t: t,
    tOpts: tOpts
  }), model.preferenceId && /*#__PURE__*/_react.default.createElement(_GridPreference.default, {
    gridRef: apiRef,
    columns: gridColumns,
    setIsGridPreferenceFetched: setIsGridPreferenceFetched,
    model: model,
    initialGridRef: initialGridRef,
    setIsLoading: setIsLoading
  }))));
};
var _default = exports.default = CustomToolbar;