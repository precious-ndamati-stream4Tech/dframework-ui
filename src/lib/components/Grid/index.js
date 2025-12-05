
import React from 'react';
import {
    DataGridPremium,
    GridToolbarExportContainer,
    getGridDateOperators,
    GRID_CHECKBOX_SELECTION_COL_DEF,
    getGridStringOperators,
    getGridNumericOperators,
    GridActionsCellItem,
    useGridApiRef
} from '@mui/x-data-grid-premium';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/FileCopy';
import EditIcon from '@mui/icons-material/Edit';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useMemo, useEffect, memo, useRef, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from '../SnackBar/index';
import { DialogComponent } from '../Dialog/index';
import { getList, getRecord, deleteRecord } from './crud-helper';
import PropTypes from 'prop-types';
import { Footer } from './footer';
import template from './template';
import { Tooltip } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from "@material-ui/core";
import { useStateContext, useRouter } from '../useRouter/StateProvider';
import LocalizedDatePicker from './LocalizedDatePicker';
import actionsStateProvider from '../useRouter/actions';
import CustomDropdownmenu from './CustomDropdownmenu';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { GridOn, Code, Language, TableChart, DataObject as DataObjectIcon } from '@mui/icons-material';
import Box from '@mui/material/Box';
import utils from '../utils';
import CustomToolbar from './CustomToolbar';
import constants from '../constants';

const defaultPageSize = 10;
const t = utils.t;
const sortRegex = /(\w+)( ASC| DESC)?/i;
const recordCounts = 60000;

const booleanIconRenderer = (params) => {
    if (params.value) {
        return <CheckIcon style={{ color: 'green' }} />;
    } else {
        return <CloseIcon style={{ color: 'gray' }} />;
    }
}

const useStyles = makeStyles({
    buttons: {
        margin: '6px !important'
    }
})

const convertDefaultSort = (defaultSort) => {
    const orderBy = [];
    if (typeof defaultSort === 'string') {
        const sortFields = defaultSort.split(',');
        for (const sortField of sortFields) {
            sortRegex.lastIndex = 0;
            const sortInfo = sortRegex.exec(sortField);
            if (sortInfo) {
                const [, field, direction = 'ASC'] = sortInfo;
                orderBy.push({ field: field.trim(), sort: direction.trim().toLowerCase() });
            }
        }
    }
    return orderBy;
};

const ExportMenuItem = ({ handleExport, contentType, type, isPivotExport = false, isDetailsExport = false, isLatestExport = false, isFieldStatusPivotExport = false, isInstallationPivotExport = false, onExportMenuClick, icon }) => {
    const onMenuClick = (e) => {
        if (isDetailsExport && onExportMenuClick) {
            onExportMenuClick({ callback: handleExport, exportParams: e });
        } else {
            handleExport(e);
        }
    };
    return (
        <MenuItem
            onClick={onMenuClick}
            data-type={type}
            data-content-type={contentType}
            data-is-pivot-export={isPivotExport}
            data-is-details-export={isDetailsExport}
            data-is-latest-export={isLatestExport}
            data-is-infield-export={isFieldStatusPivotExport}
            data-is-installation-export={isInstallationPivotExport}
        >
            <Box className="grid-icons" sx={{ pointerEvents: 'none' }}>{icon}</Box>
            {type}
        </MenuItem>
    );
};

ExportMenuItem.propTypes = {
    hideMenu: PropTypes.func
};

const CustomExportButton = (props) => {
    const { tOpts } = props;
    return (
        <GridToolbarExportContainer {...props}>
            {props?.showOnlyExcelExport !== true && <ExportMenuItem {...props} icon={<GridOn fontSize="small" />} type="CSV" contentType={constants.exportTypes.CSV} />}
            {props.hideExcelExport === false && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} type="Excel" contentType={constants.exportTypes.EXCEL} />}
            {props.showExportWithDetails && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} onExportMenuClick={props.onExportMenuClick} type={tOpts.t(props.detailExportLabel, tOpts) || tOpts.t("Excel with Details", tOpts)} contentType={constants.exportTypes.EXCEL} isDetailsExport={true} />}
            {props.showExportWithLatestData && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} type={tOpts.t("Excel with Latest Data", tOpts)} contentType={constants.exportTypes.EXCEL} isLatestExport={true} />}
            {props.showPivotExportBtn && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} type={tOpts.t("Excel with Pivot", tOpts)} contentType={constants.exportTypes.EXCEL} isPivotExport={true} />}
            {props.showInFieldStatusPivotExportBtn && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} type={tOpts.t("Excel with In-field Pivot", tOpts)} contentType={constants.exportTypes.EXCEL} isFieldStatusPivotExport={true} />}
            {props.showInstallationPivotExportBtn && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} type={tOpts.t("Excel with Installation Pivot", tOpts)} contentType={constants.exportTypes.EXCEL} isInstallationPivotExport={true} />}
            {props?.showOnlyExcelExport !== true && <>

                {props.hideXmlExport === false && <ExportMenuItem {...props} icon={<Code fontSize="small" />} type="XML" contentType="text/xml" />}
                {props.hideHtmlExport === false && <ExportMenuItem {...props} icon={<Language fontSize="small" />} type="HTML" contentType="text/html" />}
                {props.hideJsonExport === false && <ExportMenuItem {...props} icon={<DataObjectIcon fontSize="small" />} type="JSON" contentType="application/json" />}
            </>}
        </GridToolbarExportContainer>
    );
}

const areEqual = (prevProps = {}, nextProps = {}) => {
    let equal = true;
    for (const o in prevProps) {
        if (prevProps[o] !== nextProps[o]) {
            equal = false;
            console.error({ o, prev: prevProps[o], next: nextProps[o] });
        }
    }
    for (const o in nextProps) {
        if (!prevProps.hasOwnProperty(o)) {
            equal = false;
            console.error({ o, prev: prevProps[o], next: nextProps[o] });
        }
    }
    return equal;
}
const GridBase = memo(({
    useLinkColumn = true,
    model,
    columns,
    api,
    defaultSort,
    setActiveRecord,
    parentFilters,
    parent,
    where,
    customHeaderComponent,
    selectedClients = null,
    permissions,
    selected,
    assigned,
    available,
    disableCellRedirect = false,
    onAssignChange,
    customStyle,
    onCellClick,
    showRowsSelected,
    chartFilters,
    clearChartFilter,
    showFullScreenLoader,
    customFilters,
    onRowDoubleClick,
    baseFilters,
    onRowClick = () => { },
    gridStyle,
    reRenderKey,
    additionalFilters,
    externalHeaderFiltersComponent,
    setFetchData,
    childTabTitle,
    renderField,
    gridPivotFilter,
    onDoubleClick,
    onResolveClick,
    onAssignmentClick,
    updateParentFilters,
    additionalFiltersForExport,
    onExportMenuClick,
    gridExtraParams,
    getRowClassName,
    setColumns,
    isClientSelected = true,
    makeExternalRequest,
    afterDataSet,
    onDataLoaded,
    rowSelectionModel = undefined
}) => {
    const [paginationModel, setPaginationModel] = useState({ pageSize: defaultPageSize, page: 0 });
    const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [groupingModel, setGroupingModel] = useState([]);
    const [data, setData] = useState({ recordCount: 0, records: [], lookups: {} });
    const [isLoading, setIsLoading] = useState(false);
    const forAssignment = !!onAssignChange;
    const rowsSelected = showRowsSelected;
    const [selection, setSelection] = useState({ type: 'include', ids: new Set([]) });
    const { t: translate, i18n } = useTranslation();
    const tOpts = { t: translate, i18n };
    // Compute initial visibility model for initialState
    const initialVisibilityModel = useMemo(
        () => ({
            CreatedOn: model?.showHiddenColumn || false,
            CreatedByUser: model?.showHiddenColumn || false,
            ...model?.columnVisibilityModel
        }),
        [model?.showHiddenColumn, model?.columnVisibilityModel]
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const [record, setRecord] = useState(null);
    const snackbar = useSnackbar();
    const isClient = model.isClient === true ? 'client' : 'server';
    const [errorMessage, setErrorMessage] = useState('');
    const { stateData, dispatchData, formatDate, removeCurrentPreferenceName, getAllSavedPreferences, applyDefaultPreferenceIfExists } = useStateContext();
    const userData = stateData?.getUserData ? stateData.getUserData : {};
    const globalHeaderFilters = stateData?.gridExternalFilters ? stateData.gridExternalFilters : {}; 
    const { IsSuperAdmin, ClientIds: tagsClientIds = '' } = stateData?.getUserData ? stateData.getUserData : {};
    const [sortModel, setSortModel] = useState(convertDefaultSort(defaultSort || model?.defaultSort));
    const [externalHeaderFilters, setExternalHeaderFilters] = useState(model?.initialHeaderFilters || {});
    const [headerFilters, setHeaderFilters] = useState(model?.initialHeaderFilterValues || []);
    const groupBy = stateData?.dataGroupBy;
    const prevFilterValues = React.useRef(globalHeaderFilters);
    const filterValues = stateData?.filterValues;
    const [columnOrderModel, setColumnOrderModel] = useState([]);
    const [isDataFetchedInitially, setIsDataFetchedInitially] = useState(false)
    // State for single expanded detail panel row
    const [expandedRowId, setExpandedRowId] = useState(null);
    const gridContainerRef = useRef(null);
    // Ref for column widths to persist without re-renders
    const columnWidthsRef = useRef({});
    const initialFilterModel = { ...constants.gridFilterModel }
    if (model.defaultFilters) {
        initialFilterModel.items = [];
        model.defaultFilters.forEach((ele) => {
            // Ensure each filter has an id field required by MUI X
            const filterItem = { ...ele };
            if (!filterItem.id) {
                filterItem.id = filterItem.field || `filter-${initialFilterModel.items.length}`;
            }
            initialFilterModel.items.push(filterItem);
        })
    }
    const [filterModel, setFilterModel] = useState({ ...initialFilterModel });
    const { pathname, navigate } = useRouter()
    const apiRef = useGridApiRef();
    const initialGridRef = useRef(null);
    const { idProperty = "id", showHeaderFilters = true, disableRowSelectionOnClick = true, createdOnKeepLocal = true, hideBackButton = false, hideTopFilters = true, updatePageTitle = true, isElasticScreen = false, enablePivoting = false, showCreateButton, hideExcelExport = false, hideXmlExport = false, hideHtmlExport = false, hideJsonExport = false, disableRowGrouping = true, applyDefaultClientFilter = true, isPivotGrid = false, groupBy: modelGroupBy = '',  } = model;
    const isReadOnly = model.readOnly === true;
    const isDoubleClicked = model.doubleClicked === false;
    const dataRef = useRef(data);
    const showAddIcon = model.showAddIcon === true;
    const toLink = (model.columns || []).map(item => item.link);
    const [isGridPreferenceFetched, setIsGridPreferenceFetched] = useState(false);
    const classes = useStyles();
    const effectivePermissions = { ...constants.permissions, ...stateData.gridSettings.permissions, ...model.permissions, ...permissions };
    const { ClientId } = stateData?.getUserData ? stateData.getUserData : {};
    const { Username } = stateData?.getUserData ? stateData.getUserData : {};
    const routesWithNoChildRoute = stateData.gridSettings.permissions?.routesWithNoChildRoute || [];
    const disablePivoting = !enablePivoting;
    const globalSort = globalHeaderFilters?.length ? globalHeaderFilters?.filter(ele => ele.isGlobalSort) : [];
    const rowGroupBy = globalSort?.length ? [globalSort[0].field] : [''];
    const url = stateData?.gridSettings?.permissions?.Url;
    const withControllersUrl = stateData?.gridSettings?.permissions?.withControllersUrl;
    const currentPreference = stateData?.currentPreference;

    const OrderSuggestionHistoryFields = {
        OrderStatus: 'OrderStatusId'
    }
    const preferenceApi = stateData?.gridSettings?.permissions?.preferenceApi;
    const groupingModelRef = React.useRef(null);
    const gridColumnTypes = {
        "radio": {
            "type": "singleSelect",
            "valueOptions": "lookup"
        },
        "string": {
            "filterOperators": getGridStringOperators().filter(op => !['doesNotContain', 'doesNotEqual'].includes(op.value))
        },
        "date": {
            "valueFormatter": (value) => (
                formatDate(value, true, false, stateData.dateTime)
            ),
            "filterOperators": LocalizedDatePicker({ columnType: "date" }),
        },
        "dateTime": {
            "valueFormatter": (value) => (
                formatDate(value, false, false, stateData.dateTime)
            ),
            "filterOperators": LocalizedDatePicker({ columnType: "datetime" }),
        },
        "dateTimeLocal": {
            "valueFormatter": (value) => (
                formatDate(value, false, false, stateData.dateTime)
            ),
            "filterOperators": LocalizedDatePicker({ type: "dateTimeLocal", convert: true }),
        },
        "boolean": {
            renderCell: booleanIconRenderer
        }
    }

    useEffect(() => {
        dataRef.current = data;
        if (typeof onDataLoaded === 'function') {
            onDataLoaded(data);
        }
    }, [data]);

    useEffect(() => {

        if (customFilters && Object.keys(customFilters) != 0) {
            if (customFilters.clear) {
                let filterObject = {
                    items: [],
                    logicOperator: "and",
                    quickFilterValues: [],
                    quickFilterLogicOperator: "and"
                }
                setFilterModel(filterObject)
                return
            } else {
                const newArray = [];
                for (const key in customFilters) {
                    if (key === 'startDate' || key === 'endDate') {
                        newArray.push(customFilters[key])
                    } else {
                        if (customFilters.hasOwnProperty(key)) {
                            const newObj = {
                                field: key,
                                value: customFilters[key],
                                operator: "equals",
                                type: "string"
                            };
                            newArray.push(newObj);
                        }
                    }
                }
                let filterObject = {
                    items: newArray,
                    logicOperator: "and",
                    quickFilterValues: [],
                    quickFilterLogicOperator: "and"
                }
                setFilterModel(filterObject)
            }
        }
    }, [customFilters]);

    const lookupOptions = ({ row, field, id, ...others }) => {
        const lookupData = dataRef.current.lookups || {};
        return lookupData[lookupMap[field].lookup] || [];
    };

    // Helper function to create a deep copy of initial grid state
    const captureInitialGridState = () => {
        if (apiRef.current && !initialGridRef.current) {
            const currentColumns = apiRef.current.getAllColumns();
            const columnState = apiRef.current.state.columns;
            
            // Deep copy initial state with all relevant properties
            initialGridRef.current = {
                columns: {
                    orderedFields: [...(columnState.orderedFields || [])],
                    columnVisibilityModel: { ...(columnState.columnVisibilityModel || {}) },
                    lookup: currentColumns.reduce((acc, col) => {
                        acc[col.field] = {
                            field: col.field,
                            width: col.width,
                            flex: col.flex
                        };
                        return acc;
                    }, {})
                },
                sorting: {
                    sortModel: [...(apiRef.current.state.sorting?.sortModel || [])]
                },
                filter: {
                    filterModel: {
                        items: [...(apiRef.current.state.filter?.filterModel?.items || [])],
                        linkOperator: apiRef.current.state.filter?.filterModel?.linkOperator || 'and'
                    }
                },
                pinnedColumns: {
                    left: [...(apiRef.current.state.pinnedColumns?.left || [])],
                    right: [...(apiRef.current.state.pinnedColumns?.right || [])]
                }
            };
        }
    };

    useEffect(() => {
        if (hideTopFilters) {
            dispatchData({
                type: actionsStateProvider.PASS_FILTERS_TOHEADER, payload: {
                    filterButton: null,
                    hidden: { search: true, operation: true, export: true, print: true, filter: true }
                }
            });
        }

        // Capture initial grid state for preferences reset functionality
        if (apiRef.current) {
            const captureTimer = setTimeout(() => {
                captureInitialGridState();
            }, 100);
            return () => clearTimeout(captureTimer);
        }
    }, []);

    const { gridColumns, pinnedColumns, lookupMap } = useMemo(() => {
        const baseColumnList = columns || model?.gridColumns || model?.columns || [];
        const pinnedColumns = { left: [GRID_CHECKBOX_SELECTION_COL_DEF.field], right: [] };
        const finalColumns = [];
        const lookupMap = {};
        for (const column of baseColumnList) {
            const overrides = {};
            if (column.headerName === null) {
                continue;
            }
            if (parent && column.lookup === parent) {
                continue;
            }
            if (column.type === 'oneToMany') {
                if (column.countInList === false) {
                    continue;
                }
                overrides.type = 'number';
                overrides.field = column.field.replace(/s$/, 'Count');
            }
            if (column.type === 'decimal') {
                overrides.align = column.align || 'right';  //  Since MUI aligns decimal field to left by default, so we've added this code to align it to right. If the align is passed to the column, it will override this.
                const newFilterOperator = [...getGridNumericOperators()].filter(op => !['!='].includes(op.value));
                overrides.filterOperators = newFilterOperator;
            }

            if (gridColumnTypes[column.type]) {
                Object.assign(overrides, gridColumnTypes[column.type]);
            }
            if (overrides.valueOptions === "lookup") {
                overrides.valueOptions = lookupOptions;
                let lookupFilters = [...getGridDateOperators(), ...getGridStringOperators()].filter((operator) => ['is', 'not', 'isAnyOf'].includes(operator.value))
                overrides.filterOperators = lookupFilters.map((operator) => ({
                    ...operator,
                    InputComponent: operator.InputComponent ? (params) => (
                        <CustomDropdownmenu
                            column={{
                                ...column,
                                dataRef: dataRef
                            }}
                            {...params}
                            autoHighlight
                        />
                    ) : undefined
                }));
            }
            if (column.linkTo) {
                overrides.cellClassName = "mui-grid-linkColumn";
            }
            if (column.link) {
                overrides.cellClassName = "mui-grid-linkColumn";
            }
            if (!disableRowGrouping) {
                overrides.groupable = column.groupable;
            }
            overrides.filterable = column.filterable === false ? false : (column.field !== groupingModelRef.current);
            // Apply custom label processor if available
            if (model.customLabelProcessor && typeof model.customLabelProcessor === 'function') {
                column.label = model.customLabelProcessor({ column, t, tOpts });
            }
            finalColumns.push({ headerName: column.headerName || t(column.label, tOpts), ...column, ...overrides });
            if (column.pinned) {
                pinnedColumns[column.pinned === 'right' ? 'right' : 'left'].push(column.field);
            }
            lookupMap[column.field] = column;
            column.label = t(column?.label, tOpts)
        }

        const auditColumns = model.standard === true;

        if (auditColumns && model?.addCreatedModifiedColumns !== false) {
            if (model?.addCreatedOnColumn !== false) {
                finalColumns.push(
                    {
                        field: "CreatedOn", type: "dateTime", headerName: t("Created On", tOpts), width: 200, filterOperators: LocalizedDatePicker({ columnType: "date" }), valueFormatter: gridColumnTypes.dateTime.valueFormatter, keepUTC: createdOnKeepLocal
                    }
                );
            }
            if (model?.addCreatedByColumn !== false) {
                finalColumns.push(
                    { field: "CreatedByUser", type: "string", headerName: t("Created By", tOpts), width: 200 },
                );
            }
            if (model?.addModifiedOnColumn !== false) {
                finalColumns.push(
                    {
                        field: "ModifiedOn", type: "dateTime", headerName: t("Modified On", tOpts), width: 200, filterOperators: LocalizedDatePicker({ columnType: "date" }), valueFormatter: gridColumnTypes.dateTime.valueFormatter

                    }
                );
            }
            if (model?.addModifiedByColumn !== false) {
                finalColumns.push(
                    { field: "ModifiedByUser", type: "string", headerName: t("Modified By", tOpts), width: 200 }
                );
            }
        }

        if (!forAssignment && !isReadOnly) {
            const actionsLength = [
                effectivePermissions.edit,
                effectivePermissions.add && !showCopy,
                effectivePermissions.delete,
                effectivePermissions.resolve,
                effectivePermissions.assign
            ].filter(Boolean).length;
            
            if (actionsLength > 0) {
                finalColumns.push({
                    headerName: t("Actions", tOpts),
                    field: t('actions', tOpts),
                    type: 'actions',
                    label: '',
                    width: actionsLength * (model.actionWidth || 50),
                    getActions: (params) => {
                        const { AlertTypeId, StatusId } = params.row;
                        const useCustomActions = ((constants.ShowCustomActions.includes(AlertTypeId) && StatusId === 1) || model.isCustomActionsGrid);
                        const actions = [];
                        
                        // Resolve action (first - only for custom actions)
                        if (useCustomActions && effectivePermissions.resolve) {
                            actions.push(
                                <GridActionsCellItem 
                                    key="resolve"
                                    icon={<Tooltip title={t("Resolve", tOpts)}><HandymanIcon fontSize="medium" /></Tooltip>} 
                                    label="Resolve" 
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onResolveClick) {
                                            onResolveClick({ record: params.row });
                                        }
                                    }}
                                />
                            );
                        }
                        
                        // Delete action (second)
                        if (effectivePermissions.delete) {
                            actions.push(
                                <GridActionsCellItem 
                                    key="delete"
                                    icon={<Tooltip title={t("Delete", tOpts)}><DeleteIcon fontSize="medium" /></Tooltip>} 
                                    label="Delete" 
                                    color="error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDeleting(true);
                                        setRecord({ 
                                            name: params.row[model?.linkColumn], 
                                            id: params.row[idProperty] 
                                        });
                                    }}
                                />
                            );
                        }
                        
                        // Copy action (third)
                        if (effectivePermissions.add && !showCopy) {
                            actions.push(
                                <GridActionsCellItem 
                                    key="copy"
                                    icon={<Tooltip title={t("Copy", tOpts)}><CopyIcon fontSize="medium" /></Tooltip>} 
                                    label="Copy" 
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openForm(params.row[idProperty], { mode: 'copy' });
                                    }}
                                />
                            );
                        }
                        
                        // Edit action (fourth)
                        if (effectivePermissions.edit) {
                            actions.push(
                                <GridActionsCellItem 
                                    key="edit"
                                    icon={<Tooltip title={t("Edit", tOpts)}><EditIcon fontSize="medium" /></Tooltip>} 
                                    label="Edit" 
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openForm(params.row[idProperty]);
                                    }}
                                />
                            );
                        }
                        
                        // Assign action (last - only for custom actions)
                        if (useCustomActions && effectivePermissions.assign) {
                            actions.push(
                                <GridActionsCellItem 
                                    key="assign"
                                    icon={<Tooltip title={t("Assign", tOpts)}><span style={{ fontSize: "medium" }}>{t('Assign', tOpts)}</span></Tooltip>} 
                                    label="Assign" 
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onAssignmentClick) {
                                            onAssignmentClick({ record: params.row });
                                        }
                                    }}
                                />
                            );
                        }
                        
                        return actions;
                    }
                });
            }
            pinnedColumns.right.push(t('actions', tOpts));
        }

        return { gridColumns: finalColumns, pinnedColumns, lookupMap };
    }, [columns, model, parent, permissions, forAssignment, rowGroupBy]);

    useEffect(() => {
        const currentFields = new Set(columnOrderModel);
        const newFields = gridColumns.map(col => col.field).filter(field => !currentFields.has(field));
        if (newFields.length > 0) {
            setColumnOrderModel(prev => [...prev, ...newFields]);
        }
    }, [gridColumns, columnOrderModel.length]);

    const fetchData = (action = "list", extraParams = {}, contentType, columns, isPivotExport, isElasticExport, isDetailsExport, fromSelfServe = false, isLatestExport, removeHeaderFilter = false, isFieldStatusPivotExport, isInstallationPivotExport, additionalFiltersForExportNew) => {
        const { pageSize, page } = paginationModel;
        let gridApi = `${model.controllerType === 'cs' ? withControllersUrl : url}${model.api || api}`

        let controllerType = model?.controllerType;
        let payloadFilter = model?.defaultPayloadFilter || [];
        const isPivot = isPivotExport || isFieldStatusPivotExport || isInstallationPivotExport;
        let template = isPivot ? model?.template : null, configFileName = isPivot ? model?.configFileName : null;
        if (isPivotExport) {
            gridApi = model?.pivotAPI;
            controllerType = 'cs';
        }
        // for conditional filtering which is required in a cs controller API. The API is expecting filter in this exact, for default only.
        if (filterModel.items.length > 1 && model?.filter) {
            delete extraParams.filter;
        } else if (filterModel.items.length <= 1 && model?.filter) {
            extraParams["filter"] = model?.filter;
        }

        if (isFieldStatusPivotExport) {
            gridApi = model?.pivotAPI[0];
            template = model?.template[0];
            configFileName = model?.configFileName[0];
            controllerType = 'cs';
        }
        if (isInstallationPivotExport) {
            gridApi = model?.pivotAPI[1];
            template = model?.template[1];
            configFileName = model?.configFileName[1];
            controllerType = 'cs';
        }
        if (assigned || available) {
            extraParams[assigned ? "include" : "exclude"] = Array.isArray(selected) ? selected.join(',') : selected;
        }
        let filters = { ...filterModel }, finalFilters = { ...filterModel };
        if (chartFilters?.items?.length > 0) {
            let { columnField: field, operatorValue: operator, value } = chartFilters.items[0];
            field = constants.chartFilterFields[field];
            const chartFilter = [{ id: field, field: field, operator: operator, isChartFilter: false, value: value }];
            filters.items = [...chartFilter];
            if (JSON.stringify(filterModel) !== JSON.stringify(filters)) {
                setFilterModel({ ...filters });
                finalFilters = filters;
                chartFilters.items.length = 0;
            }
        }
        if (additionalFilters) {
            // Ensure each additional filter has an id field required by MUI X
            const filtersWithIds = additionalFilters.map((filter, index) => {
                if (!filter.id) {
                    return { ...filter, id: filter.field || `additional-filter-${index}` };
                }
                return filter;
            });
            finalFilters.items = [...finalFilters.items, ...filtersWithIds];
        }
        if (controllerType === 'cs') {
            const { items } = finalFilters;
            const fieldsToRemove = model?.fieldsToRemoveFromFilter || [];
            const fieldsToAdd = model?.addFieldToPayload || [];
            if (fieldsToAdd?.length && fieldsToRemove?.length) {
                const isGridFilterPresent = items.filter(ele => !fieldsToRemove.includes(ele.field));
                const isPayloadFilter = items.filter(ele => fieldsToAdd.includes(ele.field));
                if (isPayloadFilter.length) {
                    payloadFilter = [...payloadFilter, ...isPayloadFilter];
                }
                finalFilters.items = isGridFilterPresent;
            }
        }

        if (model?.initialHeaderFilterValues) {
            finalFilters = utils.getFinalFilters(model.initialHeaderFilterValues, finalFilters);
        }

        if (headerFilters?.length && !removeHeaderFilter) {
            finalFilters = utils.getFinalFilters(headerFilters, finalFilters);
        }

        // Handle client selection
        let clientsSelected = (applyDefaultClientFilter && !selectedClients ? [Number(ClientId)] : selectedClients || []).filter(ele => ele !== 0);

        const globalFilters = {};

        // Process global filters if configuration exists
        if ((model?.globalFilters?.filterConfig?.length || model?.addGlobalFilters) && globalHeaderFilters?.length) {
            let updatedFilters = globalHeaderFilters;
            if (model?.fieldsToRemoveFromGlobalFilter?.length) {
                updatedFilters = globalHeaderFilters.filter(
                    (ele) => !model.fieldsToRemoveFromGlobalFilter.includes(ele.field)
                );
            }
            // Convert header filters array to object
            Object.assign(globalFilters,
                updatedFilters
                    .filter(filter => !filter.isExternalFilter)
                    .reduce((acc, { field, value }) => {
                        acc[field] = value;
                        return acc;
                    }, {})
            );

            // Update client selection if ClientId exists in global filters
            if ('ClientId' in globalFilters) {
                clientsSelected = globalFilters.ClientId;
            }
        }
        if (gridExtraParams) {
            extraParams = { ...extraParams, ...gridExtraParams };
        }
        if (model?.globalFilters?.gridExternalFilters) {
            const externalFilters = globalHeaderFilters.filter(filter => filter.isExternalFilter);
            if (externalFilters?.length) {
                finalFilters.items = [...finalFilters.items, ...externalFilters]
            }
        }
        if (model.updateSortFields) {
            model.updateSortFields({ sort: sortModel, groupBy });
        }
        if (model.updateFilterFields) {
            finalFilters = model.updateFilterFields({ filter: utils.deepCloneObject(finalFilters), groupBy });
        }
        getList({
            action,
            page,
            pageSize,
            sortModel,
            filterModel: finalFilters,
            controllerType: controllerType,
            api: gridApi,
            setIsLoading,
            setData,
            gridColumns,
            modelConfig: model,
            parentFilters,
            extraParams,
            setError: snackbar.showError,
            contentType,
            columns,
            template,
            configFileName: isPivotExport ? model?.configFileName : null,
            dispatchData,
            showFullScreenLoader,
            history: navigate,
            baseFilters,
            isElasticExport,
            fromSelfServe: fromSelfServe ? true : false,
            isDetailsExport: isDetailsExport,
            setFetchData,
            selectedClients: clientsSelected,
            isChildGrid: model?.isChildGrid,
            groupBy: isPivotGrid ? [groupBy] : modelGroupBy,
            isPivotGrid,
            isPivotExport,
            gridPivotFilter,
            activeClients: selectedClients?.length ? selectedClients : [Number(ClientId)].filter(ele => ele !== 0),
            isLatestExport,
            payloadFilter,
            isFieldStatusPivotExport,
            isInstallationPivotExport,
            additionalFiltersForExport: additionalFiltersForExportNew || additionalFiltersForExport,
            uiClientIds: isPivotExport && Array.isArray(clientsSelected) && clientsSelected.join(','),
            globalFilters,
            setColumns,
            afterDataSet,
            setIsDataFetchedInitially,
            isDataFetchedInitially,
            exportFileName: t(model?.exportFileName || model?.title, tOpts),
            t,
            tOpts,
            languageSelected: constants.supportedLanguageCodes[i18n.language || constants.defaultLanguage]
        });
    };
    const openForm = (id, { mode } = {}) => {
        if (setActiveRecord) {
            getRecord({ id, api: api || model?.api, setIsLoading, setActiveRecord, modelConfig: model, parentFilters, where });
            return;
        }
        let path = pathname;
        if (!path.endsWith("/")) {
            path += "/";
        }
        if (mode === "copy") {
            path += "0-" + id;
            dispatchData({ type: 'UPDATE_FORM_MODE', payload: 'copy' })

        } else {
            path += id;
            dispatchData({ type: 'UPDATE_FORM_MODE', payload: '' })
        }
        navigate(path);
    };
    const onCellClickHandler = async (cellParams, event, details) => {
        if (!isReadOnly) {
            if (onCellClick) {
                const result = await onCellClick({ cellParams, event, details });
                if (typeof result !== "boolean") {
                    return;
                }
            }
            const { row: record } = cellParams;
            const columnConfig = lookupMap[cellParams.field] || {};
            if (columnConfig.linkTo) {
                navigate({
                    pathname: template.replaceTags(columnConfig.linkTo, record)
                });
                return;
            }
            let action = useLinkColumn && cellParams.field === model.linkColumn ? constants.actionTypes.Edit : null;
            if (!action && cellParams.field === 'actions') {
                action = details?.action;
                if (!action) {
                    const el = event.target.closest('button');
                    if (el) {
                        action = el.dataset.action;
                    }
                }
            }
            if (action === constants.actionTypes.Edit) {
                return openForm(record[idProperty]);
            }
            if (action === constants.actionTypes.Copy) {
                return openForm(record[idProperty], { mode: 'copy' });
            }
            if (action === constants.actionTypes.Delete) {
                setIsDeleting(true);
                setRecord({ name: record[model?.linkColumn], id: record[idProperty] });
            }
        }
        if (isReadOnly && toLink) {
            if (model?.isAcostaController && onCellClick && cellParams.colDef.customCellClick === true) {
                onCellClick(cellParams.row);
                return;
            }
            const { row: record } = cellParams;
            const columnConfig = lookupMap[cellParams.field] || {};
            let historyObject = {
                pathname: template.replaceTags(columnConfig.linkTo, record),
            }

            if (model.addRecordToState) {
                historyObject.state = record
            }
            navigate(historyObject);
        }
    };

    const handleDelete = async function () {

        let gridApi = `${model.controllerType === 'cs' ? withControllersUrl : url}${model.api || api}`
        const result = await deleteRecord({ id: record?.id, api: gridApi, setIsLoading, setError: snackbar.showError, setErrorMessage });
        if (result === true) {
            setIsDeleting(false);
            snackbar.showMessage(t('Record Deleted Successfully', tOpts));
            fetchData();
        } else {
            setTimeout(() => {
                setIsDeleting(false);
            }, 200);
        }
    }
    const clearError = () => {
        setErrorMessage(null);
        setIsDeleting(false);
    };
    const onCellDoubleClick = (event) => {
        if (onDoubleClick) {
            onDoubleClick({ event });
            return;
        }
        const { row: record } = event;
        if ((!isReadOnly && !isDoubleClicked) && !disableCellRedirect) {
            openForm(record[idProperty]);
        }

        if (isReadOnly && model.rowRedirectLink) {
            let historyObject = {
                pathname: template.replaceTags(model.rowRedirectLink, record),
            }

            if (model.addRecordToState) {
                historyObject.state = record
            }
            navigate(historyObject);
        }

        if (onRowDoubleClick) {
            onRowDoubleClick(event);
        }
    };

    const handleCloseOrderDetailModal = () => {
        setIsOrderDetailModalOpen(false);
        setSelectedOrder(null);
        fetchData();
    };


    const onAdd = () => {
        openForm(0);
    };

    const clearFilters = () => {
        if (filterModel?.items?.length > 0) {
            const filters = JSON.parse(JSON.stringify(constants.gridFilterModel));
            setFilterModel(filters);
            if (clearChartFilter) {
                clearChartFilter();
            }
        }
    }

    const updateAssignment = ({ unassign = new Set(), assign = new Set() }) => {
        const assignedValues = Array.isArray(selected)
            ? selected
            : selected.length
                ? selected.split(',')
                : [];

        const unassignSet = unassign instanceof Set ? unassign : unassign?.ids instanceof Set ? unassign.ids : new Set();
        const assignSet = assign instanceof Set ? assign : assign?.ids instanceof Set ? assign.ids : new Set();

        const filtered = assignedValues.filter(id => !unassignSet.has(parseInt(id)));
        const finalValues = [...new Set([...filtered, ...assignSet])];

        onAssignChange(typeof selected === 'string' ? finalValues.join(',') : finalValues);
    };

    const onAssign = () => {
        updateAssignment({ assign: selection.ids });
    }

    const onUnassign = () => {
        updateAssignment({ unassign: selection.ids });
    }

    useEffect(() => {
        removeCurrentPreferenceName({ dispatchData });
        getAllSavedPreferences({ preferenceName: model.preferenceId, history: navigate, dispatchData, Username, preferenceApi });
        applyDefaultPreferenceIfExists({ preferenceName: model.preferenceId, history: navigate, dispatchData, Username, gridRef: apiRef, setIsGridPreferenceFetched, preferenceApi });
    }, [])

    // Load initial column widths from grid API after preferences are applied
    useEffect(() => {
        if (!isClientSelected) return;
        if (isGridPreferenceFetched && apiRef.current) {
            const currentColumns = apiRef.current.getAllColumns();
            const initialWidths = {};
            currentColumns.forEach(col => {
                if (col.width) {
                    initialWidths[col.field] = col.width;
                }
            });
            columnWidthsRef.current = initialWidths;
        }
    }, [isGridPreferenceFetched]);

    const getGridRowId = (row) => {
        const idValue = row[idProperty];
        return idValue && idValue.toString().trim() !== "" ? idValue : uuidv4();
    };

    const handleExport = (e) => {
        if (data?.recordCount > recordCounts) {
            snackbar.showMessage(t('Cannot export more than 60k records, please apply filters or reduce your results using filters', tOpts));
            return;
        }
        else {
            const { orderedFields, columnVisibilityModel, lookup } = apiRef.current.state.columns;
            let columns = {};
            const isPivotExport = e.target.dataset.isPivotExport === 'true';
            const isDetailsExport = e.target.dataset.isDetailsExport === 'true';
            const isLatestExport = e.target.dataset.isLatestExport === 'true';
            const isFieldStatusPivotExport = e.target.dataset.isInfieldExport === 'true';
            const isInstallationPivotExport = e.target.dataset.isInstallationExport === 'true';
            const additionalFiltersForExportNew = e.target.dataset.extraExportFilters ? JSON.parse(e.target.dataset.extraExportFilters) : {}
            const hiddenColumns = Object.keys(columnVisibilityModel).filter(key => columnVisibilityModel[key] === false);
            const visibleColumns = orderedFields.filter(ele => !hiddenColumns?.includes(ele) && ele !== '__check__' && ele !== t('actions', tOpts) && !ele.includes('_drilldown'));
            if (visibleColumns?.length === 0) {
                snackbar.showMessage(t('You cannot export while all columns are hidden... please show at least 1 column before exporting', tOpts));
                return;
            }
            visibleColumns.forEach(ele => {
                if (!constants.gridGroupByColumnName.includes(ele)) { // do not include group by column in export
                    // Check if column has disableExport property
                    const gridColumn = gridColumns.find(col => col.field === ele);
                    if (gridColumn && gridColumn.disableExport) {
                        return; // Skip this column in export
                    }
                    columns[ele] = { field: ele, width: lookup[ele].width, headerName: t(lookup[ele].headerName, tOpts), type: lookup[ele].type, keepUTC: lookup[ele].keepUTC === true, isParsable: lookup[ele]?.isParsable };
                }
            })
            if (model?.customExportColumns) {
                columns = model?.customExportColumns({ t, tOpts });
            }
            const isPivot = isPivotExport || isFieldStatusPivotExport || isInstallationPivotExport;
            fetchData(isPivot ? 'export' : undefined, {}, e.target.dataset.contentType, columns, isPivotExport, isElasticScreen, isDetailsExport, false, isLatestExport, false, isFieldStatusPivotExport, isInstallationPivotExport, additionalFiltersForExportNew);
        }
    };

    const filteredDependencies = useMemo(() => {
        // Filter out objects for isGlobalSort
        const removeGlobalSort = Array.isArray(globalHeaderFilters) ? globalHeaderFilters.filter((f) => !f.isGlobalSort) : [];
        return removeGlobalSort;
    }, [globalHeaderFilters]);

    const commonDependencies = [api, model, parentFilters, assigned, selected, available, chartFilters, isGridPreferenceFetched, reRenderKey, selectedClients, filteredDependencies];

    const gridDependencyArray = useMemo(() => {
        return model?.isClient
            ? commonDependencies
            : [paginationModel, sortModel, filterModel, ...commonDependencies];
    }, [model?.isClient, paginationModel, sortModel, filterModel, commonDependencies]);

    // Stringify for deep comparison
    const previousGridDependencyRef = useRef(gridDependencyArray);

    useEffect(() => {
        if (isGridPreferenceFetched && isClientSelected) {
            const currentGridDependencyArray = JSON.stringify(gridDependencyArray);
            // Only make request if filters have genuinely changed  
            const isAdminOrSuperAdmin = utils.isAdminORSuperAdmin(IsSuperAdmin);
            const isMultiClient = isAdminOrSuperAdmin || tagsClientIds.split(',').length > 1;
            if (isMultiClient && JSON.stringify(prevFilterValues.current) === JSON.stringify({ api, model, parentFilters, assigned, selected, available, chartFilters, isGridPreferenceFetched, reRenderKey, selectedClients, paginationModel, sortModel, filterModel, filteredDependencies, renderField })) {
                return;
            }
            if (previousGridDependencyRef.current !== currentGridDependencyArray) {
                previousGridDependencyRef.current = currentGridDependencyArray;
                prevFilterValues.current = { api, model, parentFilters, assigned, selected, available, chartFilters, isGridPreferenceFetched, reRenderKey, selectedClients, paginationModel, sortModel, filterModel, filteredDependencies, renderField };
                fetchData();
            }
        }
    }, [gridDependencyArray]);

    useEffect(() => {
        if (makeExternalRequest && typeof makeExternalRequest === 'function') {
            makeExternalRequest();
        }
    }, []);

    useEffect(() => {
        if (forAssignment || !updatePageTitle) {
            return;
        }
        if (model?.pageTitle || model?.title) {
        dispatchData({ type: actionsStateProvider.PAGE_TITLE_DETAILS, payload: { icon: "", titleHeading: model?.pageTitle || model?.title, titleDescription: model?.titleDescription, title: model?.title } })
        return () => {
            dispatchData({
                type: actionsStateProvider.PAGE_TITLE_DETAILS, payload: null
            })
        }
    }
    }, [])

    useEffect(() => {
        let backRoute = pathname;
        
        // we do not need to show the back button for these routes
        if ((hideBackButton && backRoute === '')  || routesWithNoChildRoute.includes(backRoute)) {
            dispatchData({
                type: actionsStateProvider.SET_PAGE_BACK_BUTTON,
                payload: { status: false, backRoute: '' },
            });
            return;
        }
        backRoute = backRoute.split("/");
        backRoute.pop();
        backRoute = backRoute.join("/");
        dispatchData({
            type: actionsStateProvider.SET_PAGE_BACK_BUTTON,
            payload: { status: true, backRoute: backRoute },
        });
    }, [isLoading]);

    const sqlLimits = {
        max: constants.SQL_INT_MAX,
        min: constants.SQL_INT_MIN
    }
    const [prevFilterModel, setPrevFilterModel] = useState({ items: [] });

    const updateFilters = (e) => {
        const { items } = e;
        let hasValidationErrors = false;

        const updatedItems = items.map((item, index) => {
            const { field, operator, value } = item;
            const column = gridColumns.find(col => col.field === field);
            const columnType = column?.type;
            const prevItem = prevFilterModel?.items[index];
            const isColumnChanged = prevItem?.field && prevItem?.field !== field;
            if (constants.GridOperators.IsAnyOf === operator && isColumnChanged) {
                return {
                    ...item,
                    id: item.id || item.field || `filter-${Date.now()}-${Math.random()}`,
                    value: null,
                    filterField: column?.useFilterField ? column.filterField : null,
                };
            }
            if (['decimal', 'number', 'float'].includes(columnType)) {
                if (columnType === 'number') {
                    if (Array.isArray(value)) {
                        for (const arrayVal of value) {
                            const numVal = Number(arrayVal);
                            if (numVal !== null && !isNaN(numVal) && !Number.isInteger(numVal)) {
                                hasValidationErrors = true;
                                return null;
                            }
                        }
                    }
                    else {
                        const numVal = Number(value);
                        if (numVal !== null && !isNaN(numVal) && !Number.isInteger(numVal)) {
                            hasValidationErrors = true;
                            return null;
                        }
                    }
                }
                const val = Number(value);
                if (Array.isArray(value)) {
                    for (const arrayVal of value) {
                        const numVal = Number(arrayVal);
                        if (numVal > Number(sqlLimits.max)) {
                            snackbar.showError(t(`One or more values in the array exceed the allowed range. Please enter smaller numbers.`, tOpts));
                            hasValidationErrors = true;
                            return null;
                        }
                        if (numVal < Number(sqlLimits.min)) {
                            snackbar.showError(t(`One or more values in the array exceed the allowed range. Please enter larger numbers.`, tOpts));
                            hasValidationErrors = true;
                            return null;
                        }
                    }
                } else {
                    if (val > Number(sqlLimits.max)) {
                        snackbar.showError(t(`The entered value exceeds the allowed range. Please enter a smaller number.`, tOpts));
                        hasValidationErrors = true;
                        return null;
                    }
                    if (val < Number(sqlLimits.min)) {
                        snackbar.showError(t(`The entered value exceeds the allowed range. Please enter a larger number.`, tOpts));
                        hasValidationErrors = true;
                        return null;
                    }
                }
            }
            if (column?.useCustomFilterField) {
                item.filterField = renderField;
            } else {
                item.filterField = null
            }
            const isNumber = column?.type === constants.filterFieldDataTypes.Number || column?.type === constants.filterFieldDataTypes.Decimal;

            const isValidValue = (constants.emptyIsAnyOfOperatorFilters.includes(operator)) || (isNumber && !isNaN(value)) || (!isNumber);

            if (field === OrderSuggestionHistoryFields.OrderStatus) {
                const { filterField, ...newItem } = item;
                return newItem;
            }

            if (isValidValue) {
                const isKeywordField = isElasticScreen && gridColumns.filter(element => element.field === item.field)[0]?.isKeywordField;
                if (isKeywordField) {
                    item.filterField = `${item.field}.keyword`;
                }
                if (column?.useFilterField) {
                    item.filterField = column.filterField;
                }
                item.type = columnType;
                return item;
            }
            // Ensure id is preserved when creating new filter object
            return {
                id: item.id || item.field || `filter-${Date.now()}-${Math.random()}`,
                field,
                operator,
                type: columnType,
                value: isNumber ? null : value
            };
        });

        if (!hasValidationErrors) {
            e.items = updatedItems.filter(item => item !== null);
            setFilterModel(e);
            setPrevFilterModel(e)
            handleChartFilterClearing(e, clearChartFilter);
        }
    };

    const handleChartFilterClearing = (updatedFilters, clearChartFilter) => {
        const isClearChartFilter = !updatedFilters?.items?.some(ele => ele.isChartFilter && !(['isEmpty', 'isNotEmpty'].includes(ele.operator)));
        if (isClearChartFilter) {
            clearChartsFilters(clearChartFilter);
        } else if (chartFilters?.items?.length > 0) {
            if (updatedFilters.items.length === 0) {
                clearChartsFilters(clearChartFilter);
            } else {
                const chartFilterIndex = chartFilters?.items.findIndex(ele => ele.columnField === updatedFilters.items[0].field);
                if (chartFilterIndex > -1) {
                    clearChartsFilters(clearChartFilter);
                }
            }
        }
    };

    const clearChartsFilters = (clearChartFilter) => {
        if (clearChartFilter) {
            clearChartFilter();
        }
    }

    const updateSort = (e) => {
        if (e[0]) {
            if (constants.gridGroupByColumnName.includes(e[0].field)) {
                snackbar.showMessage(t('Group By is applied on the same column, please remove it in order to apply sorting.', tOpts));
                return;
            }
        }
        const sort = e.map((ele) => {
            const isKeywordField = isElasticScreen && gridColumns.filter(element => element.field === ele.field)[0]?.isKeywordField
            return { ...ele, filterField: isKeywordField ? `${ele.field}.keyword` : ele.field };
        })
        setSortModel(sort);
    }


    const externalFilterHandleChange = (event, operator, type) => {
        const { name, value, label, isAutoComplete } = event.target;
        const tempValue = isAutoComplete ? label : value;
        const filters = { ...externalHeaderFilters, [name]: value };
        const gridHeaderFilters = [...headerFilters];
        const isFilterExistsIndex = gridHeaderFilters.findIndex(ele => ele.field === name);
        if (isFilterExistsIndex > -1) {
            gridHeaderFilters[isFilterExistsIndex] = { field: name, value: tempValue, operator, type };
        } else {
            gridHeaderFilters.push({ field: name, value: tempValue, operator, type });
        }
        setHeaderFilters(gridHeaderFilters);
        setExternalHeaderFilters(filters);
    }

    const onExternalFiltersApplyClick = () => {
        const initialValues = model?.initialHeaderFilters || {};
        if (externalHeaderFilters !== initialValues) {
            fetchData("list", {}, null, columns, false, false, false, false, false);
        }
        if (updateParentFilters) {
            updateParentFilters(externalHeaderFilters);
        }
    }

    const onExternalFiltersResetClick = () => {
        const initialValues = model?.initialHeaderFilters || {};
        if (externalHeaderFilters !== initialValues) {
            setExternalHeaderFilters(model?.initialHeaderFilters || {});
            setHeaderFilters(model?.initialHeaderFilterValues || []);
            fetchData("list", {}, null, columns, false, false, false, false, false, true);
            updateParentFilters(model?.initialHeaderFilters || {});
        }
    };

    const rowGroupingModelChange = (groupModel) => {
        const defaultSorting = convertDefaultSort(defaultSort || model?.defaultSort);
        const updatedFilters = (Array.isArray(globalHeaderFilters) ? globalHeaderFilters : []).filter(ele => !ele.isGlobalSort);
        function updateGlobalFilters(groupModel) {
            dispatch({ type: actions.SET_GRID_EXTERNAL_FILTERS, filters: updatedFilters });
            dispatch({ type: actions.SET_FILTER_VALUES, filterValues: { ...filterValues, groupBy: groupModel } });
        }
        if (!groupModel?.length) {
            setGroupingModel([]);
            setSortModel(defaultSorting);
            groupingModelRef.current = null;
            updateGlobalFilters('');
            return;
        }
        const updatedGroupModel = groupModel[groupModel.length - 1];
        setGroupingModel([updatedGroupModel]);
        const updatedSort = { "field": updatedGroupModel, "sort": "asc", isGlobalSort: true };
        updatedFilters.push(updatedSort)
        const hasSortModelForGroup = sortModel.some(ele => ele.field === updatedGroupModel);
        const updatesSort = hasSortModelForGroup ? sortModel : [updatedSort];
        setSortModel(updatesSort);
        groupingModelRef.current = updatedGroupModel;
        updateGlobalFilters(updatedGroupModel);
    }

    const handleColumnOrder = ({ column, oldIndex, targetIndex }) => {
        if (!column || oldIndex === undefined || targetIndex === undefined || !apiRef.current) return;
        const newOrder = apiRef.current.getAllColumns().map((col) => col.field);
        setColumnOrderModel(newOrder);
        // Also update the grid's internal orderedFields
        if (apiRef.current?.state?.columns) {
            apiRef.current.state.columns.orderedFields = newOrder;
        }
    };

    // Handle column width changes to persist across re-renders
    const handleColumnWidthChange = React.useCallback((params) => {
        // Store immediately without triggering re-render
        columnWidthsRef.current = {
            ...columnWidthsRef.current,
            [params.colDef.field]: params.width
        };
    }, []);

    const orderedColumns = React.useMemo(() => {
        let columns = gridColumns;

        // Apply stored column widths from ref (only when grid re-renders)
        const currentWidths = columnWidthsRef.current;
        if (Object.keys(currentWidths).length > 0) {
            columns = columns.map(col => {
                const storedWidth = currentWidths[col.field];
                return storedWidth ? { ...col, width: storedWidth } : col;
            });
        }

        // Apply column ordering from grid state (for preferences) or component state
        const orderedFields = apiRef.current?.state?.columns?.orderedFields;
        const orderToUse = (orderedFields && Array.isArray(orderedFields) && orderedFields.length > 0) ? orderedFields : columnOrderModel;

        // If no order specified, return all columns
        if (!orderToUse || !Array.isArray(orderToUse) || !orderToUse.length) return columns;

        const fieldMap = new Map(columns.map(c => [c.field, c]));

        // Get ordered columns that exist in fieldMap
        const orderedCols = orderToUse.map(field => fieldMap.get(field)).filter(Boolean);

        // Add any columns from gridColumns that aren't in the order
        const orderedFieldsSet = new Set(orderedCols.map(c => c.field));
        const missingCols = columns.filter(c => !orderedFieldsSet.has(c.field));

        // Return ordered columns + any missing columns at the end
        return [...orderedCols, ...missingCols];
    }, [gridColumns, columnOrderModel]);
    const hideFooter = model.showFooter === false;

    return (
        <>
            {model?.showGlobalFiltersComponent && {GlobalFiltersComponent}}
            {childTabTitle ? <div className="child-tab-title">{childTabTitle}</div> : null}{model?.externalHeaderFilters ? {externalHeaderFiltersComponent}
                : null
            }
            <div style={gridStyle || customStyle}>
                <Box className="grid-parent-container" ref={gridContainerRef}>
                    <DataGridPremium
                        showToolbar
                        headerFilters={showHeaderFilters}
                        checkboxSelection={forAssignment}
                        onRowGroupingModelChange={rowGroupingModelChange}
                        loading={isLoading}
                        disablePivoting={disablePivoting}
                        className="pagination-fix"
                        onCellClick={onCellClickHandler}
                        onCellDoubleClick={onCellDoubleClick}
                        columns={orderedColumns}
                        onColumnOrderChange={handleColumnOrder}
                        onColumnWidthChange={handleColumnWidthChange}
                        paginationModel={paginationModel}
                        pageSizeOptions={constants.pageSizeOptions}
                        onPaginationModelChange={setPaginationModel}
                        pagination={model.pagination ?? true}
                        rowCount={data.recordCount || data.totalRecords || 0}
                        rows={data.records}
                        sortModel={sortModel}
                        paginationMode={isClient}
                        sortingMode={isClient}
                        filterMode={isClient}
                        keepNonExistentRowsSelected
                        onSortModelChange={updateSort}
                        onFilterModelChange={updateFilters}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setSelection(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel !== undefined ? rowSelectionModel : selection}
                        filterModel={filterModel}
                        getRowId={getGridRowId}
                        getRowClassName={getRowClassName}
                        onRowClick={onRowClick}
                        slots={{
                            toolbar: CustomToolbar,
                            footer: Footer,
                            headerFilterMenu: null
                        }}
                        slotProps={{
                            headerFilterCell: { showClearIcon: true },
                            toolbar: {
                                model,
                                customHeaderComponent,
                                currentPreference,
                                isReadOnly,
                                effectivePermissions,
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
                            },
                            footer: {
                                pagination: model.pagination ?? true,
                                tOpts,
                                apiRef
                            },
                            pagination: {
                                backIconButtonProps: {
                                    title: t('Go to previous page', tOpts),
                                    'aria-label': t('Go to previous page', tOpts),
                                },
                                nextIconButtonProps: {
                                    title: t('Go to next page', tOpts),
                                    'aria-label': t('Go to next page', tOpts),
                                },
                            }
                        }}
                        hideFooterSelectedRowCount={rowsSelected}
                        density="compact"
                        hideFooter={hideFooter}
                        disableDensitySelector={true}
                        apiRef={apiRef}
                        disableAggregation={true}
                        disableRowGrouping={disableRowGrouping}
                        columnOrderModel={columnOrderModel}
                        disableRowSelectionOnClick={disableRowSelectionOnClick}
                        rowGroupingModel={groupingModel}
                        initialState={{
                            columns: {
                                columnVisibilityModel: initialVisibilityModel
                            },
                            pinnedColumns: pinnedColumns,
                            pagination: {
                                paginationModel: paginationModel
                            },
                            filter: {
                                filterModel: initialFilterModel
                            }
                        }}
                        getDetailPanelContent={model.getDetailPanelContent ? (params) =>
                            model.getDetailPanelContent({
                                ...params,
                                additionalProps: {
                                    overrideFileName: model.overrideFileName || '',
                                }
                            })
                            : undefined
                        }
                        detailPanelExpandedRowIds={new Set(expandedRowId ? [expandedRowId] : [])}
                        onDetailPanelExpandedRowIdsChange={(ids) => {
                            setExpandedRowId(ids.size > 0 ? Array.from(ids)[ids.size - 1] : null);
                        }}
                        localeText={{
                            noRowsLabel: t('No data', tOpts),
                            footerTotalRows: `${t('Total rows', tOpts)}:`,
                            toolbarQuickFilterPlaceholder: t(model?.searchPlaceholder || 'Search...', tOpts),
                            toolbarColumns: t('Columns', tOpts),
                            toolbarFilters: t('Filters', tOpts),
                            toolbarExport: t('Export', tOpts),
                            filterPanelAddFilter: t('Add filter', tOpts),
                            filterPanelRemoveAll: t('Remove all', tOpts),
                            filterPanelDeleteIconLabel: t('Delete', tOpts),
                            filterPanelColumns: t('Columns', tOpts),
                            filterPanelOperator: t('Operator', tOpts),
                            filterPanelValue: t('Value', tOpts),
                            filterPanelInputLabel: t('Value', tOpts),
                            filterPanelInputPlaceholder: t('Filter value', tOpts),
                            columnMenuLabel: t('Menu', tOpts),
                            columnMenuShowColumns: t('Show columns', tOpts),
                            columnMenuManageColumns: t('Manage columns', tOpts),
                            columnMenuFilter: t('Filter', tOpts),
                            columnMenuHideColumn: t('Hide column', tOpts),
                            columnMenuManagePivot: t('Manage pivot', tOpts),
                            toolbarColumnsLabel: t('Select columns', tOpts),
                            toolbarExportLabel: t('Export', tOpts),
                            pivotDragToColumns: t('Drag here to pivot by', tOpts),
                            pivotDragToRows: t('Drag here to group by', tOpts),
                            pivotDragToValues: t('Drag here to create values', tOpts),
                            pivotColumns: t('Pivot columns', tOpts),
                            pivotRows: t('Row groups', tOpts),
                            pivotValues: t('Values', tOpts),
                            pivotMenuRows: t('Rows', tOpts),
                            pivotMenuColumns: t('Columns', tOpts),
                            pivotMenuValues: t('Values', tOpts),
                            pivotToggleLabel: t('Pivot', tOpts),
                            pivotSearchControlPlaceholder: t('Search pivot columns', tOpts),
                            columnMenuUnsort: t('Unsort', tOpts),
                            columnMenuSortAsc: t('Sort by ascending', tOpts),
                            columnMenuSortDesc: t('Sort by descending', tOpts),
                            columnMenuUnpin: t('Unpin', tOpts),
                            columnsPanelTextFieldLabel: t('Find column', tOpts),
                            columnsPanelTextFieldPlaceholder: t('Column title', tOpts),
                            columnsPanelHideAllButton: t('Hide all', tOpts),
                            columnsPanelShowAllButton: t('Show all', tOpts),
                            pinToLeft: t('Pin to left', tOpts),
                            pinToRight: t('Pin to right', tOpts),
                            unpin: t('Unpin', tOpts),
                            filterValueAny: t('any', tOpts),
                            filterValueTrue: t('true', tOpts),
                            filterValueFalse: t('false', tOpts),
                            filterOperatorIs: t('is', tOpts),
                            filterOperatorNot: t('is not', tOpts),
                            filterOperatorIsAnyOf: t('is any of', tOpts),
                            filterOperatorContains: t('contains', tOpts),
                            filterOperatorDoesNotContain: t('does not contain', tOpts),
                            filterOperatorEquals: t('equals', tOpts),
                            filterOperatorDoesNotEqual: t('does not equal', tOpts),
                            filterOperatorStartsWith: t('starts with', tOpts),
                            filterOperatorEndsWith: t('ends with', tOpts),
                            filterOperatorIsEmpty: t('is empty', tOpts),
                            filterOperatorIsNotEmpty: t('is not empty', tOpts),
                            filterOperatorAfter: t('is after', tOpts),
                            filterOperatorOnOrAfter: t('is on or after', tOpts),
                            filterOperatorBefore: t('is before', tOpts),
                            filterOperatorOnOrBefore: t('is on or before', tOpts),
                            toolbarFiltersTooltipHide: t('Hide filters', tOpts),
                            toolbarFiltersTooltipShow: t('Show filters', tOpts),

                            //filter textfield labels
                            headerFilterOperatorContains: t('contains', tOpts),
                            headerFilterOperatorEquals: t('equals', tOpts),
                            headerFilterOperatorStartsWith: t('starts with', tOpts),
                            headerFilterOperatorEndsWith: t('ends with', tOpts),
                            headerFilterOperatorIsEmpty: t('is empty', tOpts),
                            headerFilterOperatorIsNotEmpty: t('is not empty', tOpts),
                            headerFilterOperatorAfter: t('is after', tOpts),
                            headerFilterOperatorOnOrAfter: t('is on or after', tOpts),
                            headerFilterOperatorBefore: t('is before', tOpts),
                            headerFilterOperatorOnOrBefore: t('is on or before', tOpts),
                            headerFilterOperatorIs: t('is', tOpts),
                            'headerFilterOperator=': t('equals', tOpts),
                            'headerFilterOperator!=': t('does not equal', tOpts),
                            'headerFilterOperator>': t('greater than', tOpts),
                            'headerFilterOperator>=': t('greater than or equal to', tOpts),
                            'headerFilterOperator<': t('less than', tOpts),
                            'headerFilterOperator<=': t('less than or equal to', tOpts),
                            columnsManagementSearchTitle: t('Search', tOpts),
                            columnsManagementNoColumns: t('No columns', tOpts),
                            paginationRowsPerPage: t('Rows per page', tOpts),
                            paginationDisplayedRows: ({ from, to, count }) => `${from}–${to} ${t('of', tOpts)} ${count}`,
                            toolbarQuickFilterLabel: t('Search', tOpts),
                            toolbarFiltersTooltipActive: (count) => `${count} ${t(`active filter${count > 1 ? 's' : ''}`, tOpts)}`,
                            columnHeaderSortIconLabel: t('Sort', tOpts),
                            filterPanelOperatorAnd: t('And', tOpts),
                            filterPanelOperatorOr: t('Or', tOpts),
                            noResultsOverlayLabel: t('No results found', tOpts),
                            columnHeaderFiltersTooltipActive: (count) => `${count} ${t(count === 1 ? 'active filter' : 'active filters', tOpts)}`,
                            detailPanelToggle: t("Detail panel toggle", tOpts),
                            checkboxSelectionHeaderName: t('Checkbox selection', tOpts),
                            columnsManagementShowHideAllText: t('Show/Hide all', tOpts),
                            noColumnsOverlayLabel: t('No columns', tOpts),
                            noColumnsOverlayManageColumns: t('Manage columns', tOpts),
                            columnsManagementReset: t('Reset', tOpts),
                            groupColumn: (name) => `${t('Group by', tOpts)} ${name}`,
                            unGroupColumn: (name) => `${t('Ungroup', tOpts)} ${name}`,
                            footerRowSelected: (count) =>
                                count !== 1
                                    ? `${count.toLocaleString()} ${t('items selected', tOpts)}`
                                    : `1 ${t('item selected', tOpts)}`,
                        }}
                        columnHeaderHeight={70}
                        sx={{
                            "& .MuiDataGrid-toolbarContainer": {
                                flexShrink: 0,
                                marginTop: 1,
                                borderBottom: 'none !important'
                            }
                        }}
                    />
                </Box>
                {isOrderDetailModalOpen && selectedOrder && model.OrderModal && (
                    <model.OrderModal
                        orderId={selectedOrder.OrderId}
                        isOpen={true}
                        orderTotal={selectedOrder.OrderTotal}
                        orderDate={selectedOrder.OrderDateTime}
                        orderStatus={selectedOrder.OrderStatus}
                        customerNumber={selectedOrder.CustomerPhoneNumber}
                        customerName={selectedOrder.CustomerName}
                        customerEmail={selectedOrder.CustomerEmailAddress}
                        onClose={handleCloseOrderDetailModal}
                    />
                )}
                {errorMessage && (<DialogComponent open={!!errorMessage} onConfirm={clearError} onCancel={clearError} title="Info" hideCancelButton={true} > {errorMessage}</DialogComponent>)
                }
                {isDeleting && !errorMessage && (<DialogComponent open={isDeleting} onConfirm={handleDelete} onCancel={() => setIsDeleting(false)} title="Confirm Delete"> {`${'Are you sure you want to delete'} ${record?.name}?`}</DialogComponent>)}
            </div >

        </>
    );
}, areEqual);

export default GridBase;