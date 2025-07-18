import React from "react";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, FormHelperText, useTheme } from "@mui/material";

const Field = ({ field, formik, orientation = "row", label, lookups, fieldConfigs, mode, ...otherProps }) => {
    const handleChange = (event) => {
        formik.setFieldValue(field, event.target.value);
    }

    const options = lookups ? lookups[otherProps?.column.lookup] : [];
    const theme = useTheme();
    const isError = formik.touched[field] && Boolean(formik.errors[field]);
    let isDisabled;
    if (mode !== 'copy') {
        isDisabled = fieldConfigs?.disabled;
    }
    return (
        <>
            <FormControl component="fieldset" error={isError}>
                <FormLabel component="legend">{label}</FormLabel>
                <RadioGroup
                    row={orientation === "row"}
                    aria-label={label}
                    name={field}
                    value={formik.values[field]}
                    onChange={handleChange}
                >
                    {options?.map((option, index) => (
                        <FormControlLabel
                            key={index}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}
                            disabled={isDisabled}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
            {isError && <FormHelperText style={{ color: theme.palette.error.main }}>{formik.errors[field]}</FormHelperText>}
        </>
    );
};

export default Field;
