import React from "react";
import { BrowserRouter as Router , Routes, Route, Navigate } from "react-router-dom";

function App() {
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<div></div>}/>
        <Route exact path="/profile/" element={<div></div>}/>        
        {!user ? (
          <Route exact path="/auth" element={<div></div>}/>
        ) : (
          <Route exact path="/auth" element={<Navigate to="/" />}/>
        )}        
      </Routes>
    </Router>
  );
}

export default App;
