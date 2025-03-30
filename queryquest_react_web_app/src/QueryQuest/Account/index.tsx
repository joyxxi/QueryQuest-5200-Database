import { Routes, Route, Navigate } from "react-router";
import Profile from "./Profile";

export default function Account() {
  return (
    <div id="wd-account-screen">
      <Routes>
        <Route path="/" element={<Profile />} />
      </Routes>
    </div>
  );
}
