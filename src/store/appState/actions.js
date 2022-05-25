import { BOOT, WALLET_CONNECTED } from './actionTypes';

function AppStateActions({ dispatch }) {
    return {
        boot() {
            dispatch({ type: BOOT });
        },

        walletConnected(data) {
            dispatch({ type: WALLET_CONNECTED, data });
        },
    };
}

export default AppStateActions;
