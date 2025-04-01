import { Routes, Route, Navigate } from "react-router";
import "./styles.css";
import Account from "./Account";
import Navigation from "./navigation";
import Problem from "./Problem";
import Message from "./Message";
import Chatbot from "./Chatbot";
import ProblemDetail from "./Problem/ProblemDetail";
import ProblemEditor from "./Problem/ProblemEditor";
import MessageDetail from "./Message/MessageDetail";
import MessageEditor from "./Message/MessageEditor";

export default function QueryQuest() {
  return (
    <div id="wd-queryquest">
      <Navigation />

      <div className="wd-main-content-offset p-3">
        <Routes>
          {/* <Route path="/" element={<Navigate to="Signin" />} /> */}
          <Route path="Account/*" element={<Account />} />
          <Route path="Problem" element={<Problem />} />
          <Route path="Problem/:pid" element={<ProblemDetail />} />
          <Route path="Problem/problemEditor" element={<ProblemEditor />} />
          <Route path="Message" element={<Message />} />
          <Route path="Message/:mid" element={<MessageDetail />} />
          <Route path="Message/messageEditor" element={<MessageEditor />} />
          <Route path="Chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </div>
  );
}
