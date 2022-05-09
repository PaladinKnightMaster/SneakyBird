import environment from '../../config/environment';
import * as Actions from './actionTypes';

function reducer(state, action) {
    switch (action.type) {
        case Actions.BOOT: {
            return { ...state, appLoaded: true, environment: environment.ethereum.network };
        }

        case Actions.WALLET_CONNECTED: {
            return { ...state, ...action.data };
        }

        default:
            throw new Error(`Missing reducer for action ${action.type}`);
    }
}

export default reducer;
