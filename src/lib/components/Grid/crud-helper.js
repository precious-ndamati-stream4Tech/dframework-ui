import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import actionsStateProvider from "../useRouter/actions";
import { transport, HTTP_STATUS_CODES } from "./httpRequest";
import request from "./httpRequest";
import constants from '../constants';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import utils from '../utils';

dayjs.extend(utc);

const dateDataTypes = ['date', 'dateTime'];
const urlWithControllers = `/Controllers`;

const getList = async ({ gridColumns, setIsLoading, setData, page, pageSize, sortModel, filterModel, api, parentFilters, action = 'list', setError, extraParams, contentType, columns, controllerType = 'node', template = null, configFileName = null, dispatchData, showFullScreenLoader = false, oderStatusId = 0, modelConfig = null, baseFilters = null, isElasticExport, fromSelfServe = false, isDetailsExport = false, setFetchData = () => { }, selectedClients = [], isChildGrid = false, groupBy, isPivotExport = false, gridPivotFilter = [], activeClients, isLatestExport = false, payloadFilter = [], isFieldStatusPivotExport = false, isInstallationPivotExport = false, uiClientIds = '', globalFilters = {}, additionalFiltersForExport, setColumns, afterDataSet, setIsDataFetchedInitially, isDataFetchedInitially, exportFileName = null, tTranslate = null, tOpts = null, languageSelected }) => {
    if (!contentType) {
        setIsLoading(true);
        if (showFullScreenLoader) {
            dispatchData({ type: actionsStateProvider.UPDATE_LOADER_STATE, payload: true });
        }
    }

    let isPortalController = controllerType === 'cs';
    if (fromSelfServe) {
        isPortalController = false;
        api = modelConfig?.selfServerAPI || api;
    }
    const lookups = [];
    const dateColumns = [];
    gridColumns.forEach(({ lookup, type, field, keepUTC = false }) => {
        if (dateDataTypes.includes(type)) {
            dateColumns.push({ field, keepUTC });
        }
        if (!lookup) {
            return;
        }
        if (!lookups.includes(lookup)) {
            lookups.push(lookup);
        }
    });

    const where = [];
    if (filterModel?.items?.length) {
        filterModel.items.forEach(filter => {
            if (constants.emptyNotEmptyOperators?.includes(filter.operator) || filter.value || filter.value === false || filter.value === 0) {
                const { field, operator, filterField } = filter;
                let { value } = filter;
                const column = gridColumns.filter((item) => item.field === filter.field);
                let type = filter?.type || column[0]?.type;
                const sqlType = column[0]?.sqlType;
                if (type === 'boolean') {
                    if (isPortalController) {
                        value = typeof value === 'string' ? (value === 'true') : value;
                    } else {
                        value = Boolean(value) ? 1 : 0;
                    }
                } else if (type === 'number') {
                    value = Array.isArray(value) ? value.filter(e => e) : value;
                }
                value = filter.filterValues || value;
                where.push({
                    field: filterField || field,
                    operator: operator,
                    value: value,
                    type: type,
                    sqlType: sqlType
                });
            }
        });
    }
    if (parentFilters) {
        where.push(...parentFilters);
    }

    if (baseFilters) {
        where.push(...baseFilters);
    }
    const requestData = {
        start: page * pageSize,
        limit: modelConfig?.isClient ? 0 : isElasticExport ? modelConfig?.exportSize : pageSize,
        ...extraParams,
        logicalOperator: filterModel.logicOperator,
        sort: sortModel.map(sort => (sort.filterField || sort.field) + ' ' + sort.sort).join(','),
        where,
        selectedClients,
        oderStatusId: oderStatusId,
        isElasticExport,
        fileName: tTranslate(exportFileName || modelConfig?.title || modelConfig?.overrideFileName, tOpts),
        fromSelfServe,
        isChildGrid,
        groupBy,
        isLatestExport,
        globalFilters
    };

    if (lookups) {
        requestData.lookups = lookups.join(',');
    }

    if (modelConfig?.limitToSurveyed) {
        requestData.limitToSurveyed = modelConfig?.limitToSurveyed
    }
    if (modelConfig?.includeColumns) {
        requestData.columns = gridColumns;
    }
    if (modelConfig?.gridType) {
        requestData.gridType = modelConfig.gridType
    }

    // Transform filters for portal controller
    if (isPortalController) {
        utils.createFiltersForPortalController(where, requestData);

        if (payloadFilter?.length) {
            payloadFilter.map((ele) => {
                requestData[ele.field] = ele.value;
            });
        }

        if (sortModel?.length) {
            requestData.sort = sortModel[0].field;
            requestData.dir = sortModel[0].sort;
        }
    }

    const headers = {};
    if (isPortalController && contentType) {
        action = 'export';
    }
    let url = isPortalController ? isDetailsExport ? `${api}` : `${api}?action=${action}&asArray=0` : `${api}/${action}`;

    const isPivot = isPivotExport || isFieldStatusPivotExport || isInstallationPivotExport;

    if (template !== null) {
        url += `&template=${template}`;
    }
    if (configFileName !== null) {
        url += `&configFileName=${configFileName}`;
    }
    if (isPivot) {
        url += `&uiClientIds=${uiClientIds}`;
        if (isPortalController && exportFileName) {
            url += `&exportFileName=${exportFileName}`;
        }
    }

    if (modelConfig?.customApi) {
        url = modelConfig?.customApi
    }
    
    let exportParams = {
        exportFileName: tTranslate ? tTranslate(exportFileName || modelConfig?.title || modelConfig?.overrideFileName, tOpts) : (exportFileName || modelConfig?.title || modelConfig?.overrideFileName),
        action,
        exportFormat: 'XLSX',
        title: modelConfig?.pageTitle,
        sort: sortModel.map(sort => (sort.filterField || sort.field) + ' ' + sort.sort).join(','),
        TimeOffSet: new Date().getTimezoneOffset()
    }
    if (isDetailsExport && additionalFiltersForExport) {
        requestData['additionalFiltersForExport'] = additionalFiltersForExport;
        exportParams['additionalFiltersForExport'] = additionalFiltersForExport;
    }

    if (contentType) {
        if (isDetailsExport) {
            url = url + "?v=" + new Date() + '&' + 'forExport=true';
            let filtersForExport = utils.createFilter(filterModel, true);
            if (Object.keys(filtersForExport)?.length > 0 && params.title !== constants.surveyInboxTitle) {
                filtersForExport.map((item) => {
                    if (item?.operatorValue) {
                        if (item.isValueADate) {
                            let operatorId = utils.dateOperator[item?.operatorValue];
                            if (operatorId?.length > 0) {
                                params.OperatorId = operatorId;
                            }
                        }
                    }
                    params = { ...params, ...item };
                })
            }

        }
        if (where?.length && modelConfig?.convertFiltersToPortalFormat) {
            let exportFilters = {};
            if (where?.length <= 1) {
                for (const i in where) {
                    where[i] = {
                        "fieldName": where[i].field,
                        "operatorId": utils.filterType[where[i].operator],
                        "convert": false,
                        "values": [where[i].value]
                    }
                }
            } else {
                const filterModelCopy = filterModel;
                let firstFilter = where[0];
                if (filterModelCopy?.items?.length > 1 && firstFilter) {
                    filterModelCopy.items = where;
                    if (firstFilter) {
                        firstFilter = {
                            "fieldName": firstFilter.field,
                            "operatorId": utils.filterType[firstFilter.operator],
                            "convert": false,
                            "values": [firstFilter.value]
                        }
                    }
                    exportFilters = utils.createFilter(filterModel);
                    exportFilters = utils.addToFilter(firstFilter, exportFilters, filterModelCopy?.logicOperator.toUpperCase());
                }

            }
            exportFilters['filter'] = Object.keys(exportFilters)?.length > 0 ? Object.assign({}, exportFilters) : where[0] || '';
        }
        const form = document.createElement("form");
        requestData.responseType = contentType;
        requestData.columns = columns;
        if (isPortalController) {
            requestData.exportFormat = constants.contentTypeToFileType?.[contentType] || 'XLSX';
            requestData.selectedFields = Object.keys(columns).join();
            if (requestData.sort && !Object.keys(columns).includes(requestData.sort)) {
                requestData.selectedFields += `,${requestData.sort}`;
            }
            requestData.cols = Object.keys(columns).map(col => {
                return { ColumnName: columns[col].field, Header: columns[col].headerName, Width: columns[col].width }
            });
            delete requestData.columns;
            delete requestData.responseType;
        }
        requestData.userTimezoneOffset = new Date().getTimezoneOffset() * -1;
        requestData.languageSelected = languageSelected;
        form.setAttribute("method", "POST");
        form.setAttribute("id", "exportForm");
        form.setAttribute("target", "_blank");
        let arr = isDetailsExport && action === 'export' ? exportParams : requestData;
        arr['isDetailsExport'] = isDetailsExport;
        if (isPivot && gridPivotFilter?.length) {
            for (const item of gridPivotFilter) {
                let v = item.value;
                if (v === undefined || v === null) {
                    continue;
                } else if (typeof v !== 'string') {
                    v = JSON.stringify(v);
                }
                let hiddenTag = document.createElement('input');
                hiddenTag.type = "hidden";
                hiddenTag.name = item.field;
                hiddenTag.value = v;
                form.append(hiddenTag);
            }
        }

        if (modelConfig?.addSelectedClientsForExport) {
            let hiddenTag = document.createElement('input');
            hiddenTag.type = "hidden";
            hiddenTag.name = "activeClients";
            hiddenTag.value = activeClients.toString();
            form.append(hiddenTag);
        }

        if (template === null) {
            for (const key in arr) {
                let v = arr[key];
                if (v === undefined || v === null) {
                    continue;
                } else if (typeof v !== 'string') {
                    v = JSON.stringify(v);
                }
                let hiddenTag = document.createElement('input');
                hiddenTag.type = "hidden";
                hiddenTag.name = key;
                hiddenTag.value = v;
                form.append(hiddenTag);
            }
        }

        form.setAttribute('action', url);
        document.body.appendChild(form);
        form.submit();
        setTimeout(() => {
            document.getElementById("exportForm").remove();
        }, 3000)
        return;
    }
    try {
        let params = {
            url,
            method: 'POST',
            data: requestData,
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
            credentials: 'include'
        };
        let response;
        if (isPortalController) {
            response = await request({ url, params: requestData, history, dispatchData });
            setData(response);
        } else {
            response = await transport(params);
            if (response.status === HTTP_STATUS_CODES.OK) {
                const { records, userCurrencySymbol } = response.data;
                if (records) {
                    records.forEach(record => {
                        if (record.hasOwnProperty("TotalOrder")) {
                            record["TotalOrder"] = `${userCurrencySymbol}${record["TotalOrder"]}`;
                        }
                        dateColumns.forEach(column => {
                            const { field, keepUTC } = column;
                            if (record[field]) {
                                record[field] = keepUTC ? dayjs.utc(record[field]) : new Date(record[field]);
                            }
                        });
                    });
                }
                if (modelConfig?.dynamicColumns && setColumns) {
                    const existingLabels = new Set(gridColumns?.map(col => col.label));
                    const dynamicResponseColumns = response.data?.dynamicColumns || [];
                    const isMerchandisingColumn = dynamicResponseColumns?.every(col => col.key);
                    let newDynamicColumns;
                    if (isMerchandisingColumn) {
                        newDynamicColumns = dynamicResponseColumns?.filter(col => !existingLabels.has(col.key));
                        existingLabels.clear();
                        newDynamicColumns = newDynamicColumns.map(col => {
                            if (col.addDrillDownIcon) {
                                col.renderCell = (params) => {
                                    return (
                                        <IconButton
                                            onClick={(e) => modelConfig.onDrillDown(params, col)}
                                            size="small"
                                            style={{ padding: 1 }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    );
                                };
                            }
                            if (col.key && !col.addDrillDownIcon && model?.formatMerchandisingDateRange) {
                                if (typeof model.formatMerchandisingDateRange === 'function') {
                                    col.label = model.formatMerchandisingDateRange(col.label);
                                }
                            }
                            return col;
                        });
                    } else {
                        if (modelConfig.updateDynamicColumns) {
                            newDynamicColumns = modelConfig.updateDynamicColumns({ dynamicResponseColumns, t, tOpts });
                        }
                    }
                    if (newDynamicColumns.length) {
                        setColumns([...modelConfig.columns, ...newDynamicColumns]);
                    }
                }
                // Ensure records and recordCount always have defaults
                setData({
                    ...response.data,
                    records: response.data?.records || [],
                    recordCount: response.data?.recordCount || 0
                });
                if (setFetchData)
                    setFetchData(true);
                if (afterDataSet && !isDataFetchedInitially) {
                    afterDataSet();
                    setIsDataFetchedInitially(true);
                }
            } else {
                setError(response.statusText);
            }
        }
    } catch (err) {
        let errorMessage = err;
        if (tTranslate && tOpts) {
            errorMessage = tTranslate(err.message, tOpts);
        }
        setError(errorMessage);
    } finally {
        if (!contentType) {
            setIsLoading(false);
            if (showFullScreenLoader) {
                dispatchData({ type: actionsStateProvider.UPDATE_LOADER_STATE, payload: false });
            }
        }
    }
};

const getRecord = async ({ api, id, setIsLoading, setActiveRecord, modelConfig, parentFilters, where = {}, setError }) => {
    debugger
    api = api || modelConfig?.api
    setIsLoading(!modelConfig?.overrideLoaderOnInitialRender);
    const searchParams = new URLSearchParams();
    const url = `${api}/${id === undefined || id === null ? '-' : id}`;
    const lookupsToFetch = [];
    const fields = modelConfig.formDef || modelConfig.columns;
    fields?.forEach(field => {
        if (field.lookup && !lookupsToFetch.includes(field.lookup)) {
            lookupsToFetch.push(field.lookup);
        }
    });
    searchParams.set("lookups", lookupsToFetch);
    if (where && Object.keys(where)?.length) {
        searchParams.set("where", JSON.stringify(where));
    };
     // Handle controllerType 'cs' for loading form data
    let requestUrl = `${url}?${searchParams.toString()}`;
    let requestMethod = 'GET';

    try {
        let requestConfig;

        if (modelConfig?.controllerType === 'cs') {
            // For 'cs' controllerType, use POST method with FormData containing action 'load' and id
            requestConfig = {
                url: `${urlWithControllers}${api}`,
                method: 'POST',
                data: utils.createCsControllerPayload('load', { id, comboTypes: modelConfig.apiComboTypes || [] }),
            };
        } else {
            // Default behavior for other controller types
            requestConfig = {
                url: requestUrl,
                method: requestMethod,
                credentials: 'include'
            };
        }

        const response = await transport(requestConfig);
        if (response.status === HTTP_STATUS_CODES.OK) {
            const { data: record } = response.data;
            let title = record[modelConfig.linkColumn];
            let lookups = response.data.lookups || response.data.combos;

            // Transform combos from CS API format {LookupId, DisplayValue} to {value, label}
            if (lookups && typeof lookups === 'object' && !Array.isArray(lookups)) {
                const transformedLookups = {};
                for (const [comboType, comboArray] of Object.entries(lookups)) {
                    if (Array.isArray(comboArray)) {
                        transformedLookups[comboType] = comboArray.map(item => ({
                            value: item.LookupId !== undefined ? item.LookupId : item.value,
                            label: item.DisplayValue !== undefined ? item.DisplayValue : item.label
                        }));
                    }
                }
                lookups = transformedLookups;
            }

            const columnConfig = modelConfig.columns.find(a => a.field === modelConfig.linkColumn);
            if (columnConfig && columnConfig.lookup) {
                if (lookups && lookups[columnConfig.lookup] && lookups[columnConfig.lookup]?.length) {
                    const lookupValue = lookups[columnConfig.lookup].find(a => a.value === title);
                    if (lookupValue) {
                        title = lookupValue.label;
                    }
                }
            }

            const defaultValues = { ...modelConfig.defaultValues };
            setActiveRecord({ id, title: title, record: { ...defaultValues, ...record, ...parentFilters }, lookups });
        } else if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
            setError('Session Expired!');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            setError('Could not load record', response.body.toString());
        }
    } catch (error) {
        setError('Could not load record', error);
    } finally {
        setIsLoading(false);
    }
};

const deleteRecord = async function ({ id, api, setIsLoading, setError, setErrorMessage, tTranslate, tOpts, modelConfig }) {
    let result = { success: false, error: '' };
    debugger
    if (!id) {
        const errorMsg = tTranslate ? tTranslate('Deleted failed. No active record', tOpts) : 'Deleted failed. No active record';
        setError(errorMsg);
        return;
    }
    setIsLoading(true);
    try {
        let requestConfig;
        if (modelConfig?.controllerType === 'cs') {
            // For 'cs' controllerType, use POST method with FormData containing action 'delete' and ids
            requestConfig = {
                url: `${urlWithControllers}${api}`,
                method: 'POST',
                data: utils.createCsControllerPayload('delete', { ids: id }),
            };
        } else {
            // Default behavior for other controller types
            requestConfig = {
                url: `${api}/${id}`,
                method: 'DELETE',
                credentials: 'include'
            };
        }

        const response = await transport(requestConfig);
        if (response.status === HTTP_STATUS_CODES.OK) {
            const { data } = response;
            if (data && !data.success) {
                result.error = data.info || data.errors || tTranslate('Delete failed', tOpts);
                setError(tTranslate(result.error, tOpts));
                return result;
            }
            result.success = true;
            return true;
        }
        if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
            const errorMsg = tTranslate ? tTranslate('Session Expired!', tOpts) : 'Session Expired!';
            setError(errorMsg);
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            const errorMsg = tTranslate ? tTranslate('Delete failed', tOpts) : 'Delete failed';
            const bodyMsg = tTranslate ? tTranslate(response.body, tOpts) : response.body;
            setError(errorMsg, bodyMsg);
        }
    } catch (error) {
        const errorMessage = error?.response?.data?.error;
        result.error = errorMessage;
        const errorMsg = tTranslate ? tTranslate(errorMessage, tOpts) : errorMessage;
        setErrorMessage(errorMsg);
    } finally {
        setIsLoading(false);
    }
    return result;
};

const saveRecord = async function ({ id, api, values, setIsLoading, setError, tTranslate, tOpts, modelConfig }) {
    let requestConfig;

    if (modelConfig?.controllerType === 'cs') {
        // For 'cs' controllerType, use POST method with FormData containing action 'save' and data
        requestConfig = {
            url: `${urlWithControllers}${api}`,
            method: 'POST',
            data: utils.createCsControllerPayload('save', { ...values }),
        };
    } else {
        // Default behavior for other controller types
        let url, method;

        if (id) {
            url = `${api}/${id}`;
            method = 'PUT';
        } else {
            url = api;
            method = 'POST';
        }
        requestConfig = {
            url,
            method,
            data: values,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        };
    
    }

    try {
        setIsLoading(true);
        const response = await transport(requestConfig);
        if (response.status === HTTP_STATUS_CODES.OK) {
            const { data = {} } = response.data;
            if (data.success || response.data.success) {
                return data;
            }
            const errorMsg = tTranslate ? tTranslate('Save failed', tOpts) : 'Save failed';
            const dataMsg = tTranslate ? tTranslate(data.err || data.message || data.info, tOpts) : (data.err || data.message);
            setError(errorMsg, dataMsg);
            return;
        }
        if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
            const errorMsg = tTranslate ? tTranslate('Session Expired!', tOpts) : 'Session Expired!';
            setError(errorMsg);
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            const errorMsg = tTranslate ? tTranslate('Save failed', tOpts) : 'Save failed';
            const bodyMsg = tTranslate ? tTranslate(response.body, tOpts) : response.body;
            setError(errorMsg, bodyMsg);
        }
    } catch (error) {
        const errorMsg = tTranslate ? tTranslate('Save failed', tOpts) : 'Save failed';
        const errMsg = tTranslate ? tTranslate(error, tOpts) : error;
        setError(errorMsg, errMsg);
    } finally {
        setIsLoading(false);
    }

    return false;
};

export {
    getList,
    getRecord,
    deleteRecord,
    saveRecord,
};