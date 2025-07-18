import * as locales from '@mui/x-data-grid';
export const elGRGrid = {
    Jumptopage: 'Μετάβαση στη σελίδα',
    Go: 'Πηγαίνω',
    InthisspacewewillsoonbringyouadashboardofmainoverviewKPIsforeasyaccess: 'Σε αυτόν τον χώρο θα σας φέρουμε σύντομα έναν πίνακα ελέγχου βασικών επισκόπησης KPI για εύκολη πρόσβαση',
    Pages: 'Σελίδες',
    MuiTablePagination: {
        labelRowsPerPage: 'Σειρές ανά σελίδα',
    }
};
const mergedLocalizationDataelGR = {
    ...locales['elGR'],
    ...elGRGrid,
};

export default mergedLocalizationDataelGR;