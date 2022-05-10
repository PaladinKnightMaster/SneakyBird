import { useReducer, createContext } from 'react';
import { actions, reducer } from '../store/AppState';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { withDevTools } from '../store/withDevTools';

const AppContext = createContext();

export const INITIAL_STATE = {
    appLoaded: false,
    wallet: undefined,
};

export function AppStateProvider({ children }) {
    const [state, baseDispatch] = useReducer(reducer, INITIAL_STATE);

    const { dispatch } = withDevTools(baseDispatch, reducer, INITIAL_STATE);

    return <AppContext.Provider value={[state, dispatch]}>{children}</AppContext.Provider>;
}

export function useAppState() {
    const [state, dispatch] = useContext(AppContext);
    return { state, actions: actions({ dispatch }) };
}

AppStateProvider.propTypes = {
    children: PropTypes.node,
};
