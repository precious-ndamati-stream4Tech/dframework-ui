import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton } from '@mui/x-data-grid-premium';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import GridPreferences from "./GridPreference";

// CustomToolbar component - defined outside GridBase to prevent remounting
const CustomToolbar = function (props) {
    const {
        model,
        customHeaderComponent,
        currentPreference,
        isReadOnly,
        forAssignment,
        showAddIcon,
        showCreateButton,
        available,
        assigned,
        t,
        tOpts,
        classes,
        onAdd,
        onAssign,
        onUnassign,
        clearFilters,
        handleExport,
        onExportMenuClick,
        hideExcelExport,
        hideXmlExport,
        hideHtmlExport,
        hideJsonExport,
        apiRef,
        gridColumns,
        setIsGridPreferenceFetched,
        initialGridRef,
        setIsLoading,
        CustomExportButton,
        effectivePermissions,
        showExportWithDetails,
        showExportWithLatestData,
        showInFieldStatusPivotExportBtn,
        showInstallationPivotExportBtn,
        detailExportLabel
    } = props;

    console.log("currentpreference in toolbar:", currentPreference);

    return (
        <div className="grid-header-alignment" >
            <div className='grid-toolbar-heading'>
                {model.hasCustomHeaderComponent && customHeaderComponent}
                {model.gridSubTitle && <Typography variant="h6" component="h3" textAlign="center" sx={{ ml: 1 }}> {t(model.gridSubTitle, tOpts)}</Typography>}
                {(currentPreference && model.preferenceId) && <Typography className="preference-name-text" variant="h6" component="h6" textAlign="center" sx={{ ml: 1 }} > {t(currentPreference, tOpts)}</Typography>}
                {(isReadOnly || (!effectivePermissions?.add && !forAssignment) && !model.hideSubTitle) && <Typography variant="h6" component="h3" textAlign="center" sx={{ ml: 1 }} > {isReadOnly ? "" : t(model.title, tOpts)}</Typography>}
                {!forAssignment && effectivePermissions?.add && !isReadOnly && !showCreateButton && (<Button startIcon={showAddIcon ? <AddIcon /> : null} onClick={onAdd} size="medium" variant="contained" className={classes.buttons} >{model?.customAddTextTitle ? t(model.customAddTextTitle, tOpts) : ` ${showAddIcon ? `${t("Add", tOpts)}` : ""} ${t(model.title, tOpts)}`}</Button>)}
                {available && <Button startIcon={!showAddIcon ? null : <AddIcon />} onClick={onAssign} size="medium" variant="contained" className={classes.buttons}  >{t("Assign", tOpts)}</Button>}
                {assigned && !(model?.childTabs || model?.isChildGrid) && <Button startIcon={!showAddIcon ? null : <RemoveIcon />} onClick={onUnassign} size="medium" variant="contained" className={classes.buttons}  >{t("Remove", tOpts)}</Button>}
            </div>
            <GridToolbarContainer>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', width: '100%' }}>
                    {effectivePermissions?.columns && <GridToolbarColumnsButton />}
                    {effectivePermissions?.filter && <GridToolbarFilterButton />}
                    {effectivePermissions?.filter && <Button startIcon={<FilterListOffIcon />} onClick={clearFilters} size="small" sx={{ width: 'max-content' }}>{t("CLEAR FILTER", tOpts)}</Button>}
                    {effectivePermissions.export && (
                        <CustomExportButton 
                            t={t} 
                            tOpts={tOpts} 
                            handleExport={handleExport} 
                            onExportMenuClick={onExportMenuClick}
                            showPivotExportBtn={model?.showPivotExportBtn} 
                            showOnlyExcelExport={model.showOnlyExcelExport} 
                            hideExcelExport={hideExcelExport} 
                            hideXmlExport={hideXmlExport} 
                            hideHtmlExport={hideHtmlExport} 
                            hideJsonExport={hideJsonExport}
                            showExportWithDetails={showExportWithDetails}
                            showExportWithLatestData={showExportWithLatestData}
                            showInFieldStatusPivotExportBtn={showInFieldStatusPivotExportBtn}
                            showInstallationPivotExportBtn={showInstallationPivotExportBtn}
                            detailExportLabel={detailExportLabel}
                        />
                    )}
                    {model.preferenceId &&
                       <GridPreferences t={t} gridRef={apiRef} columns={gridColumns} setIsGridPreferenceFetched={setIsGridPreferenceFetched} model={model} initialGridRef={initialGridRef} setIsLoading={setIsLoading} />
                    }
                </Box>
            </GridToolbarContainer>
        </div >
    );
};

export default CustomToolbar;