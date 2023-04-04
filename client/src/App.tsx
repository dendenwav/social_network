import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container, createTheme, ThemeProvider } from "@mui/material";
import { useSnackbar } from "notistack";

import { useAppDispatch, useAppSelector } from "./hooks";
import { CheckAuth } from "./actions/authActions";
import { IRootState } from "./reducers/_interfaces";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Loading from "./pages/Loading/Loading";
import Error from "./pages/Error/Error";
import { PAGE_NOT_FOUND } from "./constants/errorMessages";

function App() {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    let userId = useAppSelector((state: IRootState) => state.auth.userId);

    useEffect(() => {
        CheckAuth(dispatch, enqueueSnackbar);
    }, [dispatch, enqueueSnackbar]);
    
    console.log(userId);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#E5383B',
            },
            secondary: {
                main: '#000A0A',
            },
        },
    });

    if (userId === null || userId === undefined) {
        return (
            <Container component="main" maxWidth="lg" className='main'>
                <ThemeProvider theme={theme}>
                    <Loading/>
                </ThemeProvider>
            </Container>
        );
    }
    
    return (
        <Container component="main" maxWidth="lg" className='main'>
            <ThemeProvider theme={theme}>
                <Routes>
                    <Route path="/" element={
                        userId !== '' ? <Home userId={userId}/> : <Navigate to="/auth" />
                    }/>
                    <Route path="/profile/:id" element={
                        userId !== '' ? <Profile userId={userId}/> : <Navigate to="/auth" />
                    }/>
                    <Route path="/auth" element={
                        userId !== '' ? <Navigate to="/" /> : <Auth/>
                    }/>
                    <Route path="/404" element={
                        userId !== '' ? <Error errorMessage={PAGE_NOT_FOUND}/> : <Navigate to="/auth" />
                    }/>
                </Routes>
            </ThemeProvider>
        </Container>
    );
}

export default App;