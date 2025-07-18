import React, {
  memo,
  useState
} from "react";
import PropTypes from 'prop-types';
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import { UiModel } from "../Grid/ui-models";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

/**
 * Memoized ChildGrid Component
 * @param {Object} params - Parameters for rendering the child grid
 * @param {string} params.relation - Name of the related model
 * @param {Object} params.parentFilters - Filters to apply to the parent
 * @param {Object} params.parent - Parent data
 * @param {Object} params.where - Conditions for the grid
 * @param {Array} params.models - List of available models
 */
const ChildGrid = memo(({ relation, parentFilters, parent, where, models, readOnly }) => {
  const modelConfigOfChildGrid = models.find(({ name }) => name === relation);
  if (!modelConfigOfChildGrid) return null;
  const config = { ...modelConfigOfChildGrid, hideBreadcrumb: true };
  const ChildModel = config instanceof UiModel ? config : new UiModel(config);
  if (!ChildModel) return null;

  return (
    <ChildModel.ChildGrid
      readOnly={readOnly}
      parentFilters={parentFilters}
      parent={parent}
      model={config}
      where={where}
      isChildGrid={true}
    />
  );
});

/**
 * Relations component using MUI Tabs
 * Renders a tab for each relation, and a ChildGrid in each panel
 */
const Relations = ({ relations, parent, where = [], models, relationFilters, readOnly }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange} aria-label="relations tabs">
          {relations.map((relation, idx) => {
            const modelConfigOfChildGrid = models.find(({ name }) => name === relation) || {};
            const label = modelConfigOfChildGrid.listTitle || modelConfigOfChildGrid.title || relation;
            return (
              <Tab
                key={relation}
                label={label}
                {...a11yProps(idx)}
              />
            );
          })}
        </Tabs>
      </Box>
      {relations.map((relation, idx) => (
        <CustomTabPanel value={tabIndex} index={idx} key={relation}>
          <ChildGrid
            readOnly={readOnly}
            relation={relation}
            key={relation}
            models={models}
            parentFilters={relationFilters[relation] || []}
            parent={parent}
            where={where}
          />
        </CustomTabPanel>
      ))}
    </Box>
  );
};

export default Relations;