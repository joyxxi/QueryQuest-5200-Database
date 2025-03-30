import { Link } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { IoIosMail } from "react-icons/io";
import { TbBrandMysql } from "react-icons/tb";
export default function Navigation() {
  // const links = [
  //   {
  //     id: 0,
  //     label: "Account",
  //     path: "/QueryQuest/Account",
  //     icon: FaRegCircleUser,
  //   },
  //   {
  //     id: 1,
  //     label: "Problem",
  //     path: "/QueryQuest/Problem",
  //     icon: LuNotebookPen,
  //   },
  //   {
  //     id: 2,
  //     label: "Message",
  //     path: "/QueryQuest/Message",
  //     icon: IoIosMail,
  //   },
  // ];

  return (
    <div
      id="wd-queryquest-navigation"
      style={{ width: 120 }}
      className="list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-primary z-2"
    >
      <Link
        to="/QueryQuest/Account"
        id="wd-logo-link"
        className="list-group-item text-white
                   bg-primary text-center border-0"
      >
        <TbBrandMysql className="fs-1 text text-white" />
        <br />
        QueryQuest
      </Link>
      <br />
      <Link
        to="/QueryQuest/Account"
        id="wd-account-link"
        className="list-group-item text-white
                   bg-primary text-center border-0"
      >
        <FaRegCircleUser className="fs-1 text text-white" />
        <br />
        Account
      </Link>
      <br />
      <Link
        to="/QueryQuest/Problem"
        id="wd-problem-link"
        className="list-group-item text-center border-0
                   bg-white text-black"
      >
        <LuNotebookPen className="fs-1 text-black" />
        <br />
        Problem
      </Link>
      <br />
      {/* <Link to="/QueryQuest/Submission" id="wd-submission-link">
        Submission
      </Link>
      <br /> */}
      <Link
        to="/QueryQuest/Message"
        id="wd-message-link"
        className="list-group-item text-white
                   bg-primary text-center border-0"
      >
        <IoIosMail className="fs-1 text-white" />
        <br />
        Message
      </Link>
      <br />
    </div>
  );
}
