import { useState } from "react";
import API from "./api";

function Login({setPage}){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, role } = res.data; 

      if(token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        if(role === "ADMIN"){
          setPage("admin");
        } else {
          setPage("booking");
        }
      }
    } catch (error) {
      alert("Login Failed: " + (error.response?.data || "Ensure the backend server is running"));
    }
  };

  return (
    <div className="glass-panel max-w-md">
      <h2 className="title-gradient" style={{textAlign:"center"}}>Portal Login</h2>
      <p style={{color: "var(--text-muted)", textAlign: "center", marginBottom: "1.5rem"}}>Sign in to manage your bookings</p>
      
      <form onSubmit={handleLogin}>
        <input 
          placeholder="Email Address"
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      
      <div style={{marginTop: "1.5rem", textAlign: "center"}}>
        <p style={{color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem"}}>Don't have an account?</p>
        <button className="secondary" onClick={() => setPage("register")}>Create Account</button>
      </div>
    </div>
  );
}

export default Login;