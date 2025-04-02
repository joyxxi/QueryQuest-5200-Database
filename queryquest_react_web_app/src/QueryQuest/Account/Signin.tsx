import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../apis/userAPI";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }
  
    const response = await login({ email, password });
    setIsLoading(false);
  
    if (response.status === "success" && response.user_id && response.role) {
      localStorage.setItem("user", JSON.stringify({
        userId: response.user_id,
        role: response.role,
        email: email,
        token: response.token
      }));
      navigate("/QueryQuest/Account");
    } else {
      setError(response.message || "Login failed. Please try again.");
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 rounded shadow-lg bg-white" style={{ width: "400px" }}>
        <h1 className="text-center mb-4">QueryQuest System</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSignin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="text-center mt-3">
          <Link to="/QueryQuest/Signup">Don't have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
}