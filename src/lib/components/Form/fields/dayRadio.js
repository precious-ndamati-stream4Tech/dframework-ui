import React from 'react';
import { useCallback, useState } from 'react';
import { Avatar, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, styled, useTheme } from '@mui/material';
import { deepOrange, grey } from '@mui/material/colors';
import { brandBackgroundColor } from './CustomRenderCell';


const days = [
    { label: 'Sunday', value: 0, display: 'S' },
    { label: 'Monday', value: 1, display: 'M' },
    { label: 'Tuesday', value: 2, display: 'T' },
    { label: 'Wednesday', value: 3, display: 'W' },
    { label: 'Thursday', value: 4, display: 'T' },
    { label: 'Friday', value: 5, display: 'F' },
    { label: 'Saturday', value: 6, display: 'S' },
];

const CustomAvator = styled(Avatar)(({ theme, isSelected }) => ({
    width: 34,
    height: 34,
    padding: 1,
    margin: 1,
    backgroundColor: isSelected ? brandBackgroundColor : '#ffffff',
    border: `1px solid ${grey[500]}`,
    color: isSelected ? 'white' : 'black',
}));

const DayAvatar = ({ day, onClick, isSelected }) => {
    return (
        <CustomAvator
            key={day.value}
            onClick={() => onClick(day.value)}
            isSelected={isSelected}
            style={{ margin: '4px' }}
        >
            {day.display}
        </CustomAvator>
    );
};
const DaySelection = ({ name, field, formik, expired, ...props }) => {
    const { setFieldValue } = formik;
    const { value } = formik.getFieldProps(name || field);

    const isWeekend = '1000001';
    const isWeekdays = '0111110';
    const defaultVal = "0".repeat(7);

    const [selectedDays, setSelectedDays] = useState(value || defaultVal);
    const [radioValue, setRadioValue] = useState(() => {
        if (!value) return '';
        if (value === isWeekend) return isWeekend;
        if (value === isWeekdays) return isWeekdays;
        return 'Custom';
    });
    const [presetSelected, setPresetSelected] = useState(false);
    const onAssignChange = useCallback((newValue) => {
        if (Array.isArray(newValue)) {
            let finalValue = defaultVal;
            for (const val of newValue) {
                finalValue = finalValue.substring(0, val) + "1" + finalValue.substring(val + 1);
            }
            setSelectedDays(finalValue);
            setFieldValue(name || field, finalValue);
            setPresetSelected(true);
        } else {
            let baseValue = presetSelected ? defaultVal : selectedDays;
            const finalValue = baseValue.slice(0, newValue) + (baseValue[newValue] === "1" ? "0" : "1") + baseValue.slice(newValue + 1);
            setSelectedDays(finalValue);
            setFieldValue(name || field, finalValue);
            setRadioValue('Custom');
            setPresetSelected(false);
        }
    }, [presetSelected, defaultVal, selectedDays, name, field, setFieldValue]);
    const theme = useTheme();
    const isError = formik.touched[field] && Boolean(formik.errors[field]);
    return (
        <>
            <FormControl component="fieldset" error={isError}>
                <RadioGroup
                    row
                    name={name || field}
                    value={radioValue}
                    onChange={event => {
                        const val = event.target.value;
                        setRadioValue(val);
                        if (val !== 'Custom') {
                            setSelectedDays(val);
                            setFieldValue(name || field, val);
                            setPresetSelected(true);
                        } else {
                            setSelectedDays(defaultVal);
                            setFieldValue(name || field, defaultVal);
                            setPresetSelected(false);
                        }
                    }}
                >
                    <FormControlLabel value={isWeekend} control={<Radio />} label={"Weekends (Sat - Sun)"} onClick={() => onAssignChange([0, 6])} />
                    <FormControlLabel value={isWeekdays} control={<Radio />} label={"Weekdays (Mon - Fri)"} onClick={() => onAssignChange([1, 2, 3, 4, 5])} />
                    <FormControlLabel value={'Custom'} control={<Radio />} label={"Specific days"} />
                    {days.map((day, index) => (
                        <DayAvatar
                            key={day.value}
                            day={day}
                            onClick={() => onAssignChange(index)}
                            isSelected={radioValue === 'Custom' && selectedDays[index] === "1"}
                            disabled={expired}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
            {isError && <FormHelperText style={{ color: theme.palette.error.main }}>{formik.errors[field]}</FormHelperText>}
        </>
    );
};

export default DaySelection;