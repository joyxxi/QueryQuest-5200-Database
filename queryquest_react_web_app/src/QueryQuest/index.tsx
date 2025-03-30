import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Signin from "./Account/Signin";
import Signup from "./Account/Signup";
import Navigation from "./Navigation";
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
              <Route path="/Account/*" element={<Account />} />
              <Route path="/Signin" element={<Signin />} />
              <Route path="/Signup" element={<Signup />} />
            </Routes>
          </td>
        </tr>
      </table>
    </div>
  );
}
