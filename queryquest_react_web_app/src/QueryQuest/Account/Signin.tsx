import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
// import * as db from "../MockData";
import * as client from "../APIs/usersAPI";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signin = async () => {
    const response = await client.signin(credentials);
    if (response.status === "success" && response.data) {
      const user = response.data;
      dispatch(setCurrentUser(user));
      // console.log(credentials.username, credentials.password);
      // console.log(user.user_id, user.username, user.password, user.email);
      navigate("/QueryQuest/Account");
    }
  };

  return (
    <div
      id="wd-signin-screen"
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <div
        className="p-4 rounded shadow-lg bg-white"
        style={{ width: "400px" }}
      >
        <h1 className="text-center mb-4">QueryQuest System</h1>
        <input
          id="wd-signin-username"
          placeholder="Username"
          className="form-control mb-3"
          defaultValue={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />
        <input
          id="wd-signin-password"
          placeholder="Password"
          type="password"
          className="form-control mb-3"
          defaultValue={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button
          onClick={signin}
          id="wd-signin-btn"
          className="btn btn-primary w-100"
        >
          Sign in
        </button>
        <div className="text-center mt-3">
          <Link id="wd-signup-link" to="/QueryQuest/Signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
