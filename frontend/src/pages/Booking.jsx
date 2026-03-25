import { useState, useEffect, useRef } from "react";
import API from "../api";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function Booking() {
  const [fuelTypes, setFuelTypes] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("");
  const [slotTime, setSlotTime] = useState("");
  
  // App State
  const [step, setStep] = useState(1); // 1: Select, 2: Payment, 3: QR
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  // Payment mock state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");

  const [userLocation, setUserLocation] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchFuelTypes();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
        (error) => setUserLocation([51.505, -0.09])
      );
    } else {
      setUserLocation([51.505, -0.09]);
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      setStations([
        { id: "Downtown Station (Sector 4)", name: "Downtown Station (Sector 4)", position: [userLocation[0] + 0.01, userLocation[1] + 0.01] },
        { id: "Highway 24 Bunk", name: "Highway 24 Bunk", position: [userLocation[0] - 0.015, userLocation[1] + 0.005] },
        { id: "Eastside Express", name: "Eastside Express", position: [userLocation[0] + 0.005, userLocation[1] - 0.01] },
      ]);
    }
  }, [userLocation]);

  const fetchFuelTypes = async () => {
    try {
      const res = await API.get("/fuel");
      setFuelTypes(res.data);
      if (res.data.length > 0) {
        setSelectedFuel(res.data[0].name);
      }
    } catch (e) {
      console.error("Failed to fetch fuel types", e);
    }
  };

  const getPrice = () => {
    const fuel = fuelTypes.find(f => f.name === selectedFuel);
    return fuel ? fuel.currentPrice * quantity : 0;
  };

  const currentFuelData = fuelTypes.find(f => f.name === selectedFuel);

  const proceedToPayment = () => {
    if (!slotTime) return alert("Please select a date & time");
    if (!location) return alert("Please select the nearest location");
    if (quantity <= 0) return alert("Quantity must be greater than zero");
    if (!currentFuelData || currentFuelData.availableStock < quantity) {
      return alert("Insufficient stock available for this selection.");
    }
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setLoading(true);
    
    // Mock processing timeout
    setTimeout(async () => {
      try {
        const formattedTime = new Date(slotTime).toISOString();
        const res = await API.post("/bookings", {
          fuelType: selectedFuel,
          quantity,
          location,
          slotTime: formattedTime,
          paymentStatus: "Paid"
        });
        
        setQr(res.data);
        setStep(3);
      } catch (error) {
        console.error(error);
        alert(error.response?.data || "Error confirming booking!");
        setStep(1); // revert on failure
      } finally {
        setLoading(false);
        isSubmitting.current = false;
      }
    }, 1500);
  };

  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      <div className="glass-panel" style={{maxWidth: "500px", width: "100%"}}>
        
        {step === 1 && (
          <div>
            <h2 className="title-gradient" style={{marginBottom:"1.5rem"}}>Select Fuel & Slot</h2>
            <div style={{marginBottom: "1rem"}}>
               <label style={{color: "var(--text-muted)", fontSize: "0.9rem"}}>Fuel Type</label>
               <select value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)} style={{marginTop: "0.5rem"}}>
                 {fuelTypes.map((ft) => (
                   <option key={ft.id} value={ft.name}>
                     {ft.name} - ${ft.currentPrice}/L (Stock: {ft.availableStock}L)
                   </option>
                 ))}
               </select>
            </div>

            <div style={{marginBottom: "1rem"}}>
               <label style={{color: "var(--text-muted)", fontSize: "0.9rem"}}>Quantity (Liters)</label>
               <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{marginTop: "0.5rem"}}/>
            </div>

            <div style={{marginBottom: "1rem"}}>
               <label style={{color: "var(--text-muted)", fontSize: "0.9rem"}}>Nearest Location</label>
               {userLocation ? (
                 <div style={{height: "250px", width: "100%", marginTop: "0.5rem", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", zIndex: 0}}>
                   <MapContainer center={userLocation} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                     <Marker position={userLocation} icon={L.icon({iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', iconSize:[25,41], iconAnchor:[12,41]})}>
                        <Popup>Your Location</Popup>
                     </Marker>
                     {stations.map(station => (
                       <Marker key={station.id} position={station.position} eventHandlers={{ click: () => setLocation(station.id) }}>
                         <Popup>
                           <strong>{station.name}</strong><br/>
                           <button onClick={(e) => { e.stopPropagation(); setLocation(station.id); }} style={{marginTop:"5px", padding:"4px 8px", fontSize:"0.8rem", width:"auto"}}>Select</button>
                         </Popup>
                       </Marker>
                     ))}
                   </MapContainer>
                 </div>
               ) : (
                 <div style={{marginTop: "0.5rem", padding: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", textAlign: "center", color: "white"}}>
                   Loading Map...
                 </div>
               )}
               <div style={{marginTop: "0.5rem", fontSize: "0.9rem"}}>
                 Selected: <span style={{color: (location ? "var(--primary)" : "var(--text-muted)"), fontWeight: "bold"}}>{location || "None"}</span>
               </div>
            </div>

            <div style={{marginBottom: "1.5rem"}}>
               <label style={{color: "var(--text-muted)", fontSize: "0.9rem"}}>Arrival Time Slot</label>
               <input type="datetime-local" value={slotTime} onChange={(e) => setSlotTime(e.target.value)} style={{marginTop: "0.5rem"}}/>
            </div>
            
            <div style={{background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem"}}>
               <div style={{display: "flex", justifyContent: "space-between"}}>
                  <span>Estimated Total:</span>
                  <span style={{fontWeight: "bold", color: "var(--primary)"}}>${getPrice().toFixed(2)}</span>
               </div>
            </div>

            <button onClick={proceedToPayment}>Proceed to Checkout</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem"}}>
              <h2 className="title-gradient" style={{margin: 0}}>Secure Checkout</h2>
              <button className="secondary" style={{width: "auto", padding: "4px 12px", fontSize: "0.8rem"}} onClick={() => setStep(1)}>Back</button>
            </div>

            <p style={{color: "var(--text-muted)", marginBottom: "1rem"}}>Total amount due: <strong style={{color:"white"}}>${getPrice().toFixed(2)}</strong></p>

            <form onSubmit={handlePaymentSubmit}>
               <input type="text" placeholder="Card Number (Mock)" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required maxLength="16" />
               <div style={{display: "flex", gap: "10px"}}>
                 <input type="text" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} required maxLength="5" />
                 <input type="password" placeholder="CVV" required maxLength="3" />
               </div>
               
               <button type="submit" disabled={loading}>
                 {loading ? "Processing Payment..." : `Pay $${getPrice().toFixed(2)} & Confirm`}
               </button>
            </form>
          </div>
        )}

        {step === 3 && qr && (
          <div style={{textAlign: "center"}}>
            <h2 className="title-gradient" style={{marginBottom:"0.5rem"}}>Booking Confirmed!</h2>
            <p style={{color: "var(--text-muted)", marginBottom: "1.5rem"}}>Show this pass at the station to refuel instantly.</p>
            
            <div style={{background: "white", padding: "1rem", borderRadius: "12px", display: "inline-block", marginBottom: "1.5rem"}}>
               <img src={`data:image/png;base64,${qr}`} alt="QR Code" style={{display: "block"}} />
            </div>

            <a 
              href={`data:image/png;base64,${qr}`} 
              download={`petrol_booking_${new Date().getTime()}.png`}
              style={{textDecoration: "none", display: "block"}}
            >
              <button>⬇ Download Ticket</button>
            </a>
            
            <div style={{marginTop: "1rem"}}>
              <button className="secondary" onClick={() => { setStep(1); setQr(null); setQuantity(1); setSlotTime(""); }}>Book Another Slot</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Booking;