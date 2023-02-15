import React, { useContext } from "react";
import { BrowserRouter as Router , Routes, Route, Navigate } from "react-router-dom";
import { AuthorizationProvider, AuthorizationContext } from "./context/AuthorizationContext";
import Auth from "./pages/Auth/Auth";

function App() {
    const { authorization } = useContext(AuthorizationContext);

    console.log(authorization);

    return (
        <AuthorizationProvider>
            <Router>
                <Routes>
                    <Route exact path="/" element={
                        authorization ? <div>Home</div> : <Navigate to="/auth" />                        
                    }/>
                    <Route exact path="/profile" element={
                        authorization ? <div>Profile</div> : <Navigate to="/auth" />
                    }/>        
                    <Route exact path="/auth" element={
                        authorization ? <Navigate to="/" /> : <Auth/>
                    }/>
                </Routes>
            </Router>
        </AuthorizationProvider>
    );
}

export default App;
