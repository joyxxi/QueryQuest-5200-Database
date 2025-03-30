import React from "react";
import { Link } from "react-router-dom";
export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      <input placeholder="username" />
      <br />
      <input placeholder="email" type="email" />
      <br />
      <select id="wd-signup-role">
        <option value="ADMIN">Admin</option>
        <option value="INSTRUCTOR">Instructor</option>
        <option value="STUDENT">Student</option>
      </select>
      <br />
      <input placeholder="password" type="password" />
      <br />
      <input placeholder="verify password" type="password" />
      <br />
      <Link to="/QueryQuest/Account"> Sign up </Link>
      <br />
      <Link to="/QueryQuest/Signin">Sign in</Link>
    </div>
  );
}
