import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await API.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        alert("Login Success");
        navigate("/jobs");
        return;
      }
+62
8

      alert("Invalid Credentials");
    } catch (error) {
      alert(error.response?.data?.message || "Wrong Email or Password");
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleLogin}>
        <h1>Login</h1>

        <input
          className="input-box"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="input-box"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn" type="submit">
          Login
        </button>

        <p style={{ marginTop: "20px" }}>
          New user?
          <Link
            to="/register"
            style={{
              color: "#00c6ff",
              marginLeft: "8px",
            }}
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
