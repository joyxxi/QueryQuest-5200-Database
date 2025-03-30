import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import QueryQuest from "./QueryQuest";
import Signin from "./QueryQuest/Account/Signin";
import Signup from "./QueryQuest/Account/Signup";

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="QueryQuest/Signin" />} />
          {/* Standalone pages */}
          <Route path="/QueryQuest/Signin" element={<Signin />} />
          <Route path="/QueryQuest/Signup" element={<Signup />} />
          {/* Pages with Sidebar */}
          <Route path="/QueryQuest/*" element={<QueryQuest />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
