import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const registerUser = async (e) => {
    e.preventDefault();

    const name = user.name.trim();
    const email = user.email.trim().toLowerCase();
    const password = user.password.trim();

    if (!name || !email || !password) {
      alert("Please enter name, email and password");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    try {

      await API.post("/auth/register", {
        ...user,
        name,
        email,
        password,
      });

      alert("Registration Successful");

      navigate("/");

    } catch (error) {

      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (

    <div className="container">

      <form className="card" onSubmit={registerUser}>

        <h1>Register</h1>

        <input
          className="input-box"
          placeholder="Name"
          value={user.name}
          onChange={(e) =>
            setUser({ ...user, name: e.target.value })
          }
          required
        />

        <input
          className="input-box"
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) =>
            setUser({ ...user, email: e.target.value })
          }
          required
        />

        <input
          className="input-box"
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) =>
            setUser({ ...user, password: e.target.value })
          }
          required
        />

        <button className="btn" type="submit">
          Register
        </button>

        <p style={{ marginTop: "20px" }}>
          Already have account?

          <Link
            to="/"
            style={{
              color: "#00c6ff",
              marginLeft: "8px",
            }}
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Register;
