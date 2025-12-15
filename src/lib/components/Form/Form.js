import React from 'react';
import { useFormik } from 'formik';
import { useState, useEffect, createContext } from 'react';
import { getRecord, saveRecord, deleteRecord } from '../Grid/crud-helper';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import FormLayout from './field-mapper';
import { useSnackbar } from '../SnackBar';
import { DialogComponent } from '../Dialog';
import PageTitle from '../PageTitle';
import { useStateContext, useRouter } from '../useRouter/StateProvider';
import actionsStateProvider from '../useRouter/actions';
import utils from '../utils';
import { useTranslation } from 'react-i18next';
export const ActiveStepContext = createContext(1);
const defaultFieldConfigs = {};
const t = utils.t;

const Form = ({
    model,
    api,
    permissions = model.modelPermissions || { edit: true, export: true, delete: true },
    Layout = FormLayout,
}) => {
    const { dispatchData, stateData } = useStateContext();
    const { navigate, useParams } = useRouter()
    const params = useParams ? useParams() : {};
    const { id: idWithOptions } = params;
    const id = idWithOptions?.split('-')[0];
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [lookups, setLookups] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const snackbar = useSnackbar();
    const [validationSchema, setValidationSchema] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { t: translate, i18n } = useTranslation();
    const tOpts = { t: translate, i18n };
    const url = stateData?.gridSettings?.permissions?.Url;
    const fieldConfigs = model?.applyFieldConfig ? model?.applyFieldConfig({ data, lookups }) : defaultFieldConfigs;
    let gridApi = `${url}${model.api || api}`
    const { mode } = stateData.dataForm;
    const urlId = mode === 'copy' ? idWithOptions?.split('-')[1] : id;
    const isValidUrl = utils.isValidIdUrl(urlId);
    const userData = stateData?.getUserData || {};
    const { ClientId = 0 } = userData?.tags || {};
    const isClientSelected = (ClientId && ClientId != 0);
    useEffect(() => {
        debugger
        setValidationSchema(model?.getValidationSchema({ id, snackbar, t, tOpts }));
        const options = idWithOptions?.split('-');
        try {
            getRecord({
                id: options.length > 1 ? options[1] : options[0],
                api: gridApi,
                modelConfig: model,
                setIsLoading,
                setError: errorOnLoad,
                setActiveRecord
            })
        } catch (error) {
            snackbar.showError(t('An error occurred, please try again later', tOpts));
            navigate(model.backURL || './');
        } finally {
            setIsLoading(false);
        }
        return () => {
            utils.removeBackButton(dispatchData);
        }
    }, [id, idWithOptions, model]);

    useEffect(() => {
        if (model.overrideBackRouteAndSearch) {
            dispatchData({
                type: actionsStateProvider.SET_PAGE_BACK_BUTTON,
                payload: { status: true, backRoute: model.backURL },
            });
            dispatchData({
                type: actionsStateProvider.PASS_FILTERS_TOHEADER,
                payload: { hidden: { search: true, operation: false, export: false, print: false, filter: true } }
            });
        }
    }, []);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: { ...model.initialValues, ...data },
        validationSchema: validationSchema,
        validateOnBlur: false,
        onSubmit: async (values, { resetForm }) => {
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
                const formColumns = model.columns.filter(ele => ele.showOnForm !== false)?.map(item => item.field);
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

            saveRecord({
                id,
                api: gridApi,
                values,
                setIsLoading,
                setError: snackbar.showError,
                tTranslate: translate,
                tOpts,
                modelConfig: model
            })
                .then(success => {
                    if (success) {
                        snackbar.showMessage(t('Record Updated Successfully', tOpts));
                        navigate(model.backURL || './');
                    }
                })
                .catch((err) => {
                    snackbar.showError(t('An error occurred, please try again later', tOpts));
                })
                .finally(() => setIsLoading(false));
        }
    });

    const { dirty } = formik;

    const handleDiscardChanges = () => {
        formik.resetForm();
        setIsDiscardDialogOpen(false);
        navigate(model.backURL || '.');
    };

    const warnUnsavedChanges = () => {
        if (dirty) {
            setIsDiscardDialogOpen(true);
        }
    }

    const errorOnLoad = function (title, error) {
        snackbar.showError(title, error);
        navigate(model.backURL || './');
    }

    const setActiveRecord = function ({ id, title, record, lookups }) {
        const isCopy = idWithOptions.indexOf("-") > -1;
        const isNew = !id || id === "0";
        const localTitle = isNew ? "Create" : (isCopy ? "Copy" : "Edit");
        const breadCrumbColumn = model?.linkColumn || model?.breadCrumbColumn;
        const localValue = isNew ? "" : record[breadCrumbColumn];
        const breadcrumbs = [{ text: model?.breadCrumbs }, { text: localTitle }];
        let tempRecord = { ...record };

        if (isCopy) {
            tempRecord[model.linkColumn] += " (Copy)";
        }
        if (model.calculatedColumns) {
            tempRecord = Object.fromEntries(
                Object.entries(tempRecord).filter(([key]) => !model.calculatedColumns.includes(key))
            );
        }

        if (isNew && !isCopy && userData) {
            model.columns?.forEach(column => {
                // Check if field has defaultToClientValue flag
                if (column.defaultToClientValue) {
                    // Use selectField if specified, otherwise use field
                    const fieldKey = column.selectField || column.field;
                    // Get the value from userData.tags using the fieldKey
                    const defaultValue = userData.tags?.[fieldKey] || userData[fieldKey];

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
            breadcrumbs.push({ text: localValue });
        }
        if (!tempRecord.GroupName) {
            tempRecord.GroupName = localValue;
        }
        dispatchData({
            type: actionsStateProvider.PAGE_TITLE_DETAILS,
            payload: {
                showBreadcrumbs: true, breadcrumbs: breadcrumbs
            },
        });
    }
    const handleFormCancel = function (event) {
        if (dirty) {
            warnUnsavedChanges();
            event.preventDefault();
        } else {
            navigate(model.backURL || '.');
        }
    }
    const handleDelete = async function () {
        setIsDeleting(true);
        debugger
        try {
            const response = await deleteRecord({
                id,
                api: api || model?.api,
                setIsLoading,
                setError: snackbar.showError,
                setErrorMessage,
                tTranslate: translate,
                tOpts,
                modelConfig: model
            })
            if (response === true) {
                snackbar.showMessage(t('Record Deleted Successfully', tOpts));
                navigate(model.backURL || './');
            }
        } catch (error) {
            setDeleteError(t('An error occurred, please try again later', tOpts));
        } finally {
            setIsDeleting(false);
        }
    }
    const clearError = () => {
        setErrorMessage(null);
        setIsDeleting(false);
    };
    if (isLoading) {
        return <Box sx={{ display: 'flex', pt: '20%', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    }
    const handleChange = function (e) {
        const { name, value } = e.target;
        const gridData = { ...data };
        gridData[name] = value;
        setData(gridData);
    }

    const handleSubmit = function (e) {
        if (e) e.preventDefault();
        const { errors } = formik;
        if (model.calculatedColumns) {
            formik.values = Object.fromEntries(
                Object.entries(formik.values).filter(([key]) => !model.calculatedColumns.includes(key))
            );
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
    }
    return isValidUrl ? (
        <ActiveStepContext.Provider value={{ activeStep, setActiveStep }}>
            <Paper sx={{ padding: 2 }}>
                <form>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" mb={1}>
                        {permissions.edit && <Button variant="contained" type="submit" color="success" onClick={handleSubmit}>{`${"Save"}`}</Button>}
                        <Button variant="contained" type="cancel" color="error" onClick={handleFormCancel}>{`${"Cancel"}`}</Button>
                        {permissions.delete && <Button variant="contained" color="error" onClick={() => setIsDeleting(true)}>{`${"Delete"}`}</Button>}
                    </Stack>
                    <Layout model={model} formik={formik} data={data} fieldConfigs={fieldConfigs} onChange={handleChange} lookups={lookups} id={id} handleSubmit={handleSubmit} mode={mode} />
                </form>
                {errorMessage && (<DialogComponent open={!!errorMessage} onConfirm={clearError} onCancel={clearError} title="Info" hideCancelButton={true} > {errorMessage}</DialogComponent>)}
                <DialogComponent
                    open={isDiscardDialogOpen}
                    onConfirm={handleDiscardChanges}
                    onCancel={() => setIsDiscardDialogOpen(false)}
                    title="Changes not saved"
                    okText="Discard"
                    cancelText="Continue"
                >
                    {"Would you like to continue to edit or discard changes?"}
                </DialogComponent>
                <DialogComponent open={isDeleting} onConfirm={handleDelete} onCancel={() => { setIsDeleting(false); setDeleteError(null); }} title={deleteError ? "Error Deleting Record" : "Confirm Delete"}>{`Are you sure you want to delete ${data?.GroupName || data?.SurveyName}?`}</DialogComponent>
            </Paper>
        </ActiveStepContext.Provider >
    ) : <div>{"Wrong action"}</div>
}
export default Form;