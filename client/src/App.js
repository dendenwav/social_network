import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import { checkAuth } from "./actions/authActions";

function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    let auth = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch, location]);
    
    console.log(auth.userId);

    return (
        <Routes>
            <Route exact path="/" element={
                auth.userId ? <div>Home</div> : <Navigate to="/login" />                        
            }/>
            <Route exact path="/profile" element={
                auth.userId ? <div>Profile</div> : <Navigate to="/login" />
            }/>
            <Route exact path="/login" element={
                auth.userId ? <Navigate to="/" /> : <Login/>
            }/>
            <Route exact path="/register" element={
                auth.userId ? <Navigate to="/" /> : <Register/>
            }/>
        </Routes>
    );
}

export default App;
