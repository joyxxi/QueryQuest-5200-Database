import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState({
    userId: "",
    email: "",
    role: "",
    password: "" // For password updates
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    console.log(userString)
    if (!userString) {
      navigate("/QueryQuest/Signin");
      return;
    }

    try {
      const userData = JSON.parse(userString);
      setUser({
        userId: userData.userId || "",
        email: userData.email || "",
        role: userData.role || "",
        password: "" // Never store actual password in state
      });
    } catch (err) {
      setError("Invalid user data");
      navigate("/QueryQuest/Signin");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!user.email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Here you would call your update API if needed
      // For now, we'll just update localStorage
      const updatedUser = {
        userId: user.userId,
        role: user.role,
        email: user.email,
        // Don't store password in localStorage
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user.userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 rounded shadow-lg bg-white" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Profile</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-control mb-3"
            value={user.email}
            onChange={handleChange}
            readOnly={!editMode}
          />
        </div>
        
        {editMode && (
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              name="password"
              type="password"
              className="form-control mb-3"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
        )}
        
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select mb-3"
            value={user.role}
            disabled
          >
            <option value="ADMIN">Admin</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="STUDENT">Student</option>
          </select>
        </div>

        {!editMode ? (
          <div className="d-flex gap-2">
            <button 
              onClick={() => setEditMode(true)}
              className="btn btn-primary flex-grow-1"
            >
              Edit Profile
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/QueryQuest/Signin");
              }}
              className="btn btn-danger flex-grow-1"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <button 
              onClick={handleUpdate}
              disabled={loading}
              className="btn btn-success flex-grow-1"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            <button 
              onClick={() => setEditMode(false)}
              className="btn btn-secondary flex-grow-1"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}