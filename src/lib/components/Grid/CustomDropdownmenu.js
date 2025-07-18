import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    useGridSelector,
    gridFilterModelSelector,
} from '@mui/x-data-grid-premium';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const GridOperators = {
    IsAnyOf: 'isAnyOf'
};

const CustomDropdownmenu = (props) => {
    const { column, item, applyValue, apiRef } = props;
    const lookupData = column?.dataRef?.current?.lookups;
    let options = column.customLookup || lookupData[column.lookup] || [];

    if (typeof column.lookup === 'string') {
        options = options.map(({ label, value, scopeId, ...option }) => ({
            label: label,
            value: value
        }));
    }

    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const currentFieldFilters = useMemo(
        () =>
            filterModel.items?.filter((value) => {
                return value.field === column.field;
            }),
        [column.field, filterModel.items]
    );

    const handleFilterChange = useCallback(
        (event) => {
            let inputValue = event.target.value;
            let isAnyOfFilter = false;
            if (filterModel.items.length >= 1) {
                inputValue = inputValue.length === 1 ? inputValue[0] : inputValue;

                for (const element of filterModel.items) {
                    if (element.field !== item.field) {
                        continue;
                    }
                    if (element.operator === GridOperators.IsAnyOf) {
                        inputValue = Array.isArray(inputValue) ? inputValue : [inputValue];
                        isAnyOfFilter = true;
                    } else {
                        isAnyOfFilter = false;
                        inputValue = inputValue === 0 ? '0' : inputValue;
                    }
                }
            }

            if (inputValue.length === 0) {
                if (currentFieldFilters[0]) {
                    apiRef.current.deleteFilterItem(currentFieldFilters[0]);
                }
                return;
            }

            const newValue = inputValue;
            const newitem = currentFieldFilters[0] ? currentFieldFilters[0] : item
            applyValue({ ...newitem, value: newValue });
        },
        [apiRef, column.applyZeroFilter, currentFieldFilters, item, applyValue]
    );

    const value = currentFieldFilters[0]?.value ?? '';

    return (
        <FormControl variant="standard" className="w-100">
            <InputLabel></InputLabel>
            <Select
                label={column.field}
                variant="standard"
                value={value}
                onChange={(e) => handleFilterChange(e)}
                multiple={Array.isArray(value)}
                MenuProps={{
                    PaperProps: {
                        style: {
                            height: 'fit-content',
                            overflow: 'hidden'
                        },
                    },
                }}
            >
                {options?.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CustomDropdownmenu;
