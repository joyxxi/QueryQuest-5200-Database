import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Navigation from "./QueryQuest/Navigation";
import Account from "./QueryQuest/Account";
import Signin from "./QueryQuest/Account/Signin";
import Signup from "./QueryQuest/Account/Signup";
import Problem from "./QueryQuest/Problem";
import Message from "./QueryQuest/Message";
function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="QueryQuest/Signin" />} />
          {/* Standalone pages */}
          <Route path="/Queryquest/Signin" element={<Signin />} />
          <Route path="/Queryquest/Signup" element={<Signup />} />
          {/* Pages with Sidebar */}
          <Route path="/Queryquest/*" element={<LayoutWithSidebar />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

// Layout that includes the sidebar for all pages except Signin and Signup
function LayoutWithSidebar() {
  return (
    <div style={{ display: "flex" }}>
      <Navigation />
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="Account/*" element={<Account />} />
          <Route path="Problem" element={<Problem />} />
          <Route path="Message" element={<Message />} />
          <Route path="/" element={<Account />} /> {/* Default to Account */}
        </Routes>
      </div>
    </div>
  );
}
export default App;
