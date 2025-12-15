import React, { useEffect, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Stack, TextField, Typography, Tooltip } from '@mui/material';
import { DataGridPremium, GridActionsCellItem, gridFilterModelSelector, gridSortModelSelector, useGridSelector, useGridApiRef, } from '@mui/x-data-grid-premium';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from '../SnackBar';
import { useTranslation } from 'react-i18next';
import request from './httpRequest';
// import { useRouter } from '../useRouter/useRouter';
import { useStateContext, useRouter } from '../useRouter/StateProvider';
import actionsStateProvider from '../useRouter/actions';
import constants from '../constants';

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
 * Checks if a preference is valid for the management grid (excludes invalid names and CoolR Default)
 * @param {Object} pref - The preference object to validate
 * @returns {boolean} True if the preference should be displayed in management grid, false otherwise
 */
const isValidForManagement = (pref) => {
    // Exclude default preference (prefId === 0) and "CoolR Default" preference
    if (pref.prefId === 0 || pref.prefId === constants.defaultPreferenceId) {
        return false;
    }
    const prefNameLower = pref.prefName?.toLowerCase().trim();
    if (prefNameLower === 'coolr default') {
        return false;
    }
    return true
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

const initialValues = {
    prefName: '',
    prefDesc: '',
    isDefault: false
};

let coolrDefaultPreference = 'CoolR Default';

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

const GridPreferences = ({ tTranslate = (key) => key, model, gridRef, columns = [], setIsGridPreferenceFetched, setIsLoading, initialGridRef }) => {
    const { preferenceId: preferenceName } = model;
    const { stateData, dispatchData, removeCurrentPreferenceName, getAllSavedPreferences } = useStateContext();
    const { navigate } = useRouter();
    const apiRef = useGridApiRef();
    const snackbar = useSnackbar();
    const { t: translate, i18n } = useTranslation();
    const tOpts = { t: translate, i18n };
    const [openDialog, setOpenDialog] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [formType, setFormType] = useState();
    const [menuAnchorEl, setMenuAnchorEl] = useState();
    const [openPreferenceExistsModal, setOpenPreferenceExistsModal] = useState(false);
    const { Username } = stateData?.getUserData ? stateData.getUserData : {};
    const preferences = stateData?.preferences?.filter(isValidForManagement) || [];
    const currentPreference = stateData?.currentPreference;
    const preferenceApi = stateData?.gridSettings?.permissions?.preferenceApi;
    const filterModel = useGridSelector(gridRef, gridFilterModelSelector);
    const sortModel = useGridSelector(gridRef, gridSortModelSelector);
    const validationSchema = useMemo(() => {
        return createValidationSchema(tTranslate, tOpts);
    }, [tTranslate, tOpts]);

    // Dynamically generate columns for the preferences grid
    const gridColumns = useMemo(() => {
        const baseColumns = [
            { field: 'prefName', headerName: tTranslate('Preference Name', tOpts), flex: 1 },
            { field: 'prefDesc', headerName: tTranslate('Preference Description', tOpts), flex: 1 },
            {
                field: 'isDefault',
                headerName: tTranslate('Default', tOpts),
                width: 100,
                type: 'boolean'
            }
        ];

        // Only add action columns if there are valid preferences to manage
        if (preferences && preferences.length > 0) {
            baseColumns.push(
                {
                    field: 'editAction',
                    headerName: '',
                    width: 50,
                    sortable: false,
                    filterable: false,
                    disableColumnMenu: true,
                    renderCell: (params) => (
                        <IconButton size="small" onClick={() => handleEditClick(params)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    )
                },
                {
                    field: 'deleteAction',
                    headerName: '',
                    width: 50,
                    sortable: false,
                    filterable: false,
                    disableColumnMenu: true,
                    renderCell: (params) => (
                        <IconButton size="small" onClick={() => handleDeleteClick(params)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )
                }
            );
        }

        return baseColumns;
    }, [preferences, tTranslate, tOpts]);

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

    const deletePreference = async (id, prefName) => {
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
            snackbar.showMessage('Preference Deleted Successfully.');
            handleDialogClose();
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
            snackbar.showMessage('Preference Saved Successfully.');
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
            const response = await request({ url: preferenceApi, params, history: navigate, dispatchData, disableLoader: true });
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
            // Keep currentPreferenceName as empty string for default - no preference name should be displayed

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
            dispatchData({ type: actionsStateProvider.SET_CURRENT_PREFERENCE_NAME, payload: { model: preferenceName, currentPreference: currentPreferenceName } });
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
        // Clear current preference for this model from state
        removeCurrentPreferenceName({ dispatchData, model: preferenceName });
        // Apply default preference (this will reset all grid state)
        await applyPreference(constants.defaultPreferenceId);
    };

    const handleEditClick = (params) => {
        if (params.id === 0) {
            snackbar.showMessage(tTranslate('Default Preference Can Not Be Edited', tOpts));
            return;
        }
        setFormType(formTypes.Edit);
        formik.setValues(params.row);
        setOpenForm(true);
    };

    const handleDeleteClick = async (params) => {
        if (params.id === 0) {
            snackbar.showMessage(tTranslate('Default Preference Can Not Be Deleted', tOpts));
            return;
        }
        await deletePreference(params.id, params.row?.prefName);
        getAllSavedPreferences({ preferenceName, Username, history: navigate, dispatchData, preferenceApi });
    };

    const onCellClick = async (cellParams, event, details) => {
        const action = cellParams.field;
        if (action === 'editAction') {
            handleEditClick(cellParams);
        } else if (action === 'deleteAction') {
            await handleDeleteClick(cellParams);
        }
    }

    return (
        <Box>
            <Button
                id="grid-preferences-btn"
                aria-controls={menuAnchorEl ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuAnchorEl ? 'true' : undefined}
                onClick={handleOpen}
                title={tTranslate('Preference', tOpts)}
                startIcon={<SettingsIcon />}
            >
                {tTranslate('Preferences', tOpts)}
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
                    {tTranslate('Add Preference', tOpts)}
                </MenuItem>
                <MenuItem component={ListItemButton} dense onClick={() => openModal(formTypes.Manage, false)}>
                    {tTranslate('Manage Preferences', tOpts)}
                </MenuItem>
                <MenuItem component={ListItemButton} dense divider={preferences?.length > 0} onClick={handleResetPreferences}>
                    {tTranslate('Reset Preferences', tOpts)}
                </MenuItem>

                {preferences.map((ele, key) => {
                    const { prefName, prefDesc, prefId } = ele;
                    return (
                        <MenuItem
                            onClick={() => applySelectedPreference(prefId, key)}
                            component={ListItem}
                            key={`pref-item-${key}`}
                            title={tTranslate(prefDesc, tOpts)}
                            dense
                        >
                            <ListItemText primary={tTranslate(prefName, tOpts)} />
                        </MenuItem>
                    )
                })}
            </Menu>
            <Dialog open={openDialog} maxWidth={formType === formTypes.Manage ? 'md' : 'sm'} fullWidth>
                <DialogTitle sx={{ backgroundColor: '#e0e0e0', mb: 2 }}>
                    <Stack direction="row" columnGap={2}>
                        <Typography variant="h5" >
                            {formType} {tTranslate('Preference', tOpts)}
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
                                    defaultValue={tTranslate(formik.values.prefName, tOpts)}
                                    variant="outlined"
                                    size="small"
                                    margin="dense"
                                    label={tTranslate('Preference Name', tOpts)}
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
                                    defaultValue={tTranslate(formik.values.prefDesc, tOpts)}
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    size="small"
                                    margin="dense"
                                    label={tTranslate('Preference Description', tOpts)}
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
                                    label={tTranslate('Default', tOpts)}
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
                                        {tTranslate('Save', tOpts)}
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
                                        {tTranslate('Close', tOpts)}
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
                                    onCellClick={onCellClick}
                                    columns={gridColumns}
                                    pageSizeOptions={constants.pageSizeOptions}
                                    pagination
                                    rowCount={preferences.length}
                                    rows={preferences}
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
                                    autoHeight
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 10
                                            }
                                        }
                                    }}
                                    localeText={{
                                        toolbarColumnsLabel: tTranslate('Select columns', tOpts),
                                        toolbarExportLabel: tTranslate('Export', tOpts),
                                        booleanCellFalseLabel: tTranslate('No', tOpts),
                                        paginationRowsPerPage: tTranslate('Rows per page', tOpts),
                                        paginationDisplayedRows: ({ from, to, count }) => `${from}–${to} ${tTranslate('of', tOpts)} ${count}`,
                                        toolbarQuickFilterLabel: tTranslate('Search', tOpts),
                                        columnsManagementSearchTitle: tTranslate('Search', tOpts)
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                {formType === formTypes.Manage && (
                    <DialogActions>
                        <Button color="error" variant="contained" size="small" onClick={() => closeModal()} disableElevation>
                            {tTranslate('Close', tOpts)}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
            <Dialog open={openPreferenceExistsModal} maxWidth='xs' fullWidth>
                <DialogContent sx={{ fontSize: '16px' }}>
                    "{formik.values.prefName?.trim()}" {tTranslate('name already in use, please use another name.', tOpts)}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', marginTop: '4%' }}>
                    <Button color="success" variant="contained" size="small" onClick={() => setOpenPreferenceExistsModal(false)} disableElevation>
                        {tTranslate('Ok', tOpts)}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}


export default GridPreferences;