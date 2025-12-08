import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import utils from '../utils';

const t = utils.t;

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function ChildGridComponent({ tabs, selected, childGridTitle, showChildGrids, hideChildGrids }) {
    const [value, setValue] = React.useState(0);
    const [gridFilters, setGridFilters] = React.useState([]);
    const { t: translate, i18n } = useTranslation();
    const tOpts = { t: translate, i18n };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const updateGridFilters = (e) => {
        setGridFilters(e);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {tabs?.map((tab, index) => {
                        const { label } = tab;
                        return <Tab label={t(label, tOpts)} {...a11yProps(index)} />
                    })}
                </Tabs>
            </Box>
            {tabs?.map((tab, index) => {
                const { config, label } = tab;
                return <CustomTabPanel value={value} index={index} key={label}>
                    {showChildGrids ?
                        <config.Grid gridFilters={gridFilters} updateGridFilters={updateGridFilters} selected={selected} assigned={true} childTabTitle={childGridTitle}></config.Grid> :
                        <div className='pd-2'>{t("Please select a record to see it's details", tOpts)}</div>
                    }
                </CustomTabPanel>
            })}
        </Box>
    );
}