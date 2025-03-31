import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div
      id="wd-signup-screen"
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <div
        className="p-4 rounded shadow-lg bg-white"
        style={{ width: "350px" }}
      >
        <h3 className="text-center mb-4">Sign Up</h3>

        <input className="form-control mb-3" placeholder="Username" />
        <input className="form-control mb-3" placeholder="Email" type="email" />

        <select id="wd-signup-role" className="form-select mb-3">
          <option value="ADMIN">Admin</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="STUDENT">Student</option>
        </select>

        <input
          className="form-control mb-3"
          placeholder="Password"
          type="password"
        />
        <input
          className="form-control mb-3"
          placeholder="Verify Password"
          type="password"
        />

        <Link to="/QueryQuest/Account" className="btn btn-primary w-100">
          Sign Up
        </Link>

        <div className="text-center mt-3">
          <Link to="/QueryQuest/Signin">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}
