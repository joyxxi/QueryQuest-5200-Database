import { Link } from "react-router-dom";
export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input id="wd-profile-username" value="alice" placeholder="username" />
      <br />
      <input
        id="wd-profile-password"
        value="123"
        placeholder="password"
        type="password"
      />
      <br />
      <input id="wd-profile-email" value="alice@wonderland" type="email" />
      <br />
      <select id="wd-profile-role">
        <option value="ADMIN">Admin</option>
        <option value="INSTRUCTOR">Instructor</option>
        <option value="STUDENT">Student</option>
      </select>
      <br />
      <Link to="/QueryQuest/Signin">Sign out</Link>
    </div>
  );
}
