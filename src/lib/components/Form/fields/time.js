import React from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

const field = ({ column, field, fieldLabel, formik, otherProps, classes }) => {
    let inputValue = formik.values[field];
    if (column.isUtc) {
        inputValue = dayjs.utc(inputValue).utcOffset(dayjs().utcOffset(), true).format();
    }
    return <TimePicker
        {...otherProps}
        variant="standard"
        readOnly={column?.readOnly === true}
        key={field}
        fullWidth
        name={field}
        value={dayjs(inputValue)}
        onChange={(value) => {
            if (column.isUtc) {
                value = (value && value.isValid()) ? value.format('YYYY-MM-DDTHH:mm:ss') + '.000Z' : null;
            }
            return formik.setFieldValue(field, value);
        }}
        onBlur={formik.handleBlur}
        helperText={formik.touched[field] && formik.errors[field]}
        slotProps={{ textField: { fullWidth: true, helperText: formik.errors[field], variant: "standard" } }}
    />
}

export default field;