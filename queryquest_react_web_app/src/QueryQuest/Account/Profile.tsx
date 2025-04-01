import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div id="wd-profile-screen" className="d-flex align-items-center">
      <div
        className="p-4 rounded shadow-lg bg-white"
        style={{ width: "350px" }}
      >
        <h3 className="text-center mb-4">Profile</h3>

        <input
          id="wd-profile-username"
          className="form-control mb-3"
          value="alice"
          placeholder="Username"
        />
        <input
          id="wd-profile-password"
          className="form-control mb-3"
          value="123"
          placeholder="Password"
          type="password"
        />
        <input
          id="wd-profile-email"
          className="form-control mb-3"
          value="alice@wonderland"
          type="email"
        />

        <select id="wd-profile-role" className="form-select mb-3">
          <option value="ADMIN">Admin</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="STUDENT">Student</option>
        </select>

        <Link to="/QueryQuest/Signin" className="btn btn-danger w-100">
          Sign Out
        </Link>
      </div>
    </div>
  );
}
