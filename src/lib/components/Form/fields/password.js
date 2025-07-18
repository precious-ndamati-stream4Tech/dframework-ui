import React from 'react';
import StringField from './string';

const field = ({ otherProps, ...props }) => {
    otherProps = {
        type: 'password',
        ...otherProps
    }
    return <StringField otherProps={otherProps} {...props} />
}

export default field;