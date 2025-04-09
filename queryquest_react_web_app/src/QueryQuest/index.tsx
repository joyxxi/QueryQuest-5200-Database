import { Routes, Route, Navigate } from "react-router";
import "./styles.css";
import Account from "./Account";
import Navigation from "./navigation";
import Message from "./Message";
import Chatbot from "./Chatbot";
import ProblemDetail from "./Problem/ProblemDetail";
import ProblemList from "./Problem";

export default function QueryQuest() {
  return (
    <div id="wd-queryquest">
      <Navigation />

      <div className="wd-main-content-offset p-3">
        <Routes>
          <Route path="/" element={<Navigate to="Account" />} />
          <Route path="Account/*" element={<Account />} />
          <Route path="Problem" element={<ProblemList />} />
          <Route path="Problem/:pid" element={<ProblemDetail />} />
          <Route path="Message" element={<Message />} />
          <Route path="Chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </div>
  );
}
