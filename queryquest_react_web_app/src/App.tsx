import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import QueryQuest from "./QueryQuest";
import Signin from "./QueryQuest/Account/Signin";
import Signup from "./QueryQuest/Account/Signup"
import Problem from "./QueryQuest/Problem/index"; // 修改为引入 index.tsx
import ProblemDetail from "./QueryQuest/Problem/ProblemDetail"; // 引入问题详情页


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
	  {/* 问题列表页 */}
          <Route path="/QueryQuest/Problems" element={<Problem />} />
          {/* 动态路由：每个问题跳转到问题详情页 */}
          <Route path="/QueryQuest/Problem/:id" element={<ProblemDetail />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
