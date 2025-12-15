import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, FormControl, FormHelperText } from '@mui/material';
import { useStateContext, useRouter } from '../../useRouter/StateProvider';
import { transport } from '../../Grid/httpRequest';

const Field = ({ column, field, formik, lookups, otherProps }) => {
    const { stateData } = useStateContext();
    const { navigate } = useRouter();
    const userData = stateData?.getUserData || {};
    const { ClientId = 0 } = userData?.tags || {};
    const initialOptions = lookups ? lookups[column?.lookup] : [];
    let initialInputValue = formik.values[field]?.length > 1 ? (formik.values[field]?.split(", ")?.map(Number) || []) : ([formik.values[field]] || []);
    const [options, setOptions] = useState(initialOptions);
    const [inputValue, setInputValue] = useState(initialInputValue);
    const [optionParams, setOptionParams] = useState({ start: 0, recordCount: 0 });
    let value;
    if (Object.entries(formik?.values).length > 0) {
        value = initialOptions?.filter(option => formik?.values?.AssignedToUserId === option.value) || [];
    }
    const [selectedOption, setSelectedOption] = useState(value || '');
    const comboApi = stateData?.gridSettings?.permissions?.comboApi;
    const errorApi = stateData?.gridSettings?.permissions?.errorApi;
    
    if (column?.selectField) {
        field = column.selectField;
    }
    
    const filterOptions = (options, state) => {
        return options.filter(option => option.label.toLowerCase().startsWith(state.inputValue.toLowerCase()))
    }
    
    const fetchOptions = async () => {
        try {
            const start = optionParams.start;
            const params = { start, limit: 50, comboType: lookupKey || 'ClientUserType', asArray: 0, query: inputValue, ClientId: ClientId };
            if (column?.ParentRecordType && constants.combosLookupIds[column.comboType]) {
                if (parentRecordId === null || parentRecordId === undefined) {
                    const parentFieldName = column.ParentRecordType.endsWith('Id')
                        ? `${column.ParentRecordType}Id`
                        : column.ParentRecordType;
                    parentRecordId = formik?.values?.[parentFieldName];
                }
                params['ScopeId'] = parentRecordId;
                params['ParentRecordType'] = column.ParentRecordType;
                if (column.comboType === 'State') {
                    delete params['ClientId'];
                }
            }
            const response = await transport({ params, api: comboApi });
            const result = await response.json();
            
            if (result?.records && result.records.length > 0) {
                setOptionParams({ start: start + 50, recordCount: result.recordCount });
                return result.records.map(item => ({ label: item.DisplayValue, value: item.LookupId }));
            } else {
                return [];
            }
        } catch (error) {
            if (errorApi) {
                fetch(errorApi, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ errorMsg: `Error fetching options: ${error}`, appName: 'DFramework-UI' })
                }).catch(() => {});
            }
            return [];
        }
    }
    
    useEffect(() => {
        if (
            inputValue !== undefined && inputValue !== 'undefined' &&
            (!Array.isArray(inputValue) || !inputValue.includes(undefined))
        ) {
            fetchOptions().then((result) => setOptions(result));
        }
    }, [inputValue]);

     // Watch parent field changes (for ParentRecordType)
    useEffect(() => {
        if (column?.ParentRecordType && formik?.values) {
            const parentFieldName = column.ParentRecordType.endsWith('Id')
                ? column.ParentRecordType
                : `${column.ParentRecordType}Id`;
            const parentValue = formik.values[parentFieldName];

            // If parent value changes, re-fetch options and clear current selection
            if (parentValue) {
                fetchOptions(parentValue).then((result) => {
                    setOptions(result);
                    // Clear the current selection when parent changes
                    formik.setFieldValue(field, '');
                    setSelectedOption(null);
                });
            } else {
                // If parent is cleared, clear options and selection
                setOptions([]);
                setSelectedOption(null);
            }
        }
    }, [column?.ParentRecordType && formik?.values?.[column.ParentRecordType.endsWith('Id') ? column.ParentRecordType : `${column.ParentRecordType}Id`]]);

    useEffect(() => {
        if (!formik.values) return;

        const sourceOptions = initialOptions || options;
        const option = sourceOptions?.find(
            opt => opt.value === formik.values[field]
        );

        setSelectedOption(option);
    }, [formik.values, initialOptions, options])

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        setOptionParams({ start: 0, recordCount: 0 });
        setOptions([]);
    };
    
    const handlePagiation = async (event) => {
        const listBox = event.target;
        if (listBox.scrollTop + listBox.clientHeight >= listBox.scrollHeight) {
            if (options.length >= optionParams.recordCount || optionParams.start >= optionParams.recordCount) return;
            const result = await fetchOptions();
            setOptions(options.concat(result));
        }
    }
    
    const handleChange = (event, newValue) => {
        formik?.setFieldValue(column?.selectField, newValue?.value || '');
        setSelectedOption(newValue);
        setInputValue(newValue ? newValue.label : '');
    };

    return (
        <FormControl fullWidth variant="standard" error={formik.touched[field] && Boolean(formik.errors[field])} className='singleAutoCompleteClass'>
            <Autocomplete
                {...otherProps}
                options={options}
                getOptionLabel={(option) => option.label}
                filterOptions={filterOptions}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                value={selectedOption}
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                    />
                )}
                ListboxProps={{
                    onScroll: handlePagiation
                }}
            />
            {formik.touched[field] && formik.errors[field] && <FormHelperText>{formik.errors[field]}</FormHelperText>}
        </FormControl>
    );
};

export default Field;
