import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "../APIs/usersAPI";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signup = async () => {
    const currentUser = await client.signup(user);
    dispatch(setCurrentUser(currentUser));
    navigate("/QueryQuest/Account");
  };

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

        <input
          className="form-control mb-3"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Username"
        />
        <input
          className="form-control mb-3"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          type="email"
        />

        <select
          id="wd-signup-role"
          className="form-select mb-3"
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>

        <input
          className="form-control mb-3"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          type="password"
        />
        {/* <input
          className="form-control mb-3"
          placeholder="Verify Password"
          type="password"
        /> */}
        <button onClick={signup} className="btn btn-primary w-100">
          Sign up
        </button>
        <div className="text-center mt-3">
          <Link to="/QueryQuest/Signin">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}
