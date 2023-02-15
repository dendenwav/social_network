import React, { useContext } from "react";
import { BrowserRouter as Router , Routes, Route, Navigate } from "react-router-dom";
import { AuthorizationProvider, AuthorizationContext } from "./context/AuthorizationContext";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";

function App() {
    const { authorization } = useContext(AuthorizationContext);

    console.log(authorization);

    return (
        <AuthorizationProvider>
            <Router>
                <Routes>
                    <Route exact path="/" element={
                        authorization ? <div>Home</div> : <Navigate to="/login" />                        
                    }/>
                    <Route exact path="/profile" element={
                        authorization ? <div>Profile</div> : <Navigate to="/login" />
                    }/>
                    <Route exact path="/login" element={
                        authorization ? <Navigate to="/" /> : <Login/>
                    }/>
                    <Route exact path="/register" element={
                        authorization ? <Navigate to="/" /> : <Register/>
                    }/>
                </Routes>
            </Router>
        </AuthorizationProvider>
    );
}

export default App;
