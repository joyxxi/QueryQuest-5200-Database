import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../apis/userAPI";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "STUDENT",
    password: "",
    verifyPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.verifyPassword) {
      setError("Passwords don't match");
      return;
    }
  
    setIsLoading(true);
    const response = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role as 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'
    });
    setIsLoading(false);
  
    if (response.status === "success") {
      navigate("/QueryQuest/Signin");
    } else {
      setError(response.message || "Signup failed. Please try again.");
      if (response.errors) {
        console.error("Validation errors:", response.errors);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 rounded shadow-lg bg-white" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Sign Up</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="STUDENT">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="verifyPassword" className="form-label">Verify Password</label>
            <input
              id="verifyPassword"
              name="verifyPassword"
              type="password"
              className="form-control"
              value={formData.verifyPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="text-center mt-3">
          <Link to="/QueryQuest/Signin">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}