const win = typeof window !== 'undefined' ? window : null;

let state;
let initializedDevTools = null;
/**
 * if we have redux dev tools installed,
 * connect and init
 */
export const getDevTools = () => {
    if (initializedDevTools) return initializedDevTools;
    // eslint-disable-next-line no-underscore-dangle
    if (win?.__REDUX_DEVTOOLS_EXTENSION__) {
        // eslint-disable-next-line no-underscore-dangle
        initializedDevTools = win?.__REDUX_DEVTOOLS_EXTENSION__.connect();
        initializedDevTools?.init();

        // adding support for using devtools without sending current state
        // this allows devtools.send to be used without
        // knowledge of current state (outside the scope of react context)
        const originalSend = initializedDevTools.send;
        initializedDevTools.send = (action, newState = state) => {
            originalSend(action, newState);
        };
    }
    return initializedDevTools;
};

/**
 * withDevTools is a higher order function that
 * sends all dispatches and state updates to redux
 * dev tools, if it's installed
 *
 * @param dispatch Dispatch
 * @param reducer Reducer
 */
export const withDevTools = (dispatch, reducer, baseState) => {
    const devTools = getDevTools();
    return {
        dispatch: (action) => {
            // first dispatch the actions so the app can continue
            dispatch(action);

            if (!devTools) {
                return;
            }

            try {
                // create a new state
                const newState = reducer(state || baseState, action);
                state = newState;
                devTools.send(action, newState);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error('error in withDevTools', e);
            }
        },
    };
};
