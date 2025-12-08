import actionsStateProvider from "./actions";
const stateReducer = (state, action) => {
    switch (action.type) {
        case actionsStateProvider.UPDATE_LOCALIZATION:
            return { ...state, dataLocalization: action.payload };
        case actionsStateProvider.UPDATE_DATE_TIME:
            return { ...state, dateTime: action.payload };
        case actionsStateProvider.UPDATE_FORM_MODE:
            return { ...state, dataForm: action.payload };
        case actionsStateProvider.PAGE_TITLE_DETAILS:
            return { ...state, pageTitleDetails: action.payload };
        case actionsStateProvider.OPEN_MODAL:
            return { ...state, modal: action.payload };
        case actionsStateProvider.SET_PAGE_BACK_BUTTON:
            return { ...state, pageBackButton: action.payload };
        case actionsStateProvider.SET_GRID_SETTINGS:
            return { ...state, gridSettings: action.payload };
        case actionsStateProvider.SET_LOCAL_LOCALIZATION:
            return { ...state, getLocal: action.payload };
        case actionsStateProvider.USER_DATA:
            return { ...state, getUserData: action.payload };
        case actionsStateProvider.UDPATE_PREFERENCES:
            return { ...state, preferences: action.payload }
        case actionsStateProvider.SET_CURRENT_PREFERENCE_NAME:
            // Handle both object payload (with model key) and string payload (for backward compatibility)
            if (typeof action.payload === 'object' && action.payload !== null && action.payload.model) {
                return { 
                    ...state, 
                    currentPreference: { 
                        ...(state.currentPreference || {}), 
                        [action.payload.model]: action.payload.currentPreference 
                    } 
                };
            }
            return { ...state, currentPreference: action.payload }
        case actionsStateProvider.TOTAL_PREFERENCES:
            return { ...state, totalPreferences: action.payload }
        case actionsStateProvider.UPDATE_LOADER_STATE:
            return { ...state, loaderOpen: action.payload }
        case actionsStateProvider.PASS_FILTERS_TOHEADER:
                return { ...state, filtersInHeader: action.payload }
        default:
            return state;
    }
};
export default stateReducer;