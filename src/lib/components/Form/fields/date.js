import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useStateContext } from '../../useRouter/StateProvider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AdapterDayjs from '@mui/x-date-pickers/AdapterDayjs';
const field = ({ column, field, fieldLabel, formik, otherProps, classes, fieldConfigs, model, mode }) => {
    let isDisabled;
    const { systemDateTimeFormat, stateData } = useStateContext(); //provider
    const dateFormat = stateData.dateTime.split(/[-/. ]/);
    const dayPlaceholder = dateFormat.find(part => part.includes('D')) || "DD";
    const monthPlaceholder = dateFormat.find(part => part.includes('M')) || "MMM";
    const yearPlaceholder = dateFormat.find(part => part.includes('Y')) || "YYYY";
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
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                {...otherProps}
                variant="standard"
                readOnly={column?.readOnly === true}
                key={field}
                fullWidth
                format={systemDateTimeFormat(true, false, stateData.dateTime)}
                name={field}
                localeText={{
                    fieldMonthPlaceholder: () => monthPlaceholder,
                    fieldDayPlaceholder: () => dayPlaceholder,
                    fieldYearPlaceholder: () => yearPlaceholder
                }}
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
        </LocalizationProvider>
    );

}

export default field;