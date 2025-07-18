import React from 'react';
import { Typography } from "@material-ui/core";
export default function MuiTypography({ variant = "h2", component = "h2", text = '', name = null, ...rest }) {
    return (<Typography variant={variant} component={component} {...rest}>
        {text && text || ''} {name && name}
    </Typography>)
}