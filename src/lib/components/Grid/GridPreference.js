import React, { useEffect, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Stack, TextField, Typography, Tooltip } from '@mui/material';
import { DataGridPremium, GridActionsCellItem, gridFilterModelSelector, gridSortModelSelector, useGridSelector, useGridApiRef, } from '@mui/x-data-grid-premium';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from '../SnackBar';
import { useTranslation } from 'react-i18next';
import request from './httpRequest';
import { useStateContext, useRouter } from '../useRouter/StateProvider';
import actionsStateProvider from '../useRouter/actions';
import constants from '../constants';

const formTypes = {
    Add: "Add",
    Edit: "Edit",
    Manage: 'Manage'
};

const initialValues = {
    prefName: '',
    prefDesc: '',
    isDefault: false
};

/**
 * Checks if a preference has a valid name for display
 * @param {Object} pref - The preference object to validate
 * @returns {boolean} True if the preference has a valid name, false otherwise
 */
const hasValidPreferenceName = (pref) => {
    return pref.prefName && pref.prefName.trim() !== '';
};

/**
 * Checks if a preference is valid for the management grid (excludes invalid names)
 * @param {Object} pref - The preference object to validate
 * @returns {boolean} True if the preference should be displayed in management grid, false otherwise
 */
const isValidForManagement = (pref) => {
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
        prefName: yup
            .string()
            .required(t('Preference Name is Required', tOpts))
            .test('not-only-whitespace', t('Preference Name cannot contain only whitespace', tOpts),
                value => value && value.trim().length > 0)
            .max(20, t('Maximum Length is 20', tOpts)),
        prefDesc: yup.string().max(100, t('Description maximum length is 100', tOpts))
    });
};

const getGridColumnsFromRef = ({ refColumns, columns }) => {
    const { orderedFields, columnVisibilityModel, lookup } = refColumns;
    const gridColumn = [];
    orderedFields?.forEach(ele => {
        const { field } = lookup[ele];
        let col = columns?.find(ele => ele.field === field) || lookup[ele];
        col = { ...col, width: lookup[ele].width };
        gridColumn.push(col);
    })
    return { gridColumn, columnVisibilityModel }
};

const GridPreferences = ({ t, model, gridRef, columns = [], setIsGridPreferenceFetched, setIsLoading, initialGridRef }) => {
    const { preferenceId: preferenceName } = model;
    const { stateData, dispatchData, removeCurrentPreferenceName, getAllSavedPreferences } = useStateContext();
    const { navigate } = useRouter();
    const apiRef = useGridApiRef();
    const snackbar = useSnackbar();
    const { t: translate, i18n } = useTranslation();
    const tOpts = { t: translate, i18n };
    const [openDialog, setOpenDialog] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [filteredPrefs, setFilteredPrefs] = useState([]);
    const [formType, setFormType] = useState();
    const [menuAnchorEl, setMenuAnchorEl] = useState();
    const [openPreferenceExistsModal, setOpenPreferenceExistsModal] = useState(false);
    const { Username } = stateData?.getUserData ? stateData.getUserData : {};
    const preferences = stateData?.preferences;
    const currentPreference = stateData?.currentPreference;
    const preferenceApi = stateData?.gridSettings?.permissions?.preferenceApi;
    const filterModel = useGridSelector(gridRef, gridFilterModelSelector);
    const sortModel = useGridSelector(gridRef, gridSortModelSelector);
    const validationSchema = useMemo(() => {
        return createValidationSchema(translate, tOpts);
    }, [translate, tOpts]);

    useEffect(() => {
        const filteredPrefs = preferences?.filter(isValidForManagement);
        setFilteredPrefs(filteredPrefs);
    }, [preferences])

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await savePreference(values);
        }
    });

    const handleOpen = (event) => {
        setMenuAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setMenuAnchorEl(null);
    };

    const handleDialogClose = () => {
        setFormType();
        handleClose();
        setOpenDialog(false);
    };

    const handleEditClick = (params) => {
        if (params.id === 0) {
            snackbar.showMessage(translate('Default Preference Can Not Be Edited', tOpts));
            return;
        }
        setFormType(formTypes.Edit);
        formik.setValues(params.row);
        setOpenForm(true);
    };

    const handleDeleteClick = async (params) => {
        if (params.id === 0) {
            snackbar.showMessage(translate('Default Preference Can Not Be Deleted', tOpts));
            return;
        }
        await deletePreference(params.id, params.row?.prefName, params.row?.isDefault);
        getAllSavedPreferences({ preferenceName, history: navigate, dispatchData, Username, preferenceApi });
    };

    const gridColumns = [
        { field: "prefName", type: 'string', width: 300, headerName: translate("Preference Name", tOpts), sortable: false, filterable: false },
        { field: "prefDesc", type: 'string', width: 300, headerName: translate("Preference Description", tOpts), sortable: false, filterable: false },
        { field: "isDefault", type: "boolean", width: 100, headerName: translate("Default", tOpts), sortable: false, filterable: false },
    ];

    const deletePreference = async (id, prefName, isDefault) => {
        let params = {
            action: 'delete',
            id: preferenceName,
            Username,
            prefIdArray: id
        }
        const response = await request({ url: preferenceApi, params, history: navigate, dispatchData });
        if (response === true) {
            if (prefName === currentPreference) {
                removeCurrentPreferenceName({ dispatchData });
            }
            snackbar.showMessage(translate('Preference Deleted Successfully.', tOpts));
            handleDialogClose();
            if (isDefault) {
                await applyPreference(constants.defaultPreferenceId);
            }
        }
    }

    const applySelectedPreference = async (prefId) => {
        if (setIsGridPreferenceFetched) {
            setIsGridPreferenceFetched(false);
        }
        await applyPreference(prefId);
    }

    const savePreference = async (values) => {
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
        const { pinnedColumns } = gridRef.current.state;
        const { gridColumn, columnVisibilityModel } = getGridColumnsFromRef({ refColumns: gridRef.current.state.columns, columns });
        const filter = filterModel?.items?.map(ele => {
            const { field, operator, value } = ele;
            return { field, operator, value }
        })
        filterModel.items = filter;
        let params = {
            action: 'save',
            id: preferenceName,
            prefName: presetName,
            prefDesc: values.prefDesc,
            prefValue: { sortModel, filterModel, columnVisibilityModel, gridColumn, pinnedColumns },
            isDefault: values.isDefault,
        }
        if (values.prefId) {
            params["prefId"] = values.prefId;
        }
        const response = await request({ url: preferenceApi, params, history: navigate, dispatchData });
        if (response === true) {
            snackbar.showMessage(translate('Preference Saved Successfully.', tOpts));
            handleDialogClose();
        }
        getAllSavedPreferences({ preferenceName, Username, history: navigate, dispatchData, preferenceApi });
    }

    const applyPreference = async (prefId) => {
        if (setIsLoading) setIsLoading(true);
        let userPreferenceCharts;
        let currentPreferenceName = '';
        if (prefId > 0) { // If valid preference is selected, then fetch it's details
            const params = {
                action: 'load',
                id: preferenceName,
                prefId
            };
            const response = await request({ url: preferenceApi, params, history: navigate, dispatchData });
            userPreferenceCharts = response?.prefValue ? JSON.parse(response.prefValue) : null;
            if (response.prefValue) {
                currentPreferenceName = response.prefName;
            }
        }
        else {
            // If default preference is selected, then reset to the initial state
            // Use the deep-copied initial state from initialGridRef
            if (!initialGridRef.current) {
                console.error('Initial grid state not captured. Cannot reset to default.');
                if (setIsLoading) setIsLoading(false);
                return;
            }

            const initialState = initialGridRef.current;

            // Reconstruct gridColumn from initial state
            const gridColumn = initialState.columns.orderedFields.map(field => {
                const colData = initialState.columns.lookup[field];
                return {
                    field: field,
                    width: colData?.width,
                    flex: colData?.flex
                };
            });

            userPreferenceCharts = {
                gridColumn: gridColumn,
                columnVisibilityModel: { ...initialState.columns.columnVisibilityModel },
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
            const { gridColumn, columnVisibilityModel, pinnedColumns, sortModel, filterModel } = userPreferenceCharts;
            if (gridRef.current) {
                const gridColumns = gridColumn || gridRef.current.getAllColumns();
                const columnFields = gridColumns.map(column => column.field);

                // Apply column widths
                if (prefId === constants.defaultPreferenceId) {
                    // Reset to initial widths from the captured initial state
                    gridColumns.forEach(col => {
                        const initialColData = initialGridRef.current?.columns?.lookup?.[col.field];
                        if (initialColData && initialColData.width) {
                            gridRef.current.setColumnWidth(col.field, initialColData.width);
                        }
                    });
                } else {
                    // Apply saved widths for custom preferences
                    gridColumn.forEach(({ field, width }) => {
                        if (columnFields.includes(field)) {
                            const columnIndex = gridColumns.findIndex(column => column.field === field);
                            if (columnIndex !== -1 && width) {
                                gridRef.current.setColumnWidth(field, width);
                            }
                        }
                    });
                }

                // Apply all preference settings to the grid
                const orderedFields = gridColumn.map(({ field }) => field).filter(field => columnFields.includes(field));
                gridRef.current.state.columns.orderedFields = orderedFields;
                gridRef.current.setColumnVisibilityModel(columnVisibilityModel);
                gridRef.current.setPinnedColumns(pinnedColumns);
                gridRef.current.setSortModel(sortModel || []);
                gridRef.current.setFilterModel(filterModel);
            }
            dispatchData({ type: actionsStateProvider.SET_CURRENT_PREFERENCE_NAME, payload: currentPreferenceName });
            setIsGridPreferenceFetched(true);
        }
        if (setIsLoading) setIsLoading(false);
    }

    const getGridRowId = (row) => {
        return row['GridPreferenceId'];
    };

    const openModal = (params, openFormModal = true) => {
        setFormType(params);
        handleClose();
        setOpenDialog(true);
        setOpenForm(openFormModal);
        if (openFormModal) {
            formik.resetForm();
        }
    }

    const closeModal = () => {
        setFormType(null);
        handleClose();
        setOpenDialog(false);
    }

    const handleResetPreferences = async () => {
        // Clear current preference for this model from Redux state
        removeCurrentPreferenceName({ dispatchData, model: preferenceName });
        // Apply default preference (this will reset all grid state)
        await applyPreference(constants.defaultPreferenceId);
    };
    
    const onCellClick = async (cellParams, event, details) => {
        let action = cellParams.field === 'editAction' ? actionTypes.Edit : cellParams.field === 'deleteAction' ? actionTypes.Delete : null;
        if (cellParams.id === 0 && (action === actionTypes.Edit || action === actionTypes.Delete)) {
            snackbar.showMessage('Default Preference Can Not Be' + ' ' + `${action === actionTypes.Edit ? 'Edited' : 'Deleted'}`);
            return
        }
        if (action === actionTypes.Edit) {
            setFormType('Modify');
            formik.setValues(cellParams?.row);
            setOpenForm(true);
        }
        if (action === actionTypes.Delete) {
            await deletePreference(cellParams.id, cellParams?.row?.prefName);
            getAllSavedPreferences({ preferenceName, history: navigate, dispatchData, Username, preferenceApi });
        }
    }

    const prefName = formik.values.prefName.trim();

    if (gridColumns.findIndex(col => col.field === 'editAction') === -1 && filteredPrefs?.length > 0) {
        gridColumns.push({
            field: 'editAction',
            type: 'actions',
            headerName: '',
            width: 20,
            getActions: (params) => [
                <GridActionsCellItem
                    key="edit"
                    icon={<Tooltip title={t('Edit', tOpts)}><EditIcon /></Tooltip>}
                    label={t('Edit', tOpts)}
                    color="primary"
                    onClick={() => handleEditClick(params)}
                />
            ]
        });
    }
    if (gridColumns.findIndex(col => col.field === 'deleteAction') === -1 && filteredPrefs?.length > 0) {
        gridColumns.push({
            field: 'deleteAction',
            type: 'actions',
            headerName: '',
            width: 20,
            getActions: (params) => [
                <GridActionsCellItem
                    key="delete"
                    icon={<Tooltip title={t('Delete', tOpts)}><DeleteIcon /></Tooltip>}
                    label={t('Delete', tOpts)}
                    color="error"
                    onClick={() => handleDeleteClick(params)}
                />
            ]
        });
    }

    return (
        <Box>
            <Button
                id="grid-preferences-btn"
                aria-controls={menuAnchorEl ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuAnchorEl ? 'true' : undefined}
                onClick={handleOpen}
                title={t('Preference', tOpts)}
                startIcon={<SettingsIcon />}
            >
                {t('Preferences', tOpts)}
            </Button>
            <Menu
                id={`grid-preference-menu`}
                anchorEl={menuAnchorEl}
                open={!!menuAnchorEl}
                onClose={handleClose}
                component={List}
                dense
                MenuListProps={{
                    'aria-labelledby': 'grid-preferences-btn'
                }}
                sx={{
                    '& .MuiMenu-paper': { minWidth: 240, maxHeight: 320 },
                    '& .MuiListItemSecondaryAction-root': {
                        display: 'flex'
                    },
                    '& .Mui-selected': {
                        color: 'text.primary',
                        '&:hover': {
                            backgroundColor: 'success.main'
                        }
                    }
                }}
            >
                <MenuItem component={ListItemButton} dense onClick={() => openModal(formTypes.Add)}>
                    {t('Add Preference', tOpts)}
                </MenuItem>
                <MenuItem component={ListItemButton} dense divider={preferences?.length > 0} onClick={() => openModal(formTypes.Manage, false)}>
                    {t('Manage Preferences', tOpts)}
                </MenuItem>
                <MenuItem component={ListItemButton} dense divider={preferences?.length > 0} onClick={handleResetPreferences}>
                    {t('Reset Preferences', tOpts)}
                </MenuItem>

                {preferences?.length > 0 && preferences?.filter(pref => pref.prefName !== 'Coolr Default')?.map((ele, key) => {
                    const { prefName, prefDesc, prefId } = ele;
                    return (
                        <MenuItem
                            onClick={() => applySelectedPreference(prefId, key)}
                            component={ListItem}
                            key={`pref-item-${key}`}
                            title={t(prefDesc, tOpts)}
                            dense
                        >
                            <ListItemText primary={t(prefName, tOpts)} />
                        </MenuItem>
                    )
                })}
            </Menu>
            <Dialog open={openDialog} maxWidth={formType === formTypes.Manage ? 'md' : 'sm'} fullWidth>
                <DialogTitle sx={{ backgroundColor: '#e0e0e0', mb: 2 }}>
                    <Stack direction="row" columnGap={2}>
                        <Typography variant="h5" >
                            {formType} {t('Preference', tOpts)}
                        </Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    {openForm && (
                        <Grid
                            component={'form'}
                            onSubmit={formik.handleSubmit}
                            rowGap={2}
                            container
                            sx={{
                                '& .MuiFormLabel-root:not(.MuiTypography-root)': {
                                    fontWeight: 400,
                                    display: 'table',
                                    whiteSpace: 'pre-wrap' /* css-3 */,
                                    wordWrap: 'break-word' /* Internet Explorer 5.5+ */
                                }
                            }}
                        >
                            <Grid item xs={12}>
                                <TextField
                                    defaultValue={t(formik.values.prefName, tOpts)}
                                    variant="outlined"
                                    size="small"
                                    margin="dense"
                                    label={t('Preference Name', tOpts)}
                                    name={'prefName'}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.prefName}
                                    helperText={formik.errors.prefName}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    defaultValue={t(formik.values.prefDesc, tOpts)}
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    size="small"
                                    margin="dense"
                                    label={t('Preference Description', tOpts)}
                                    name={'prefDesc'}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.prefDesc}
                                    helperText={formik.errors.prefDesc}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.isDefault}
                                            name={'isDefault'}
                                            onChange={formik.handleChange}
                                        />
                                    }
                                    label={t('Default', tOpts)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" columnGap={1} style={{ justifyContent: 'end' }}>
                                    <Button
                                        type="submit"
                                        size="small"
                                        startIcon={<SaveIcon />}
                                        color="primary"
                                        variant="contained"
                                        disableElevation
                                    >
                                        {t('Save', tOpts)}
                                    </Button>
                                    <Button
                                        type="button"
                                        startIcon={<CloseIcon />}
                                        color="error"
                                        variant="contained"
                                        size="small"
                                        onClick={handleDialogClose}
                                        disableElevation
                                    >
                                        {t('Close', tOpts)}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}

                    {(openDialog && formType === formTypes.Manage) && (
                        <Grid container>
                            <Grid item xs={12}>
                                <DataGridPremium
                                    sx={{
                                        "& .MuiTablePagination-selectLabel": {
                                            marginTop: 2
                                        },
                                        "& .MuiTablePagination-displayedRows": {
                                            marginTop: 2
                                        },
                                        "& .MuiDataGrid-columnHeader .MuiInputLabel-shrink": {
                                            display: "none"
                                        }
                                    }}
                                    className="pagination-fix"
                                    disablePivoting={true}
                                    columns={gridColumns}
                                    pageSizeOptions={constants.pageSizeOptions}
                                    disableColumnMenu={true}
                                    pagination
                                    localeText={{
                                        noRowsLabel: t("No rows", tOpts),
                                        columnMenuManageColumns: t('Manage columns', tOpts),
                                        columnMenuHideColumn: t('Hide column', tOpts),
                                        pinToLeft: t('Pin to left', tOpts),
                                        pinToRight: t('Pin to right', tOpts),
                                        columnMenuLabel: t('Menu', tOpts),
                                        filterPanelRemoveAll: t('Remove all', tOpts),
                                        columnsPanelTextFieldLabel: t('Find column', tOpts),
                                        columnsPanelTextFieldPlaceholder: t('Column title', tOpts),
                                        columnsPanelShowAllButton: t('Show all', tOpts),
                                        columnsPanelHideAllButton: t('Hide all', tOpts),
                                        booleanCellTrueLabel: t('Yes', tOpts),
                                        toolbarColumnsLabel: t('Select columns', tOpts),
                                        toolbarExportLabel: t('Export', tOpts),
                                        booleanCellFalseLabel: t('No', tOpts),
                                        paginationRowsPerPage: t('Rows per page', tOpts),
                                        paginationDisplayedRows: ({ from, to, count }) => `${from}–${to} ${t('of', tOpts)} ${count}`,
                                        toolbarQuickFilterLabel: t('Search', tOpts),
                                        columnsManagementSearchTitle: t('Search', tOpts),
                                        columnsManagementNoColumns: t('No columns', tOpts)
                                    }}
                                    rowCount={filteredPrefs.length}
                                    rows={filteredPrefs}
                                    getRowId={getGridRowId}
                                    slots={{
                                        headerFilterMenu: false
                                    }}
                                    density="compact"
                                    disableDensitySelector={true}
                                    apiRef={apiRef}
                                    disableAggregation={true}
                                    disableRowGrouping={true}
                                    disableRowSelectionOnClick={true}
                                    rowSelection={false}
                                    initialState={{
                                        pagination: { paginationModel: { pageSize: constants.defaultPageSize, page: 0 } }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                {formType === formTypes.Manage && (
                    <DialogActions>
                        <Button color="error" variant="contained" size="small" onClick={() => closeModal()} disableElevation>
                            {t('Close', tOpts)}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
            <Dialog open={openPreferenceExistsModal} maxWidth='xs' fullWidth>
                <DialogContent sx={{ fontSize: '16px' }}>
                    "{prefName}" {t('name already in use, please use another name.', tOpts)}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', marginTop: '4%' }}>
                    <Button color="success" variant="contained" size="small" onClick={() => setOpenPreferenceExistsModal(false)} disableElevation>
                        {t('Ok', tOpts)}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}


export default GridPreferences;