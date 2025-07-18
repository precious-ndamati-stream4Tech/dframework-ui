import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useStateContext } from '../../useRouter/StateProvider';
const field = ({ column, field, fieldLabel, formik, otherProps, classes, fieldConfigs, model, mode }) => {
    let isDisabled;
    const { systemDateTimeFormat, stateData } = useStateContext(); //provider
    if (mode !== 'copy') {
        isDisabled = fieldConfigs?.disabled;
    }
    const shouldDisableDate = column.shouldDisableDate ? column.shouldDisableDate : null;
    let helperText;
    if (isDisabled && column.showErrorText) {
        helperText = model?.helperText;
    } else if (formik.touched[field] && formik.errors[field]) {
        helperText = formik.errors[field];
    }
    const showError = !!helperText;
    const props = { variant: "standard", error: showError };
    return <DatePicker
        {...otherProps}
        variant="standard"
        readOnly={column?.readOnly === true}
        key={field}
        fullWidth
        format={systemDateTimeFormat(true, false, stateData.dateTime)}
        name={field}
        value={dayjs(formik.values[field])}
        onChange={(value) => {
            const adjustedDate = dayjs(value).hour(12);
            const isoString = adjustedDate.toISOString();
            formik.setFieldValue(field, isoString);
        }}
        onBlur={formik.handleBlur}
        helperText={formik.touched[field] && formik.errors[field]}
        disablePast={column?.disablePast}
        disabled={isDisabled}
        shouldDisableDate={date => shouldDisableDate ? shouldDisableDate(date, formik) : false}
        slotProps={{ textField: { fullWidth: true, helperText, ...props } }}
    />

}

export default field;