import React from 'react';
import StringField from './string';

const field = ({ column, otherProps, formik, field, ...props }) => {
    const { minValue: min, maxValue: max } = column;
    const isDecimal = column.type === 'decimal';
    const minKey = 47;
    const maxKey = 58;
    otherProps = {
        InputProps: {
            inputProps: {
                min: isDecimal ? min : Math.max(0, min),
                max,
                readOnly: column?.readOnly === true,
                onKeyPress: (event) => {
                    const keyCode = event.which ? event.which : event.keyCode;
                    const currentValue = event.target.value;

                    // Allow digits (48-57)
                    if (keyCode > minKey && keyCode < maxKey) {
                        return;
                    }

                    // For decimal type, allow decimal point (46) and minus sign (45)
                    if (isDecimal) {
                        // Allow minus sign only at the beginning
                        if (keyCode === 45 && currentValue.length === 0) {
                            return;
                        }
                        // Allow decimal point only if not already present
                        if (keyCode === 46 && !currentValue.includes('.')) {
                            return;
                        }
                    }

                    event.preventDefault();
                },
            }
        },
        type: 'number',
        ...otherProps,
        onBlur: (event) => {
            const minValue = isDecimal ? (min !== undefined ? min : -Infinity) : Math.max(0, min);
            if (event.target.value && event.target.value < minValue) {
                formik.setFieldValue(field, minValue === -Infinity ? 0 : minValue);
            }
            if (props.onBlur) {
                props.onBlur(event);
            }
        },
    }
    return <StringField column={column} otherProps={otherProps} formik={formik} field={field} {...props} />;
};

export default field;   