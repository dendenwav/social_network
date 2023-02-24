import React, { Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { checkAuth } from "./actions/authActions";
import { IRootState } from "./reducers/_interfaces";
import * as AuthActionsInterfaces from "./actions/_interfaces";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

function App() {
    const dispatch: Dispatch<AuthActionsInterfaces.IAuthAction> = useDispatch();
    const location = useLocation();
    let userId = useSelector((state: IRootState) => state.auth.userId);

    useEffect(() => {
        checkAuth(dispatch);
    }, [dispatch, location]);
    
    console.log(userId);

    return (
        <Routes>
            <Route path="/" element={
                userId ? <Home/> : <Navigate to="/login" />
            }/>
            <Route path="/profile" element={
                userId ? <div>Profile</div> : <Navigate to="/login" />
            }/>
            <Route path="/login" element={
                userId ? <Navigate to="/" /> : <Login/>
            }/>
            <Route path="/register" element={
                userId ? <Navigate to="/" /> : <Register/>
            }/>
        </Routes>
    );
}

export default App;