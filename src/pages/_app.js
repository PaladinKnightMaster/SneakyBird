import AppContainer from '../components/AppContainer';
import { AppStateProvider } from '../context/AppContext';

import '../styles/globals.css';
/* eslint-disable-next-line */
function MyApp(props) {
    return (
        <AppStateProvider>
            <AppContainer {...props} />
        </AppStateProvider>
    );
}

export default MyApp;
