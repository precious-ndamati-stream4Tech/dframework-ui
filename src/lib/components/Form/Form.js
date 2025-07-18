import React from "react";
import { useFormik } from "formik";
import { useState, useEffect, createContext, useMemo } from "react";
import {
  getRecord,
  saveRecord,
  deleteRecord
} from "../Grid/crud-helper";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import FormLayout from "./field-mapper";
import { useSnackbar } from "../SnackBar";
import { DialogComponent } from "../Dialog";
import { useStateContext, useRouter } from "../useRouter/StateProvider";
import actionsStateProvider from "../useRouter/actions";
import PageTitle from "../PageTitle";
import utils, { getPermissions } from "../utils";
import Relations from "./relations";
export const ActiveStepContext = createContext(1);
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

const Form = ({
  model,
  api,
  models,
  relationFilters = {},
  permissions = {},
  Layout = FormLayout,
  baseSaveData = {},
  sx,
  readOnly,
  beforeSubmit,
  deletePromptText
}) => {
  const formTitle = model.formTitle || model.title;
  const { navigate, getParams, useParams, pathname } = useRouter();
  const { relations = [] } = model;
  const { dispatchData, stateData } = useStateContext();
  const params = useParams() || getParams;
  const { id: idWithOptions = "" } = params;
  const id = idWithOptions.split("-")[0];
  const searchParams = new URLSearchParams(window.location.search);
  const baseDataFromParams = searchParams.has(consts.baseData) && searchParams.get(consts.baseData);
  if (baseDataFromParams) {
    const parsedData = JSON.parse(baseDataFromParams);
    if (typeof parsedData === consts.object && parsedData !== null) {
      baseSaveData = { ...baseSaveData, ...parsedData };
    }
  }
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [lookups, setLookups] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const snackbar = useSnackbar();
  const [validationSchema, setValidationSchema] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const url = stateData?.gridSettings?.permissions?.Url || '';
  const fieldConfigs = typeof model.applyFieldConfig === consts.function
    ? model.applyFieldConfig({ data, lookups })
    : defaultFieldConfigs;
  const gridApi = useMemo(() => `${url}${model.api || api || ''}`, [url, model.api, api]);
  const { mode } = stateData.dataForm;
  const userData = stateData.getUserData || {};
  const userDefinedPermissions = {
    add: true,
    edit: true,
    delete: true,
    ...model.permissions,
    ...permissions
  };
  const { canEdit } = getPermissions({
    userData,
    model,
    userDefinedPermissions
  });
  const { hideBreadcrumb = false, navigateBack } = model;

  const handleNavigation = () => {
    let navigatePath;
    switch (typeof navigateBack) {
      case consts.function:
        navigatePath = navigateBack({ params, searchParams, data });
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

  const isNew = useMemo(() => utils.emptyIdValues.includes(id), [id]);

  const initialValues = useMemo(() => isNew
    ? { ...model.initialValues, ...data, ...baseSaveData }
    : { ...baseSaveData, ...model.initialValues, ...data }, [model.initialValues, data, id]);

  useEffect(() => {
    if (!url) return;
    setValidationSchema(model.getValidationSchema({ id, snackbar }));
    const options = idWithOptions.split("-");
    const params = {
      api: api || gridApi,
      model,
      setError: errorOnLoad
    };
    getRecord({
      ...params,
      id: options.length > 1 ? options[1] : options[0],
      setIsLoading,
      setActiveRecord
    });

  }, [id, idWithOptions, model, url]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      Object.keys(values).forEach(key => {
        if (typeof values[key] === consts.string) {
          values[key] = values[key].trim();
        }
      });
      setIsLoading(true);
      saveRecord({
        id,
        api: gridApi,
        values: values,
        setIsLoading,
        setError: snackbar.showError,
      })
        .then((success) => {
          if (!success) return;
          if (model.reloadOnSave) {
            return window.location.reload();
          }
          const message = success.info ? success.info : `Record ${id === 0 ? "Added" : "Updated"} Successfully.`;
          snackbar.showMessage(message);
          /**
          * Handle navigation after form operations
          * By default, the form navigates back to the grid after save/cancel operations.
          * This behavior can be controlled by setting navigateBack "false" / false in model config which disables navigation completely.
          */
          navigateBack !== false && handleNavigation();
        })
        .catch((err) => {
          snackbar.showError(
            "An error occured.",
            err
          );
          if (model.reloadOnSave) {
            resetForm();
          }
        })
        .finally(() => setIsLoading(false));
    }
  });

  const { dirty } = formik;

  const handleDiscardChanges = () => {
    formik.resetForm();
    setIsDiscardDialogOpen(false);
    handleNavigation();
  };

  const errorOnLoad = function (title, error) {
    snackbar.showError(title, error);
    handleNavigation();
  };

  const setActiveRecord = function ({ id, title, record, lookups }) {
    const isCopy = idWithOptions.indexOf("-") > -1;
    const isNew = !id || id === "0";
    const pageTitle = isNew ? consts.create : isCopy ? consts.copy : consts.edit;
    const linkColumn = isNew ? "" : record[model.linkColumn];
    const breadcrumbs = [{ text: model.breadCrumbs }, { text: pageTitle }];
    if (isCopy) {
      record[model.linkColumn] = "";
    }
    model.columns.forEach((item) => {
      if (item.skipCopy && isCopy) {
        record[item.field] = "";
      }
    });
    setData(record);
    setLookups(lookups);
    if (linkColumn !== "") {
      breadcrumbs.push({ text: linkColumn });
    }
    dispatchData({
      type: actionsStateProvider.PAGE_TITLE_DETAILS,
      payload: {
        showBreadcrumbs: true,
        breadcrumbs: breadcrumbs
      }
    });
  };
  const handleFormCancel = function (event) {
    if (dirty) {
      setIsDiscardDialogOpen(true);
    } else {
      handleNavigation();
    }
    event.preventDefault();
  };
  const handleDelete = async function () {
    try {
      setIsDeleting(true);
      const response = await deleteRecord({
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
    setErrorMessage(null)
    setIsDeleting(false);
  };
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", pt: "20%", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  const handleChange = function (e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async function (e) {
    if (e) e.preventDefault();
    if (typeof beforeSubmit === consts.function) {
      await beforeSubmit({ formik });
    }
    const { errors } = formik;
    formik.handleSubmit();
    const fieldName = Object.keys(errors)[0];
    const errorMessage = errors[fieldName];
    if (errorMessage) {
      snackbar.showError(errorMessage, null, "error");
    }
    const fieldConfig = model.columns.find(
      (column) => column.field === fieldName
    ) || {};
    if (fieldConfig.tab) {
      setActiveStep(Object.keys(model.tabs).indexOf(fieldConfig.tab));
    }
  };

  const breadcrumbs = [
    { text: formTitle },
    { text: id === "0" ? "New" : "Update" }
  ];
  const showRelations = Number(id) !== 0 && Boolean(relations.length);
  const showSaveButton = searchParams.has("showRelation");
  const recordEditable = !("canEdit" in data) || data.canEdit;
  const readOnlyRelations = !recordEditable || data.readOnlyRelations;
  deletePromptText = deletePromptText || "Are you sure you want to delete ?";
  return (
    <>
      <PageTitle
        navigate={navigate}
        title={formTitle}
        showBreadcrumbs={!hideBreadcrumb}
        breadcrumbs={breadcrumbs}
        model={model}
      />
      <ActiveStepContext.Provider value={{ activeStep, setActiveStep }}>
        <Paper sx={{ padding: 2, ...sx }}>
          <form>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              mb={1}
            >
              {canEdit && recordEditable && !showSaveButton && !readOnly && (
                <Button
                  variant="contained"
                  type="submit"
                  color="success"
                  onClick={handleSubmit}
                >{`${"Save"}`}</Button>
              )}
              <Button
                variant="contained"
                type="cancel"
                color="error"
                onClick={handleFormCancel}
              >{`${"Cancel"}`}</Button>
              {permissions.delete && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setIsDeleting(true)}
                >{`${"Delete"}`}</Button>
              )}
            </Stack>
            <Layout
              model={model}
              formik={formik}
              data={data}
              fieldConfigs={fieldConfigs}
              onChange={handleChange}
              lookups={lookups}
              id={id}
              handleSubmit={handleSubmit}
              mode={mode}
            />
          </form>
          {errorMessage && (
            <DialogComponent
              open={!!errorMessage}
              onConfirm={clearError}
              onCancel={clearError}
              title="Info"
              hideCancelButton={true}
            >
              {" "}
              {errorMessage}
            </DialogComponent>
          )}
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
          <DialogComponent
            open={isDeleting}
            onConfirm={handleDelete}
            onCancel={() => {
              setIsDeleting(false);
              setDeleteError(null);
            }}
            title={deleteError ? "Error Deleting Record" : "Confirm Delete"}
          >{deletePromptText}</DialogComponent>
          {showRelations ? (
            <Relations
              readOnly={readOnlyRelations}
              models={models}
              relationFilters={relationFilters}
              relations={relations}
              parent={model.name || model.title || ""}
            />
          ) : null}
        </Paper>
      </ActiveStepContext.Provider>
    </>
  );
};
export default Form;