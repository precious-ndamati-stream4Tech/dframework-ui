import React, { useCallback, useMemo } from 'react';
import StringField from './string';
import { debounce } from 'lodash';
import { useTheme } from '@mui/material';

// Key code constants
const DIGIT_START = 47;
const DIGIT_END = 58;
const ARROW_LEFT = 37;
const ARROW_RIGHT = 40;

// Control key codes
const CONTROL_KEYS = [8, 46, 9, 27, 13]; // backspace, delete, tab, escape, enter
const resolveValue = ({ value, state }) => {
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        const key = value.slice(1, -1); // Extract key inside the braces
        return state[key] !== undefined ? state[key] : value;
    }
    return value;
};
const Field = ({ column, otherProps, formik, field, ...props }) => {
    const { min, max } = column;
    const theme = useTheme();

    const resolvedMin = useMemo(
        () => Math.max(0, resolveValue({ value: min, state: formik.values })),
        [min, formik.values]
    );
    const resolvedMax = useMemo(
        () => resolveValue({ value: max, state: formik.values }),
        [max, formik.values]
    );

    const debouncedSetFieldValue = useCallback(
        debounce((field, value) => {
            if (value < resolvedMin) {
                formik.setFieldValue(field, resolvedMin);
            } else if (resolvedMax && value > resolvedMax) {
                formik.setFieldValue(field, resolvedMax);
            } else {
                formik.setFieldValue(field, value);
            }
        }, 400),
        [resolvedMin, resolvedMax, formik.setFieldValue]
    );

    const { onBlur } = props;
    otherProps = {
        InputProps: {
            inputProps: {
                min: resolvedMin,
                max: resolvedMax,
                readOnly: column.readOnly === true,
                onKeyDown: (event) => {
                    const keyCode = event.which ? event.which : event.keyCode;
                    // Allow: backspace, delete, tab, escape, enter, arrows
                    if (CONTROL_KEYS.includes(keyCode) || (keyCode >= ARROW_LEFT && keyCode <= ARROW_RIGHT)) {
                        return;
                    }
                    // Allow number keys (0-9)
                    if (!(keyCode > DIGIT_START && keyCode < DIGIT_END)) {
                        event.preventDefault();
                    }
                },
                sx: column.readOnly
                    ? { backgroundColor: theme.palette?.action?.disabled } // Light grey background for read-only inputs
                    : undefined,
            }
        },
        type: 'number',
        ...otherProps,
        onChange: (event) => {
            debouncedSetFieldValue(field, Number(event.target.value)); // Pass the updated value to the debounced function
            if (typeof onBlur === "function") {
                onBlur(event);
            }
        },
    };

    return <StringField column={column} otherProps={otherProps} formik={formik} field={field} {...props} />;
};

export default Field;