import { Link, useLocation } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { IoIosMail } from "react-icons/io";
import { TbBrandMysql } from "react-icons/tb";
export default function Navigation() {
  const { pathname } = useLocation();
  
  // Added type assertion for TbBrandMysql (Solution 2)
  const MySqlIcon = TbBrandMysql as React.ComponentType<React.SVGProps<SVGSVGElement>>; // Changed this line
  
  const links = [
    {
      id: 0,
      label: "Account",
      path: "/QueryQuest/Account",
      icon: FaRegCircleUser,
    },
    {
      id: 1,
      label: "Problem",
      path: "/QueryQuest/Problem",
      icon: LuNotebookPen,
    },
    {
      id: 2,
      label: "Message",
      path: "/QueryQuest/Message",
      icon: IoIosMail,
    },
  ];

  return (
    <div
      id="wd-queryquest-navigation"
      style={{ width: 120 }}
      className="list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-primary z-2"
    >
      <Link
        to="/QueryQuest/Signin"
        id="wd-logo-link"
        className="list-group-item text-white
                   bg-primary text-center border-0"
      >
	<MySqlIcon className="fs-1 text text-white" /> {/* Changed this line */}
        <br />
        QueryQuest
      </Link>
      <br />

      {links.map((link) => (
        <Link
          key={link.id}
          to={link.path}
          className={`list-group-item bg-primary text-center border-0
              ${
                pathname.includes(link.label)
                  ? "text-black bg-white"
                  : "text-white bg-primary"
              }`}
        >
          {link.icon({
            className: `fs-1 ${
              pathname.includes(link.label) ? "text-black" : "text-white"
            }`,
          })}
          <br />
          {link.label}
          <br />
        </Link>
      ))}
      <br />
    </div>
  );
}
