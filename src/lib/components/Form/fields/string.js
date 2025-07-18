import TextField from '@mui/material/TextField';
import React from 'react';
import { useTheme } from '@mui/material';

const field = ({ column, field, formik, otherProps }) => {
    const theme = useTheme();
    const rows = column.rows || (column.multiline ? 5 : 1);
    return <TextField
        type="text"
        variant="standard"
        InputProps={{
            readOnly: column.readOnly === true,
            sx: column.readOnly
                ? { backgroundColor: theme.palette?.action?.disabled } // Light grey background for read-only inputs
                : undefined
        }}
        key={field}
        required={column?.required}
        fullWidth
        name={field}
        value={formik.values[field]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[field] && Boolean(formik.errors[field])}
        helperText={formik.touched[field] && formik.errors[field]}
        {...otherProps}
    />
};

export default field;