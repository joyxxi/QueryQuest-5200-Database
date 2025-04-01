import { Link } from "react-router-dom";

export default function Signin() {
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
        />
        <input
          id="wd-signin-password"
          placeholder="Password"
          type="password"
          className="form-control mb-3"
        />
        <Link
          id="wd-signin-btn"
          to="/QueryQuest/Account"
          className="btn btn-primary w-100"
        >
          Sign in
        </Link>
        <div className="text-center mt-3">
          <Link id="wd-signup-link" to="/QueryQuest/Signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
