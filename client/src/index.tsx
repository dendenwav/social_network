import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SnackbarProvider } from 'notistack';

import { SnackbarCloseButton } from './components/toast/SnackbarCloseButton';
import rootReducer from './reducers/index';
import App from './App';

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

const container = document.getElementById('root') as HTMLElement;

const root = createRoot(container);

root.render(
    <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={6000} 
        action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}>
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/*" element={<App />} />
                </Routes>
            </Router>
        </Provider>
    </SnackbarProvider>
);