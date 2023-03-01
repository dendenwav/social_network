import React, { Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { checkAuth } from "./actions/authActions";
import { IRootState } from "./reducers/_interfaces";
import * as AuthActionsInterfaces from "./actions/_interfaces";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";
import { Container, createTheme, ThemeProvider } from "@mui/material";

function App() {
    const dispatch: Dispatch<AuthActionsInterfaces.IAuthAction> = useDispatch();
    const location = useLocation();
    let userId = useSelector((state: IRootState) => state.auth.userId);

    useEffect(() => {
        checkAuth(dispatch);
    }, [dispatch, location]);
    
    console.log(userId);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#E5383B',
              },
              secondary: {
                main: '#161A1D',
              },
        },
    });

    return (
        <Container component="main" maxWidth="lg" className='main'>
            <ThemeProvider theme={theme}>
                <Routes>
                    <Route path="/" element={
                        userId ? <Home/> : <Navigate to="/auth" />
                    }/>
                    <Route path="/profile" element={
                        userId ? <div>Profile</div> : <Navigate to="/auth" />
                    }/>
                    <Route path="/auth" element={
                        userId ? <Navigate to="/" /> : <Auth/>
                    }/>
                </Routes>
            </ThemeProvider>
        </Container>
    );
}

export default App;