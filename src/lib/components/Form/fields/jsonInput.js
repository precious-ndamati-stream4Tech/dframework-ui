import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import debounce from 'lodash/debounce';

const Field = ({ field, formik }) => {
    const [state, setState] = React.useState({});
    React.useEffect(() => {
        if (!formik.values[field]) return;
        try {
            const inputJSON = JSON.parse(formik.values[field]);
            setState(inputJSON);
        } catch (e) {
            setState({});
        }
    }, [formik.values[field]]);

    const handleDebouncedChange = React.useMemo(
        () =>
            debounce((newState) => {
                formik.setFieldValue(field, JSON.stringify(newState));
            }, 300),
        [formik, field]
    );

    const handleChange = (key, value) => {
        const updatedState = { ...state, [key]: value };
        setState(updatedState);
        handleDebouncedChange(updatedState);
    };

    React.useEffect(() => {
        return () => {
            handleDebouncedChange.cancel();
        };
    }, [handleDebouncedChange]);

    return (
        <FormControl
            fullWidth
            key={field}
            variant="standard"
            error={formik.touched[field] && Boolean(formik.errors[field])}
            style={{ marginBottom: '1rem' }}
        >
            {Object.keys(state).map((key) => (
                <div
                    key={key}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem'
                    }}
                >
                    <Typography variant="body1" sx={{ width: "180px", marginRight: 2 }}>
                        {key}:
                    </Typography>
                    <Input
                        id={key}
                        name={key}
                        value={state[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        fullWidth
                        style={{ flex: 2 }}
                    />
                </div>
            ))}
        </FormControl>
    );
};

export default Field;