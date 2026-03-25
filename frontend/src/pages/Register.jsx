import { useState } from "react";
import API from "../api";

function Register({ setPage }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await API.post("/auth/register", {
                name,
                email,
                password,
                role: "USER" // default to USER
            });
            alert("Registration successful! Please sign in.");
            setPage("login");
        } catch (error) {
            alert("Error registering user. Email might already exist.");
        }
    };

    return (
        <div className="glass-panel max-w-md">
            <h2 className="title-gradient" style={{textAlign:"center"}}>Create Account</h2>
            <p style={{color: "var(--text-muted)", textAlign: "center", marginBottom: "1.5rem"}}>Join the Smart Online Booking System</p>
            
            <form onSubmit={handleRegister}>
                <input 
                    placeholder="Full Name"
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input 
                    type="email"
                    placeholder="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Create Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Complete Registration</button>
            </form>
            
            <div style={{marginTop: "1.5rem", textAlign: "center"}}>
                <button className="secondary" onClick={() => setPage("login")}>Back to Login</button>
            </div>
        </div>
    );
}

export default Register;
