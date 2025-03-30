import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Navigation from "./Navigation";
import Problem from "./Problem";
import Message from "./Message";

export default function QueryQuest() {
  return (
    <div id="queryquest">
      <table>
        <tr>
          <td valign="top">
            <Navigation />
          </td>
          <td valign="top">
            <Routes>
              <Route path="/" element={<Navigate to="Signin" />} />
              <Route path="Account/*" element={<Account />} />
              <Route path="Problem/*" element={<Problem />} />
              <Route path="Message/*" element={<Message />} />
            </Routes>
          </td>
        </tr>
      </table>
    </div>
  );
}
