import * as locales from '@mui/x-data-grid';
export const daDKGrid = {

    Jumptopage: 'Gå til side',
    Go: 'Gå',
    InthisspacewewillsoonbringyouadashboardofmainoverviewKPIsforeasyaccess: 'I dette rum vil vi snart bringe dig et dashboard med hovedoversigt KPIer for nem adgang',
    Pages: 'sider',
    MuiTablePagination: {
        labelRowsPerPage: 'Rækker pr. side',
    }
};
const mergedLocalizationDatadaDK = {
    ...locales['daDK'],
    ...daDKGrid,
};
export default mergedLocalizationDatadaDK;
