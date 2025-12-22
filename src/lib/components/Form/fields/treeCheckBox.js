import React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
/**
 * Builds a tree structure from a flat array of data.
 * 
 * @param {Array<Object>} data - The array of items to build the tree from.
 * @param {string|number} data[].ParentId - The ID of the parent item.
 * @param {string} data[].ParentName - The label for the parent item.
 * @param {string|number} data[].value - The unique value of the item.
 * @param {string} data[].label - The label for the item.
 * @returns {Array<Object>} The tree structure containing parent and child nodes.
 */
const buildTree = (data = []) => {
  const tree = {};
  data.forEach((item) => {
    if (item.ParentId && tree[item.ParentId]) {
      tree[item.ParentId].children.push({
        value: item.value?.toString(),
        label: item.label
      });
    } else {
      tree[item.ParentId] = {
        label: item.ParentName,
        value: "Parent" + item.ParentId.toString(),
        children: [{
          value: item.value?.toString(),
          label: item.label
        }]
      };
    }
  });
  return Object.values(tree);
};

/**
 * Renders a tree view component with checkboxes for selection.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.column - The column metadata, including lookup information.
 * @param {string} props.field - The name of the field in the form to bind.
 * @param {Object} props.formik - The Formik instance for managing form state.
 * @param {Object} props.lookups - The lookup data for populating tree items.
 * @param {Array<Object>} props.data - Additional data for the tree.
 * @param {Object} props.otherProps - Other props for customization.
 * @param {Object} props.model - The model configuration.
 * @param {Object} props.fieldConfigs - Configuration for the field, including disabled state.
 * @param {string} props.mode - The mode of the form, such as 'edit' or 'copy'.
 * @returns {JSX.Element} The rendered tree view component.
 */
export default function treeCheckBox({ column, field, formik, lookups, fieldConfigs, mode }) {
  const options = lookups ? lookups[column.lookup] : [];
  const tree = buildTree(options);
  const inputValue = formik.values[field]?.length ? formik.values[field].split(", ") : [];
  let isDisabled;
  if (mode !== 'copy') {
    isDisabled = fieldConfigs?.disabled;
  }
  const handleChange = (_, newValue) => {
    formik.setFieldValue(field, newValue?.join(', ') || '');
  };
  return (
    <Box sx={{ minHeight: 350 }}>
      <SimpleTreeView
        selectedItems={inputValue}
        onSelectedItemsChange={handleChange}
        disabled={isDisabled}
        multiSelect
        checkboxSelection
      >
        {tree.map((node) => (
          <TreeItem key={node.value} itemId={node.value} label={node.label}>
            {node.children.map((child) => (
              <TreeItem key={child.value} itemId={child.value} label={child.label} />
            ))}
          </TreeItem>
        ))}
      </SimpleTreeView>
    </Box>
  );
}