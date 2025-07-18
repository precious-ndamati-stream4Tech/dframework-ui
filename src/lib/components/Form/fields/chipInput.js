import * as React from 'react';
import { FormHelperText, useTheme } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { useCallback } from 'react';

const Field = ({ isAdd, column, field, formik, otherProps, fieldConfigs = {}, mode }) => {
    const theme = useTheme();
    let inputValue = formik.values[field] || [];
    if (!Array.isArray(inputValue)) {
        inputValue = inputValue.split(',').map(item => item.trim());
    }
    const isDisabled = React.useMemo(() => {
        if (mode === 'copy') return true;
        if (typeof fieldConfigs.disabled !== 'undefined') return fieldConfigs.disabled;
        if (typeof column.disabled === 'function') return column.disabled({ isAdd, formik });
        return Boolean(column.disabled);
    }, [mode, fieldConfigs.disabled, column.disabled]);
    const fixedOptions = column.hasDefault && !isAdd ? [inputValue[0]] : [];

    const handleAutoCompleteChange = useCallback((e, newValue, action, item = {}) => {
        const lastElement = newValue.pop()?.trim();
        if (!newValue.includes(lastElement)) {
            newValue.push(lastElement);
        }
        if (fixedOptions && fixedOptions.includes(item.option) && action === "removeOption") {
            newValue = [item.option];
        }
        // multi-select values are stored as array or as comma-separated-string based on dataFormat
        if (column.dataFormat !== 'array') {
            newValue = newValue.length ? newValue.join(',') : '';
        }
        formik.setFieldValue(field, newValue);
    },[formik, field]);

    return (
        <FormControl
            fullWidth
            key={field}
            variant="standard"
            error={formik.touched[field] && Boolean(formik.errors[field])}
        >
            <Autocomplete
                {...otherProps}
                multiple
                id={field}
                freeSolo={true}
                value={inputValue}
                options={[]}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        variant="standard"
                        InputProps={{
                            ...params.InputProps,
                            sx: {
                                ...params.InputProps?.sx,
                                ...(isDisabled && { backgroundColor: theme.palette?.action?.disabled })
                            }
                        }}
                    />
                )}
                onChange={handleAutoCompleteChange}
                size="small"
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                            <Chip
                                key={key}
                                label={option}
                                {...tagProps}
                                disabled={fixedOptions.includes(option)}
                            />
                        );
                    })
                }
                disabled={isDisabled}
            />
            {formik.touched[field] && formik.errors[field] && <FormHelperText>{formik.errors[field]}</FormHelperText>}
        </FormControl>
    )
}

export default Field;