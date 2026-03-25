import { useEffect, useState } from "react";
import API from "./api";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Admin(){

  const [bookings,setBookings] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  
  // Fuel form state
  const [fuelName, setFuelName] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [availableStock, setAvailableStock] = useState("");

  useEffect(() => {
    fetchBookings();
    fetchFuelTypes();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchFuelTypes = async () => {
    try {
      const res = await API.get("/fuel");
      setFuelTypes(res.data);
    } catch (error) {
      console.error("Error fetching fuels:", error);
    }
  };

  const handleFuelSubmit = async () => {
    if (!fuelName.trim()) {
      alert("Please enter a valid fuel name.");
      return;
    }
    try {
      await API.post("/fuel", {
        name: fuelName.trim(),
        currentPrice: parseFloat(currentPrice) || 0,
        availableStock: parseFloat(availableStock) || 0
      });
      alert("Fuel Updated Successfully!");
      fetchFuelTypes();
      setFuelName("");
      setCurrentPrice("");
      setAvailableStock("");
    } catch (error) {
      alert("Error updating fuel");
    }
  };

  // Generate Chart Data
  const getChartData = () => {
    const fuelCounts = {};
    bookings.forEach(b => {
      fuelCounts[b.fuelType] = (fuelCounts[b.fuelType] || 0) + b.quantity;
    });

    return {
      labels: Object.keys(fuelCounts),
      datasets: [
        {
          label: 'Liters Sold',
          data: Object.values(fuelCounts),
          backgroundColor: 'rgba(74, 222, 128, 0.7)',
          borderColor: 'rgba(74, 222, 128, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="dashboard-grid">
      
      {/* Analytics Panel */}
      <div className="glass-panel full-width">
        <h2 className="title-gradient">Sales Analytics</h2>
        <div style={{height: "300px", marginTop: "1rem"}}>
           {bookings.length > 0 ? (
             <Bar 
               data={getChartData()} 
               options={{
                 maintainAspectRatio: false, 
                 plugins: { legend: { labels: { color: '#f8fafc'} } },
                 scales: {
                   y: { ticks: { color: '#94a3b8'} },
                   x: { ticks: { color: '#94a3b8'} }
                 }
               }} 
             />
           ) : (
             <div className="flex-center" style={{minHeight: "100%"}}>No booking data yet</div>
           )}
        </div>
      </div>

      {/* Fuel Inventory Panel */}
      <div className="glass-panel">
        <h3 className="title-gradient">Fuel Inventory</h3>
        <p style={{color: "var(--text-muted)", marginBottom: "1rem"}}>Manage stock and daily pricing</p>
        
        <div style={{marginBottom: "20px"}}>
           <input placeholder="Fuel Name (e.g. Petrol)" value={fuelName} onChange={e => setFuelName(e.target.value)} />
           <div style={{display: "flex", gap: "10px"}}>
             <input type="number" placeholder="Price/L" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} />
             <input type="number" placeholder="Stock in Liters" value={availableStock} onChange={e => setAvailableStock(e.target.value)} />
           </div>
           <button onClick={handleFuelSubmit}>Add / Update Fuel</button>
        </div>

        <div style={{overflowX: "auto"}}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {fuelTypes.map((f)=>(
                <tr key={f.id}>
                  <td>{f.name}</td>
                  <td>${f.currentPrice}</td>
                  <td>{f.availableStock} L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bookings Tracker */}
      <div className="glass-panel full-width">
        <h3 className="title-gradient">Live Booking Queue</h3>
        <div style={{overflowX: "auto"}}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Fuel</th>
                <th>Quantity</th>
                <th>Time Slot</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b)=>(
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{b.customerEmail || 'Guest'}</td>
                  <td>{b.location || 'N/A'}</td>
                  <td>{b.fuelType}</td>
                  <td>{b.quantity}L</td>
                  <td>{new Date(b.slotTime).toLocaleString()}</td>
                  <td><span style={{color: "var(--primary)"}}>{b.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}

export default Admin;