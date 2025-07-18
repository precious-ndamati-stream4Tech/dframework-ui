import * as React from 'react';
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useCascadingLookup from '../../../hooks/useCascadingLookup';

const consts = {
    limitTags: 5
}

const Field = React.memo(({ column, field, formik, lookups, dependsOn = [], fieldConfigs = {}, mode, model, ...otherProps }) => {
    const options = useCascadingLookup({ column, formik, lookups, dependsOn, model, isAutoComplete: true });
    let inputValue = formik.values[field] || [];
    if (!Array.isArray(inputValue)) {
        inputValue = inputValue.split(", ").map(Number);
    }
    const filteredCombos = options.filter(option => inputValue.includes(option.value)) || [];
    const isDisabled = mode !== 'copy' && fieldConfigs.disabled;
    const handleAutoCompleteChange = (_, newValue) => {
        let toSave = newValue?.map(val => val.value) || [];
        // multi-select values are stored as array or as comma-separated-string based on dataFormat
        if (column.dataFormat !== 'array') {
            toSave = toSave.length ? toSave.join(', ') : '';
        }
        formik.setFieldValue(field, toSave);
    };

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
                options={options || []}
                getOptionLabel={(option) => option.label || ''}
                defaultValue={filteredCombos}
                renderInput={(params) => <TextField {...params} variant="standard" />}
                onChange={handleAutoCompleteChange}
                value={filteredCombos}
                size="small"
                disabled={isDisabled}
            />
            {formik.touched[field] && formik.errors[field] && <FormHelperText>{formik.errors[field]}</FormHelperText>}
        </FormControl>
    )
});

export default Field;

