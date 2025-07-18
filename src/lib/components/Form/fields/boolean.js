import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

const field = ({ column, field, fieldLabel, formik, otherProps, classes, onChange }) => {
    const handleChange = (event) => {
        formik.setFieldValue(field, event.target.checked);
    }
    const checked = useMemo(()=> formik.values[field] ?? !!column.defaultValue, [formik, column]);
    const isDisabled = typeof column.readOnly === 'function' ? column.readOnly(formik) : column.readOnly; 
    return <div key={field}>
        <FormControlLabel
            control={
                <Checkbox
                    {...otherProps}
                    name={field}
                    disabled={isDisabled || column.disabled === true}
                    checked={checked}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                />
            }
            label={fieldLabel}
        />
        <FormHelperText>{formik.touched[field] && formik.errors[field]}</FormHelperText>
    </div>
}

export default field;