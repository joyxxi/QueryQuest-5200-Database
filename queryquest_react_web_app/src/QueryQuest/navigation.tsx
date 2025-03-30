import { Link } from "react-router-dom";
export default function Navigation() {
  return (
    <div id="wd-queryquest-navigation">
      QueryQuest
      <br />
      <Link to="/QueryQuest/Account" id="wd-account-link">
        Account
      </Link>
      <br />
      <Link to="/QueryQuest/Problem" id="wd-problem-link">
        Problem
      </Link>
      <br />
      {/* <Link to="/QueryQuest/Submission" id="wd-submission-link">
        Submission
      </Link>
      <br /> */}
      <Link to="/QueryQuest/Message" id="wd-message-link">
        Message
      </Link>
      <br />
    </div>
  );
}
