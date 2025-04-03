import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "../APIs/usersAPI";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
    setEditMode(false); // Exit edit mode after updating
  };

  const [editMode, setEditMode] = useState(false);
  const fetchProfile = () => {
    if (!currentUser) return navigate("QueryQuest/Signin");
    setProfile(currentUser);
  };
  const signout = () => {
    dispatch(setCurrentUser(null));
    navigate("/QueryQuest/Signin");
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div id="wd-profile-screen" className="d-flex align-items-center">
      <div
        className="p-4 rounded shadow-lg bg-white"
        style={{ width: "350px" }}
      >
        <h3 className="text-center mb-4">Profile</h3>
        {profile && (
          <div>
            {/* user cannot edit username */}
            <input
              id="wd-profile-username"
              className="form-control mb-3"
              defaultValue={profile.username}
              placeholder="Username"
              disabled={true}
            />
            <input
              id="wd-profile-email"
              className="form-control mb-3"
              defaultValue={profile.email}
              type="email"
              disabled={!editMode}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
            <input
              id="wd-profile-password"
              className="form-control mb-3"
              defaultValue={profile.password}
              placeholder="Password"
              type="password"
              disabled={!editMode}
              onChange={(e) =>
                setProfile({ ...profile, password: e.target.value })
              }
            />
            {/* user cannot edit role */}
            <select
              id="wd-profile-role"
              className="form-select mb-3"
              value={profile.role}
              disabled={true}
            >
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
            </select>

            <div className="d-flex gap-2">
              <button
                onClick={() => {
                  if (editMode) {
                    updateProfile(); // Save changes
                  } else {
                    setEditMode(true); // Enter edit mode
                  }
                }}
                className="btn btn-primary w-50"
              >
                {editMode ? "Save" : "Edit"}
              </button>
              <button
                onClick={signout}
                className="btn btn-danger w-50"
                id="wd-signout-btn"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
