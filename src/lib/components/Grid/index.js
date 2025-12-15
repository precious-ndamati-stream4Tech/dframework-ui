
import React, { useMemo, useEffect, memo, useRef, useState, useCallback } from 'react';
import {
    DataGridPremium,
    GridToolbarExportContainer,
    getGridDateOperators,
    GRID_CHECKBOX_SELECTION_COL_DEF,
    getGridStringOperators,
    getGridNumericOperators,
} from '@mui/x-data-grid-premium';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/FileCopy';
import EditIcon from '@mui/icons-material/Edit';
import HandymanIcon from '@mui/icons-material/Handyman';
import {
    GridActionsCellItem,
    useGridApiRef
} from '@mui/x-data-grid-premium';
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
import { GridOn, Code, Language, TableChart, DataObject as DataObjectIcon } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { v4 as uuidv4 } from 'uuid';
import utils from '../utils';
import CustomToolbar from './CustomToolbar';
import constants from '../constants';
import ChildGridComponent from './ChildGridComponent';

const defaultPageSize = 10;
const t = utils.t;
const sortRegex = /(\w+)( ASC| DESC)?/i;
const recordCounts = 60000;
const actionTypes = {
    Copy: "Copy",
    Edit: "Edit",
    Delete: "Delete",
    Resolve: "Resolve",
    Assign: "Assign"
};

const booleanIconRenderer = (params) => {
    if (params.value) {
        return <CheckIcon style={{ color: 'green' }} />;
    } else {
        return <CloseIcon style={{ color: 'gray' }} />;
    }
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
    const { t, tOpts } = props;
    // Fallback to t if tTranslate is not provided (for backwards compatibility)
    const tTranslate = t || ((key) => key);
    return (
        <GridToolbarExportContainer {...props}>
            {props?.showOnlyExcelExport !== true && <ExportMenuItem {...props} icon={<GridOn fontSize="small" />} type="CSV" contentType="text/csv" />}
            {props.hideExcelExport === false && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} type="Excel" contentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />}
            {props.showExportWithDetails && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} onExportMenuClick={props.onExportMenuClick} type={tTranslate(props.detailExportLabel, tOpts) || tTranslate("Excel with Details", tOpts)} contentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" isDetailsExport={true} />}
            {props.showExportWithLatestData && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} type={tTranslate("Excel with Latest Data", tOpts)} contentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" isLatestExport={true} />}
            {props.showPivotExportBtn && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} type={tTranslate("Excel with Pivot", tOpts)} contentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" isPivotExport={true} />}
            {props.showInFieldStatusPivotExportBtn && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} type={tTranslate("Excel with In-field Pivot", tOpts)} contentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" isFieldStatusPivotExport={true} />}
            {props.showInstallationPivotExportBtn && <ExportMenuItem {...props} icon={<TableChart fontSize="small" />} type={tTranslate("Excel with Installation Pivot", tOpts)} contentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" isInstallationPivotExport={true} />}
            {props?.showOnlyExcelExport !== true && <>
                {props.hideXmlExport === false && <ExportMenuItem {...props} icon={<Code fontSize="small" />} type="XML" contentType="text/xml" />}
                {props.hideHtmlExport === false && <ExportMenuItem {...props} icon={<Language fontSize="small" />} type="HTML" contentType="text/html" />}
                {props.hideJsonExport === false && <ExportMenuItem {...props} icon={<DataObjectIcon fontSize="small" />} type="JSON" contentType="application/json" />}
            </>}
        </GridToolbarExportContainer>
    );
};

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
};

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
    makeExternalRequest,
    setColumns,
    showModal,
    OrderModal,
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
    selectedClients = null,
    onExportMenuClick,
    onResolveClick,
    onAssignmentClick,
    getRowClassName,
    showExportWithDetails = false,
    showExportWithLatestData = false,
    showInFieldStatusPivotExportBtn = false,
    showInstallationPivotExportBtn = false,
    detailExportLabel = "Excel with Details",
    rowSelectionModel = undefined,
    GlobalFiltersComponent = null,
    customApplyFunction = null,
    globalHeaderFilters = [],
    HeaderFiltersComponent = null,
    updateParentFilters,
    renderField,
    onDataLoaded,
    gridExtraParams,
    afterDataSet,
    importUrl,
    exportUrl,
    exportNote,
    disable,
    openModal,
    setOpenModal,
    manageDataName,
    showExportOption,
    setFetchData,
    childTabTitle,
    gridPivotFilter,
    onDoubleClick,
    additionalFiltersForExport,
    isClientSelected = true,
    showPivotExportBtn = false,
    CustomDialoModal,
    ManageDataComponent
}) => {
    const [paginationModel, setPaginationModel] = useState({ pageSize: defaultPageSize, page: 0 });
    const [data, setData] = useState({ recordCount: 0, records: [], lookups: {} });
    const [isLoading, setIsLoading] = useState(false);
    const forAssignment = !!onAssignChange;
    const rowsSelected = showRowsSelected;
    const [selection, setSelection] = useState({ type: 'include', ids: new Set([]) });
    const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [visibilityModel, setVisibilityModel] = useState({ CreatedOn: false, CreatedByUser: false, ...model?.columnVisibilityModel });
    const [isDeleting, setIsDeleting] = useState(false);
    const [record, setRecord] = useState(null);
    const snackbar = useSnackbar();
    const { t: translate, i18n } = useTranslation()
    const tOpts = { t: translate, i18n };
    const isClient = model.isClient === true ? 'client' : 'server';
    const [errorMessage, setErrorMessage] = useState('');
    const [sortModel, setSortModel] = useState(convertDefaultSort(defaultSort || model?.defaultSort));
    const [isDataFetchedInitially, setIsDataFetchedInitially] = useState(false);
    const initialFilterModel = { items: [], logicOperator: 'and', quickFilterValues: Array(0), quickFilterLogicOperator: 'and' }
    if (model.defaultFilters) {
        initialFilterModel.items = [];
        model.defaultFilters.forEach((ele) => {
            initialFilterModel.items.push(ele);
        })
    }
    const [filterModel, setFilterModel] = useState({ ...initialFilterModel });
    const { pathname, navigate } = useRouter()
    const apiRef = useGridApiRef();
    const initialGridRef = useRef(null);
    const { idProperty = "id", showHeaderFilters = true, disableRowSelectionOnClick = true, createdOnKeepLocal = true, hideBackButton = false, hideTopFilters = true, updatePageTitle = true, isElasticScreen = false, enablePivoting = false, showCreateButton, hideExcelExport = false, hideXmlExport = false, hideHtmlExport = false, hideJsonExport = false, disableRowGrouping = true } = model;
    const isReadOnly = model.readOnly === true;
    const isDoubleClicked = model.doubleClicked === false;
    const customExportRef = useRef();
    const dataRef = useRef(data);
    const showAddIcon = model.showAddIcon === true;
    const toLink = model.columns.some(item => item.link === true);
    const globalSort = globalHeaderFilters?.length ? globalHeaderFilters.filter(ele => ele.isGlobalSort) : [];
    const [groupingModel, setGroupingModel] = useState([]);
    const rowGroupBy = globalSort?.length ? [globalSort[0].field] : [''];
    const groupingModelRef = useRef(null);
    const [isGridPreferenceFetched, setIsGridPreferenceFetched] = useState(false);
    const [columnOrderModel, setColumnOrderModel] = useState([]);
    const columnWidthsRef = useRef({});
    const classes = useStyles();
    const { systemDateTimeFormat, stateData, dispatchData, formatDate, removeCurrentPreferenceName, getAllSavedPreferences, applyDefaultPreferenceIfExists } = useStateContext();
    const modelPermissions = model.modelPermissions || permissions;
    const effectivePermissions = { ...constants.permissions, ...stateData.gridSettings.permissions, ...modelPermissions };
    const { ClientId = 0 } = stateData?.getUserData || {};
    const { Username } = stateData?.getUserData ? stateData.getUserData : {};
    const routesWithNoChildRoute = stateData.gridSettings.permissions?.routesWithNoChildRoute || [];
    const disablePivoting = !enablePivoting;
    const url = stateData?.gridSettings?.permissions?.Url;
    const withControllersUrl = stateData?.gridSettings?.permissions?.withControllersUrl;
    const currentPreference = stateData?.currentPreference === 'CoolR Default' ? null : stateData?.currentPreference;
    const emptyIsAnyOfOperatorFilters = ["isEmpty", "isNotEmpty", "isAnyOf"];
    const filterFieldDataTypes = {
        Number: 'number',
        Numeric: 'numeric',
        String: 'string',
        Boolean: 'boolean'
    };
    const tTranslate = model.tTranslate ?? ((key) => key);

    // GroupBy logic
    const groupBy = stateData?.dataGroupBy || '';
    const { groupBy: modelGroupBy = '' } = model;

    // Child tabs state
    const [parentGridFilter, setParentGridFilter] = useState({});
    const [childGridTitle, setChildGridTitle] = useState();
    const [showChildGrids, setShowChildGrids] = useState(false);
    
    // External header filters state
    const [externalHeaderFilters, setExternalHeaderFilters] = useState(model?.initialHeaderFilters || {});
    const [headerFilters, setHeaderFilters] = useState(model?.initialHeaderFilterValues || []);

    const OrderSuggestionHistoryFields = {
        OrderStatus: 'OrderStatusId'
    }
    const preferenceApi = stateData?.gridSettings?.permissions?.preferenceApi;
    const gridColumnTypes = {
        "radio": {
            "type": "singleSelect",
            "valueOptions": "lookup"
        },
        "string": {
            "filterOperators": getGridStringOperators().filter(op => !['doesNotContain', 'doesNotEqual'].includes(op.value))
        },
        "number": {
            "filterOperators": getGridNumericOperators().filter(op => !['!='].includes(op.value))
        },
        "numeric": {
            "filterOperators": getGridNumericOperators().filter(op => !['!='].includes(op.value))
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
    }, [data, onDataLoaded]);

    // Handle Group By changes from global filters
    useEffect(() => {
        if (disableRowGrouping || !globalSort.length || groupingModelRef.current === globalSort[0].field) {
            // Clear grouping if no globalSort and previously had grouping
            if (!globalSort.length && groupingModelRef.current !== null) {
                setGroupingModel([]);
                setSortModel(convertDefaultSort(defaultSort || model?.defaultSort));
                groupingModelRef.current = null;
            }
            return;
        }
        const { field, sort } = globalSort[0];
        setGroupingModel([field]);
        setSortModel([{ field: field, sort: sort }]);
        groupingModelRef.current = field;
    }, [JSON.stringify(globalSort), disableRowGrouping]);

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
        const baseColumnList = columns || model?.gridColumns || model?.columns;
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
            // Enable row grouping for columns when not disabled
            if (!disableRowGrouping) {
                overrides.groupable = column.groupable;
            }
            // Disable filtering for the currently grouped column
            overrides.filterable = column.filterable === false ? false : (column.field !== groupingModelRef.current);
            
            // Apply custom label processor if available
            if (model.customLabelProcessor && typeof model.customLabelProcessor === 'function') {
                column.label = model.customLabelProcessor({ column, t: tTranslate, tOpts });
            }
            
            finalColumns.push({ headerName: tTranslate(column.headerName || column.label, tOpts), ...column, ...overrides });
            if (column.pinned) {
                pinnedColumns[column.pinned === 'right' ? 'right' : 'left'].push(column.field);
            }
            lookupMap[column.field] = column;
            column.label = column?.label
        }

        const auditColumns = model.standard === true;

        if (auditColumns && model?.addCreatedModifiedColumns !== false) {
            if (model?.addCreatedOnColumn !== false) {
                finalColumns.push(
                    {
                        field: "CreatedOn", type: "dateTime", headerName: "Created On", width: 200, filterOperators: LocalizedDatePicker({ columnType: "date" }), valueFormatter: gridColumnTypes.dateTime.valueFormatter, keepLocal: true
                    }
                );
            }
            if (model?.addCreatedByColumn !== false) {
                finalColumns.push(
                    { field: "CreatedByUser", type: "string", headerName: "Created By", width: 200 },
                );
            }
            if (model?.addModifiedOnColumn !== false) {
                finalColumns.push(
                    {
                        field: "ModifiedOn", type: "dateTime", headerName: "Modified On", width: 200, filterOperators: LocalizedDatePicker({ columnType: "date" }), valueFormatter: gridColumnTypes.dateTime.valueFormatter, keepLocal: true

                    }
                );
            }
            if (model?.addModifiedByColumn !== false) {
                finalColumns.push(
                    { field: "ModifiedByUser", type: "string", headerName: "Modified By", width: 200 }
                );
            }
        }

        if (!forAssignment && !isReadOnly) {
            const actionsLength = [
                effectivePermissions.edit,
                effectivePermissions.add,
                effectivePermissions.delete,
                effectivePermissions.resolve,
                effectivePermissions.assign
            ].filter(Boolean).length;

            if (actionsLength > 0) {
                finalColumns.push({
                    headerName: tTranslate("Actions", tOpts),
                    field: 'actions',
                    type: 'actions',
                    label: '',
                    width: actionsLength * (model.actionWidth || 50),
                    getActions: (params) => {
                        const useCustomActions = model.isCustomActionsGrid || false;
                        const actions = [];

                        // Resolve action (first - only for custom actions)
                        if (useCustomActions && effectivePermissions.resolve && onResolveClick) {
                            actions.push(
                                <GridActionsCellItem
                                    key="resolve"
                                    icon={<Tooltip title={tTranslate("Resolve", tOpts)}><HandymanIcon fontSize="medium" /></Tooltip>}
                                    label="Resolve"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onResolveClick({ record: params.row });
                                    }}
                                />
                            );
                        }

                        // Delete action (second)
                        if (effectivePermissions.delete) {
                            actions.push(
                                <GridActionsCellItem
                                    key="delete"
                                    icon={<Tooltip title={tTranslate("Delete", tOpts)}><DeleteIcon fontSize="medium" /></Tooltip>}
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
                        if (effectivePermissions.add) {
                            actions.push(
                                <GridActionsCellItem
                                    key="copy"
                                    icon={<Tooltip title={tTranslate("Copy", tOpts)}><CopyIcon fontSize="medium" /></Tooltip>}
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
                                    icon={<Tooltip title={tTranslate("Edit", tOpts)}><EditIcon fontSize="medium" /></Tooltip>}
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
                        if (useCustomActions && effectivePermissions.assign && onAssignmentClick) {
                            actions.push(
                                <GridActionsCellItem
                                    key="assign"
                                    icon={<Tooltip title={tTranslate("Assign", tOpts)}><span style={{ fontSize: "medium" }}>{tTranslate('Assign', tOpts)}</span></Tooltip>}
                                    label="Assign"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAssignmentClick({ record: params.row });
                                    }}
                                />
                            );
                        }

                        return actions;
                    }
                });
                pinnedColumns.right.push('actions');
            }
        }

        return { gridColumns: finalColumns, pinnedColumns, lookupMap };
    }, [columns, model, parent, permissions, forAssignment, rowGroupBy]);
    const fetchData = (action = "list", extraParams = {}, contentType, columns, isPivotExport, isElasticExport, isDetailsExport = false, isLatestExport = false, isFieldStatusPivotExport = false, isInstallationPivotExport = false) => {
        const { pageSize, page } = paginationModel;
        let gridApi = `${model.controllerType === 'cs' ? withControllersUrl : url}${model.api || api}`

        let controllerType = model?.controllerType;
        const isPivotGrid = model?.isPivotGrid || false;
        if (isPivotExport) {
            gridApi = `${withControllersUrl}${model?.pivotAPI}`;
            controllerType = 'cs';
        }
        if (assigned || available) {
            extraParams[assigned ? "include" : "exclude"] = Array.isArray(selected) ? selected.join(',') : selected;
        }
        let filters = { ...filterModel }, finalFilters = { ...filterModel };
        if (chartFilters?.items?.length > 0) {
            let { columnField: field, operatorValue: operator } = chartFilters.items[0];
            field = constants.chartFilterFields[field];
            const chartFilter = [{ field: field, operator: operator, isChartFilter: false }];
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

        // Process external header filters
        if (model?.initialHeaderFilterValues) {
            const filtersWithIds = model.initialHeaderFilterValues.map((filter, index) => ({
                ...filter,
                id: filter.id || filter.field || `filter-${Date.now()}-${index}`
            }));
            finalFilters.items = [...finalFilters.items, ...filtersWithIds];
        }

        if (headerFilters?.length) {
            const filtersWithIds = headerFilters.map((filter, index) => ({
                ...filter,
                id: filter.id || filter.field || `filter-${Date.now()}-${index}`
            }));
            finalFilters.items = [...finalFilters.items, ...filtersWithIds];
        }

        // Handle client selection - if selectedClients is provided, use it; otherwise default to current ClientId
        const applyDefaultClientFilter = model.applyDefaultClientFilter !== false;
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

        if (model?.globalFilters?.gridExternalFilters) {
            const externalFilters = globalHeaderFilters.filter(filter => filter.isExternalFilter);
            if (externalFilters?.length) {
                finalFilters.items = [...finalFilters.items, ...externalFilters]
            }
        }
        
        // Process external header filters
        if (model?.initialHeaderFilterValues) {
            const headerFilterItems = headerFilters.map((filter, index) => ({
                id: filter.id || filter.field || `filter-${Date.now()}-${index}`,
                field: filter.field,
                operator: filter.operator,
                value: filter.value,
                type: filter.type
            }));
            finalFilters.items = [...finalFilters.items, ...headerFilterItems];
        }

        // Add client filter to extraParams if clients are selected
        if (clientsSelected && clientsSelected.length > 0 && model.isClient) {
            extraParams.ClientId = clientsSelected.join(',');
        }

        // Merge gridExtraParams into extraParams
        if (gridExtraParams) {
            Object.assign(extraParams, gridExtraParams);
        }

        if (model.updateSortFields) {
            model.updateSortFields({ sort: sortModel, groupBy });
        }

        if (model.updateFilterFields) {
            finalFilters = model.updateFilterFields({ filter: finalFilters, groupBy });
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
            selectedClients: clientsSelected,
            activeClients: selectedClients?.length ? selectedClients : [Number(ClientId)].filter(ele => ele !== 0),
            columns,
            template: isPivotExport ? model?.template : null,
            configFileName: isPivotExport ? model?.configFileName : null,
            dispatchData,
            showFullScreenLoader,
            history: navigate,
            baseFilters,
            isElasticExport,
            globalFilters,
            tOpts,
            tTranslate,
            groupBy: isPivotGrid ? [groupBy] : modelGroupBy,
            afterDataSet,
            setColumns,
            setIsDataFetchedInitially,
            isDataFetchedInitially,
            fromSelfServe: false,
            isDetailsExport: isDetailsExport,
            setFetchData,
            isChildGrid: model?.isChildGrid,
            isPivotGrid,
            isPivotExport,
            gridPivotFilter,
            isLatestExport,
            payloadFilter: null,
            isFieldStatusPivotExport,
            isInstallationPivotExport,
            additionalFiltersForExport: additionalFiltersForExport,
            uiClientIds: isPivotExport && Array.isArray(clientsSelected) && clientsSelected.join(','),
            exportFileName: tTranslate(model?.exportFileName || model?.title, tOpts),
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
        if (model?.formURL) {
            path = model.formURL + id;
        }
        navigate(path);
    };
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
            fetchData("list", {}, null, null, false, false);
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
            fetchData("list", {}, null, null, false, false);
            if (updateParentFilters) {
                updateParentFilters(model?.initialHeaderFilters || {});
            }
        }
    };
    
    const onCellClickHandler = async (cellParams, event, details) => {
        // Call onCellClick and return early if result is not false
        if (onCellClick) {
            const result = await onCellClick({ cellParams, event, details, row: cellParams?.row });
            if (result !== false) {
                return;
            }
        }

        const { row: record } = cellParams;
        const columnConfig = lookupMap[cellParams.field] || {};

        if (!isReadOnly) {
            if (columnConfig.linkTo) {
                navigate({
                    pathname: template.replaceTags(columnConfig.linkTo, record)
                });
                return;
            }
            
            // Handle link column click for edit
            if (useLinkColumn && cellParams.field === model.linkColumn) {
                return openForm(record[idProperty]);
            }
        }

        if (isReadOnly && toLink) {
            if (model?.isAcostaController && onCellClick && cellParams.colDef.customCellClick === true) {
                onCellClick(cellParams.row);
                return;
            }
            let historyObject = {
                pathname: template.replaceTags(columnConfig.linkTo, record),
            };
            navigate(historyObject);
        }

        // Handle child tabs linking (outside isReadOnly check)
        if (model?.childTabLinkingKey?.length) {
            const includeFilter = {};
            let title = [];
            for (const column of model?.columns) {
                const keyName = model?.childParentKeyMapping[column.field];
                if (model.childTabLinkingKey.includes(keyName)) {
                    includeFilter[keyName] = record[keyName];
                    title.push(record[column.field]);
                    if (column.field === cellParams.field) {
                        break;
                    }
                }
            }
            title = title.join(' - ');
            setParentGridFilter(includeFilter);
            if (!showChildGrids) {
                setShowChildGrids(true);
            }
            setChildGridTitle(title);
        }
    };

    const handleDelete = async function () {
        debugger;
        let gridApi = `${model.controllerType === 'cs' ? withControllersUrl : url}${model.api || api}`
        const result = await deleteRecord({ id: record?.id, api: gridApi, setIsLoading, setError: snackbar.showError, setErrorMessage, tTranslate, tOpts, modelConfig: model });
        if (result === true) {
            setIsDeleting(false);
            snackbar.showMessage(tTranslate('Record Deleted Successfully.', tOpts));
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
        const currentFields = new Set(columnOrderModel);
        const newFields = gridColumns.map(col => col.field).filter(field => !currentFields.has(field));
        if (newFields.length > 0) {
            setColumnOrderModel(prev => [...prev, ...newFields]);
        }
    }, [gridColumns, columnOrderModel.length]);

    // Synchronize columnOrderModel with grid's orderedFields to maintain column order consistency
    const prevOrderedFieldsRef = useRef([]);
    useEffect(() => {
        const currentOrderedFields = apiRef.current?.state?.columns?.orderedFields || [];
        const prevOrderedFields = prevOrderedFieldsRef.current;

        // Check if orderedFields actually changed
        if (currentOrderedFields.length !== prevOrderedFields.length ||
            !currentOrderedFields.every((field, index) => field === prevOrderedFields[index])) {

            prevOrderedFieldsRef.current = [...currentOrderedFields];
            setColumnOrderModel(currentOrderedFields);
        }
    });

    useEffect(() => {
        const loadPreferences = async () => {
            if (model.preferenceId) {
                removeCurrentPreferenceName({ dispatchData });
                getAllSavedPreferences({ preferenceName: model.preferenceId, history: navigate, dispatchData, Username, preferenceApi });
                const appliedPreference = await applyDefaultPreferenceIfExists({ preferenceName: model.preferenceId, history: navigate, dispatchData, Username, gridRef: apiRef, setIsGridPreferenceFetched, preferenceApi });
                
                // Update React states to match the applied preference
                if (appliedPreference && apiRef.current) {
                    if (appliedPreference.sortModel) {
                        setSortModel(appliedPreference.sortModel);
                    }
                    if (appliedPreference.filterModel) {
                        setFilterModel(appliedPreference.filterModel);
                    }
                    if (appliedPreference.columnOrder) {
                        setColumnOrderModel(appliedPreference.columnOrder);
                    }
                    if (appliedPreference.columnVisibilityModel) {
                        // Use API to set column visibility instead of controlled state
                        apiRef.current.setColumnVisibilityModel(appliedPreference.columnVisibilityModel);
                    }
                }
            } else {
                setIsGridPreferenceFetched(true);
            }
        };
        
        loadPreferences();
    }, [])

    // Load initial column widths from grid API after preferences are applied
    useEffect(() => {
        if (isClientSelected && isGridPreferenceFetched && apiRef.current) {
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

    // Filter out globalHeaderFilters with isGlobalSort flag from dependencies
    // Group By changes are handled separately in their own useEffect to update groupingModel
    const filteredDependencies = useMemo(() => {
        const removeGlobalSort = Array.isArray(globalHeaderFilters) ? globalHeaderFilters.filter((f) => !f.isGlobalSort) : [];
        return removeGlobalSort;
    }, [globalHeaderFilters]);

    // Build dependency array similar to frontend implementation
    const commonDependencies = [api, gridColumns, model, parentFilters, assigned, selected, available, chartFilters, isGridPreferenceFetched, reRenderKey, filteredDependencies, renderField, selectedClients];

    const gridDependencyArray = useMemo(() => {
        return model?.isClient
            ? commonDependencies
            : [paginationModel, sortModel, filterModel, ...commonDependencies];
    }, [model?.isClient, paginationModel, sortModel, filterModel, ...commonDependencies]);

    // Use ref to track previous stringified dependencies for deep comparison
    const previousGridDependencyRef = useRef(JSON.stringify(gridDependencyArray));

    useEffect(() => {
        if (isGridPreferenceFetched) {
            const currentGridDependencyArray = JSON.stringify(gridDependencyArray);
            
            // Only fetch if dependencies actually changed
            if (previousGridDependencyRef.current !== currentGridDependencyArray) {
                previousGridDependencyRef.current = currentGridDependencyArray;
                fetchData();
            }
        }
    }, [gridDependencyArray, isGridPreferenceFetched])

    useEffect(() => {
        if (forAssignment || !updatePageTitle) {
            return;
        }
        dispatchData({ type: actionsStateProvider.PAGE_TITLE_DETAILS, payload: { icon: "", titleHeading: model?.pageTitle || model?.title, titleDescription: model?.titleDescription, title: model?.title } })
        return () => {
            dispatchData({
                type: actionsStateProvider.PAGE_TITLE_DETAILS, payload: null
            })
        }
    }, [])

    useEffect(() => {
        if (makeExternalRequest && typeof makeExternalRequest === 'function') {
            makeExternalRequest();
        }
    }, []);

    useEffect(() => {
        let backRoute = pathname;

        // we do not need to show the back button for these routes
        if (hideBackButton || routesWithNoChildRoute.includes(backRoute)) {
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
    const handleColumnWidthChange = useCallback((params) => {
        // Store immediately without triggering re-render
        columnWidthsRef.current = {
            ...columnWidthsRef.current,
            [params.colDef.field]: params.width
        };
    }, []);

    const updateFilters = (e) => {
        const { items } = e;
        const updatedItems = items.map(item => {
            const { field, operator, type, value } = item;
            const column = gridColumns.find(col => col.field === field);
            const columnType = column?.type;
            const isNumber = ['number', 'numeric'].includes(column?.type);

            if (field === OrderSuggestionHistoryFields.OrderStatus) {
                const { filterField, ...newItem } = item;
                return newItem;
            }

            if ((emptyIsAnyOfOperatorFilters.includes(operator)) || (isNumber && !isNaN(value)) || ((!isNumber))) {
                const isKeywordField = isElasticScreen && gridColumns.filter(element => element.field === item.field)[0]?.isKeywordField;
                if (isKeywordField) {
                    item.filterField = `${item.field}.keyword`;
                }
                if (column?.useCustomFilterField) {
                    item.filterField = renderField;
                } else {
                    item.filterField = null;
                }
                item.type = columnType;
                return item;
            }
            const updatedValue = isNumber ? null : value;
            return { field, operator, type: columnType, value: updatedValue };
        });
        e.items = updatedItems;
        setFilterModel(e);
        if (e?.items?.findIndex(ele => ele.isChartFilter && !(['isEmpty', 'isNotEmpty'].includes(ele.operator))) === -1) {
            if (clearChartFilter) {
                clearChartFilter();
            }
        }
        if (chartFilters?.items?.length > 0) {
            if (e.items.length === 0) {
                if (clearChartFilter) {
                    clearChartFilter();
                }
            } else {
                const chartFilterIndex = chartFilters?.items.findIndex(ele => ele.columnField === e.items[0].field);
                if (chartFilterIndex > -1) {
                    if (clearChartFilter) {
                        clearChartFilter();
                    }
                }
            }
        }
    };

    const updateSort = (e) => {
        if (e[0]) {
            if (constants.gridGroupByColumnName.includes(e[0].field)) {
                snackbar.showMessage(tTranslate('Group By is applied on the same column, please remove it in order to apply sorting.'));
                return;
            }
        }
        const sort = e.map((ele) => {
            const isKeywordField = isElasticScreen && gridColumns.filter(element => element.field === ele.field)[0]?.isKeywordField
            return { ...ele, filterField: isKeywordField ? `${ele.field}.keyword` : ele.field };
        })
        setSortModel(sort);
    }

    const orderedColumns = useMemo(() => {
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
        // After preferences are loaded, prefer the grid's orderedFields
        const orderedFields = apiRef.current?.state?.columns?.orderedFields;
        const orderToUse = (isGridPreferenceFetched && orderedFields && Array.isArray(orderedFields) && orderedFields.length > 0) 
            ? orderedFields 
            : (columnOrderModel && columnOrderModel.length > 0 ? columnOrderModel : orderedFields);

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
    }, [gridColumns, columnOrderModel, isGridPreferenceFetched, apiRef.current?.state?.columns?.orderedFields]);
    const hideFooter = model.showFooter === false;
    return (
        <>
            {model?.globalFilters?.filterConfig?.length && GlobalFiltersComponent && (
                <GlobalFiltersComponent
                    filterGroupByConfig={model.globalFilters}
                    addExternalClientDependency={model?.addExternalClientDependency}
                    customApplyFunction={customApplyFunction}
                />
            )}
            {model?.externalHeaderFilters && HeaderFiltersComponent ? (
                <div style={{ marginBottom: 10, display: 'flex', paddingTop: 10, paddingBottom: 10 }}>
                    <HeaderFiltersComponent 
                        model={model} 
                        onHandleChange={externalFilterHandleChange} 
                        values={externalHeaderFilters} 
                        onApplyClick={onExternalFiltersApplyClick} 
                        onResetClick={onExternalFiltersResetClick} 
                    />
                </div>
            ) : null}
            <div style={gridStyle || customStyle}>
                <Box className={`grid-parent-container`}>
                    <DataGridPremium
                        showToolbar
                        headerFilters={showHeaderFilters}
                        checkboxSelection={forAssignment}
                        loading={isLoading}
                        className="pagination-fix"
                        onCellClick={onCellClickHandler}
                        onCellDoubleClick={onCellDoubleClick}
                        columns={orderedColumns}
                        onColumnOrderChange={handleColumnOrder}
                        onColumnWidthChange={handleColumnWidthChange}
                        paginationModel={paginationModel}
                        pageSizeOptions={[5, 10, 20, 50, 100]}
                        onPaginationModelChange={setPaginationModel}
                        pagination
                        rowCount={data.recordCount || 0}
                        rows={data.records || []}
                        sortModel={sortModel}
                        paginationMode={isClient}
                        sortingMode={isClient}
                        filterMode={isClient}
                        disablePivoting={disablePivoting}
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
                                CustomExportButton,
                                showExportWithDetails,
                                showExportWithLatestData,
                                showPivotExportBtn,
                                showInFieldStatusPivotExportBtn,
                                showInstallationPivotExportBtn,
                                detailExportLabel,
                                effectivePermissions,
                                tTranslate
                            },
                            footer: {
                                pagination: true,
                                apiRef,
                                tTranslate
                            },
                            pagination: {
                                backIconButtonProps: {
                                    title: tTranslate('Go to previous page', tOpts),
                                    'aria-label': tTranslate('Go to previous page', tOpts),
                                },
                                nextIconButtonProps: {
                                    title: tTranslate('Go to next page', tOpts),
                                    'aria-label': tTranslate('Go to next page', tOpts),
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
                        rowGroupingModel={groupingModel}
                        disableRowSelectionOnClick={disableRowSelectionOnClick}
                        initialState={{
                            columns: {
                                columnVisibilityModel: visibilityModel
                            },
                            pinnedColumns: pinnedColumns
                        }}
                        localeText={{
                            noRowsLabel: t('No data', tOpts),
                            footerTotalRows: `${t('Total rows', tOpts)}:`,
                            MuiTablePagination: {
                                labelRowsPerPage: t('Rows per page', tOpts),
                                labelDisplayedRows: ({ from, to, count }) => `${from}–${to} ${t('of', tOpts)} ${count}`,
                            },
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
                {model?.childTabs ?
                    <div>
                        <ChildGridComponent tabs={model?.childTabs} selected={parentGridFilter} hideChildGrids={() => setShowChildGrids(false)} childGridTitle={childGridTitle} showChildGrids={showChildGrids} />
                    </div>
                    : null}
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
                {openModal &&
                    <CustomDialoModal open={openModal} onClose={() => { setOpenModal(false) }} dialogTitle={t(`Manage Data - ${manageDataName}`, tOpts)} footerTitle={t(`You can edit, add data to the file and import it back to see the updates`, tOpts)} maxWidth="md" dividers={true} hideFooter={true} >
                        <ManageDataComponent importUrl={importUrl} exportUrl={exportUrl} action={manageDataName} exportNote={exportNote} disable={disable} fetchData={fetchData} apiRef={apiRef} data={data} showExportOption={showExportOption} />
                    </CustomDialoModal>}
            </div >

        </>
    );
}, areEqual);

export default GridBase;