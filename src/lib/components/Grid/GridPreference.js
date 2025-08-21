import React, { useEffect, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Checkbox, FormControlLabel, Grid, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Stack, TextField, Typography, Tooltip, ListItemIcon } from '@mui/material';
import { DataGridPremium, GridActionsCellItem, gridFilterModelSelector, gridSortModelSelector, useGridSelector, useGridApiRef } from '@mui/x-data-grid-premium';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from '../SnackBar';
import { useTranslation } from 'react-i18next';
import request from './httpRequest';
import { useStateContext, useRouter } from '../useRouter/StateProvider';
import actionsStateProvider from '../useRouter/actions';
import { DialogComponent } from '../Dialog';

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

const gridColumns = [
    { field: "prefName", type: 'string', width: 300, headerName: "Preference Name", sortable: false, filterable: false },
    { field: "prefDesc", type: 'string', width: 300, headerName: "Preference Description", sortable: false, filterable: false },
    { field: "isDefault", type: "boolean", width: 100, headerName: "Default", sortable: false, filterable: false },
    { field: 'editAction', type: 'actions', headerName: '', width: 20, getActions: () => [<GridActionsCellItem key={1} icon={<Tooltip title={actionTypes.Edit}>   <EditIcon /></Tooltip>} tabIndex={1} data-action={actionTypes.Edit} label="Edit" color="primary" />] },
    { field: 'deleteAction', type: 'actions', headerName: '', width: 20, getActions: () => [<GridActionsCellItem key={2} icon={<Tooltip title={actionTypes.Delete}><DeleteIcon /> </Tooltip>} tabIndex={2} data-action={actionTypes.Delete} label="Delete" color="error" />] }
];

const initialValues = {
    prefName: '',
    prefDesc: '',
    isDefault: false
};
const pageSizeOptions = [5, 10, 20, 50, 100];
const GridPreferences = ({ tTranslate = (key) => key, preferenceName, gridRef, columns = [], setIsGridPreferenceFetched }) => {
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
    const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState({});
    const { Username } = stateData?.getUserData ? stateData.getUserData : {};
    const preferences = stateData?.preferences;
    const currentPreference = stateData?.currentPreference;
    const preferenceApi = stateData?.gridSettings?.permissions?.preferenceApi; // this is the api endpoint used to fetch, save, edit or delete the preferences, passed via redux form application.
    const defaultPreferenceEnums = stateData?.gridSettings?.permissions?.defaultPreferenceEnums;
    const filterModel = useGridSelector(gridRef, gridFilterModelSelector);
    const sortModel = useGridSelector(gridRef, gridSortModelSelector);
    const validationSchema = useMemo(() => {
        const schema = yup.object({
            prefName: yup
                .string()
                .trim(true)
                .required('Preference Name is Required')
                .max(20, 'Maximum Length is 20'),
            prefDesc: yup.string().max(100, `Description maximum length is 100`)
        });
        return schema;
    }, []);

    useEffect(() => {
        setFilteredPrefs(preferences?.filter(pref => pref.prefId !== 0));
    }, [preferences]);

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await savePreference(values);
        },
        mode: "onBlur"
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
        const params = {
            action: 'delete',
            id: preferenceName,
            Username,
            prefIdArray: id
        };
        const response = await request({ url: preferenceApi, params, history: navigate, dispatchData });
        if (response === true || response?.success) {
            if (prefName === currentPreference) {
                removeCurrentPreferenceName({ dispatchData });
            }
            snackbar.showMessage('Preference Deleted Successfully.');
        }
    };

    const applySelectedPreference = async (prefId) => {
        if (setIsGridPreferenceFetched) {
            setIsGridPreferenceFetched(false);
        }
        await applyPreference(prefId);
    };
    const savePreference = async (values) => {
        const presetName = values.prefName.trim();
        const preferenceAlreadyExists = preferences.findIndex(ele => ele.prefName === presetName);
        // if any default preferences maintain them inside the preferences array.
        if (preferenceAlreadyExists > -1 && (formType === formTypes.Add || preferences[preferenceAlreadyExists].prefId !== values.prefId)) {
            setOpenPreferenceExistsModal(true);
            return;
        }
        const { pinnedColumns } = gridRef.current.state;
        const { orderedFields, columnVisibilityModel, lookup } = gridRef.current.state.columns;
        const gridColumn = [];
        orderedFields?.forEach(ele => {
            const { field } = lookup[ele];
            const col = columns.find(ele => ele.field === field) || lookup[ele];
            col.width = lookup[ele].width;
            gridColumn.push(col);
        });
        const filter = filterModel?.items?.map(ele => {
            const { field, operator, value } = ele;
            return { field, operator, value };
        });
        filterModel.items = filter;
        const params = {
            action: 'save',
            id: preferenceName,
            prefName: presetName,
            prefDesc: values.prefDesc,
            prefValue: { sortModel, filterModel, columnVisibilityModel, gridColumn, pinnedColumns },
            isDefault: values.isDefault
        };
        if (values.prefId) {
            params["prefId"] = values.prefId;
        }
        const response = await request({ url: preferenceApi, params, history: navigate, dispatchData });
        const action = formType === formTypes.Add ? "Added" : "Saved";
        if (response === true || response?.success === true) {
            snackbar.showMessage(`Preference ${action} Successfully.`);
        }
        getAllSavedPreferences({ preferenceName, Username, history: navigate, dispatchData, preferenceApi, defaultPreferenceEnums });
    };

    const applyPreference = async (prefId) => {
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
            const response = await request({ url: preferenceApi, params, history: navigate, dispatchData }) || {};
            userPreferenceCharts = response.prefValue ? JSON.parse(response.prefValue) : null;
            if (response.prefName) {
                defaultPreference = response.prefName;
            }
        }

        // If userPreferenceCharts is available, apply preferences to the grid
        if (!userPreferenceCharts) return;
        const { gridColumn, columnVisibilityModel, pinnedColumns, sortModel, filterModel } = userPreferenceCharts;
        gridColumn.forEach(({ field, width }) => {
            if (gridRef.current.getColumnIndex(field) !== -1) {
                gridRef.current.setColumnWidth(field, width);
            }
        });
        gridRef.current.setColumnVisibilityModel(columnVisibilityModel);
        gridRef.current.state.columns.orderedFields = gridColumn.map(({ field }) => field);
        gridRef.current.setPinnedColumns(pinnedColumns);
        gridRef.current.setSortModel(sortModel || []);
        gridRef.current.setFilterModel(filterModel);

        dispatchData({ type: actionsStateProvider.SET_CURRENT_PREFERENCE_NAME, payload: defaultPreference });
        setIsGridPreferenceFetched(true);
    };

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
    };

    const confirmDeletePreference = async () => {
        const { prefId, preferenceName: currentPrefname } = openConfirmDeleteDialog;
        await deletePreference(prefId, currentPrefname);
        getAllSavedPreferences({ preferenceName, history: navigate, dispatchData, Username, preferenceApi, defaultPreferenceEnums });
        setOpenConfirmDeleteDialog({});
    };

    const onCellClick = async (cellParams) => {
        const action = cellParams.field === 'editAction' ? actionTypes.Edit : cellParams.field === 'deleteAction' ? actionTypes.Delete : null;
        if (cellParams.id === 0 && (action === actionTypes.Edit || action === actionTypes.Delete)) {
            snackbar.showMessage(`Default Preference Can Not Be ${action === actionTypes.Edit ? 'Edited' : 'Deleted'}`);
            return;
        }
        if (action === actionTypes.Edit) {
            setFormType('Modify');
            formik.setValues(cellParams?.row);
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
                {tTranslate('Preferences', tOpts)} {currentPreference && `(${currentPreference})`}
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
                <MenuItem component={ListItemButton} dense divider={preferences?.length > 0} onClick={() => openModal(formTypes.Manage, false)}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    {tTranslate('Manage Preferences', tOpts)}
                </MenuItem>

                {preferences?.length > 0 && preferences?.map((ele) => {
                    const { prefName, prefDesc, prefId } = ele;
                    return (
                        <MenuItem
                            onClick={() => applySelectedPreference(prefId)}
                            component={ListItem}
                            selected={currentPreference === prefName}
                            key={`pref-item-${prefId}`}
                            title={tTranslate(prefDesc, tOpts)}
                            dense
                        >
                            <ListItemText primary={tTranslate(prefName, tOpts)} />
                        </MenuItem>
                    );
                })}
            </Menu>
            <DialogComponent
                open={openDialog}
                disableRestoreFocus
                title={
                    <Stack direction="row" columnGap={2}>
                        <Typography variant="h5" >
                            {formType} {tTranslate(`Preference${(formType === formTypes.Manage ? 's' : '')}`, tOpts)}
                        </Typography>
                    </Stack>
                }
                maxWidth={isManageForm ? 'md' : 'sm'}
                fullWidth
            >
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
                        <Grid size={12}>
                            <TextField
                                defaultValue={tTranslate(formik.values.prefName, tOpts)}
                                variant="outlined"
                                size="small"
                                margin="dense"
                                label={
                                    <span>
                                        {tTranslate('Preference Name', tOpts)} <span style={{ color: 'red' }}>*</span>
                                    </span>
                                }
                                autoFocus
                                name={'prefName'}
                                onChange={formik.handleChange}
                                error={!!formik.errors.prefName}
                                helperText={formik.errors.prefName}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={12}>
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
                        <Grid size={12}>
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
                        <Grid size={12}>
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
                    <Grid container rowGap={2}>
                        <Grid size={12}>
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
                                pageSizeOptions={pageSizeOptions}
                                pagination
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
                                autoHeight
                            />
                        </Grid>
                        <Grid size={12}>
                            <Stack direction="row" columnGap={1} style={{ justifyContent: 'end' }}>
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
            </DialogComponent>
            <DialogComponent
                open={openPreferenceExistsModal}
                onConfirm={() => setOpenPreferenceExistsModal(false)}
                title=""
                okText={tTranslate('Ok', tOpts)}
                cancelText=""
            >
                "{prefName}" {tTranslate('name already in use, please use another name.', tOpts)}
            </DialogComponent>
            <DialogComponent
                open={openConfirmDeleteDialog.preferenceName}
                onConfirm={confirmDeletePreference}
                onCancel={() => setOpenConfirmDeleteDialog({})}
                title="Confirm delete"
                yesNo={true}
            >
                Are you sure you wish to delete "{openConfirmDeleteDialog.preferenceName}"
            </DialogComponent>
        </Box>
    );
};


export default GridPreferences;