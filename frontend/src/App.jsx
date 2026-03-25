import { useState } from "react";
import Booking from "./pages/Booking";
import Login from "./Login";
import Register from "./pages/Register";
import Admin from "./Admin";
import Landing from "./pages/Landing";

function App(){

  const [page,setPage] = useState("home");

  return (
    <div>

      {page === "home" && 
        <div className="container fade-in">
           <Landing setPage={setPage} />
        </div>
      }

      {page === "login" && 
        <div className="flex-center">
           <Login setPage={setPage} />
        </div>
      }

      {page === "register" && 
        <div className="flex-center">
          <Register setPage={setPage} />
        </div>
      }

      {page === "booking" && 
        <div className="container">
          <div className="navbar glass-panel" style={{padding: "1rem 2rem", marginBottom: "2rem"}}>
             <h1>Customer Dashboard</h1>
             <button className="secondary" style={{width: "auto"}} onClick={()=>{localStorage.clear(); setPage("login");}}>Logout</button>
          </div>
          <Booking />
        </div>
      }

      {page === "admin" && 
        <div className="container">
          <div className="navbar glass-panel" style={{padding: "1rem 2rem", marginBottom: "2rem"}}>
             <h1>Admin Control Center</h1>
             <button className="secondary" style={{width: "auto"}} onClick={()=>{localStorage.clear(); setPage("login");}}>Logout</button>
          </div>
          <Admin />
        </div>
      }

    </div>
  );
}

export default App;