import { Link } from "react-router-dom";
export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input id="wd-username" value="alice" placeholder="username" />
      <br />
      <input
        id="wd-password"
        value="123"
        placeholder="password"
        type="password"
      />
      <br />
      <input id="wd-email" value="alice@wonderland" type="email" />
      <br />
      <select id="wd-role">
        <option value="ADMIN">Admin</option>
        <option value="INSTRUCTOR">Instructor</option>
        <option value="STUDENT">Student</option>
      </select>
      <br />
      <Link to="/QueryQuest/Signin">Sign out</Link>
    </div>
  );
}
