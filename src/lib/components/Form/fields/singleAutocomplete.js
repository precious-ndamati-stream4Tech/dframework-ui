import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, FormControl, FormHelperText } from '@mui/material';
import { useStateContext, useRouter } from '../../useRouter/StateProvider';

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
            const params = new URLSearchParams({
                start,
                limit: 50,
                comboType: column?.comboType || 'ClientUserType',
                asArray: 0,
                query: inputValue,
                ClientId: ClientId
            });
            
            const response = await fetch(`${comboApi}?${params}`);
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

    useEffect(() => {
        if (formik.values) {
            let option;
            if (initialOptions) {
                option = initialOptions.find(option => option.value === formik.values[field]);
            } else if (options) {
                option = options.find(option => option.value === formik.values[field]);
            }
            setSelectedOption(option);
        }
    }, [formik.values, options]);

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        setOptionParams({ start: 0, recordCount: 0 });
        setOptions([]);
    };
    
    const handlePagiation = async (event) => {
        const listBox = event.target;
        if (listBox.scrollTop + listBox.clientHeight >= listBox.scrollHeight) {
            let alreadyExistingOptions = options;
            if (alreadyExistingOptions.length >= optionParams.recordCount || optionParams.start >= optionParams.recordCount) return;
            const result = await fetchOptions();
            alreadyExistingOptions = alreadyExistingOptions.concat(result);
            setOptions(alreadyExistingOptions);
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
