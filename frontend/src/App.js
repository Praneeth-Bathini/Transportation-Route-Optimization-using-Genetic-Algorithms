import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
  Link
} from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// --- SVG ICONS ---
const TruckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" /><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" /><circle cx="7.5" cy="18.5" r="2.5" /><circle cx="17.5" cy="18.5" r="2.5" /></svg>);
const RouteIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>);
const StopsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const LoadingSpinner = () => (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const MapIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>);
const ChevronRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);
const DepotStopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M3 17v-7h18v7"/><path d="M12 17v-6"/><path d="M9 17v-4"/><path d="M15 17v-2"/></svg>;
const DeliveryStopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V5a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 5v5l8 4.5V21l8-4.5z"/><path d="M12 22v-6.5"/><path d="M3.29 7l8.71 5 8.71-5"/><path d="M3 7v5l8 4.5"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const PanelLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);


// --- LEAFLET MAP CONFIG ---
const depotIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// --- UTILITY & LAYOUT COMPONENTS ---
function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.invalidateSize();
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [100, 100] });
    }
  }, [positions, map]);
  return null;
}
function Header() {
  const activeLinkStyle = { color: '#FFFFFF', textDecoration: 'underline' };
  return (
    <header className="bg-gray-800 text-gray-300 shadow-md p-4 flex justify-between items-center z-20 flex-shrink-0">
      <div className="flex items-center gap-3"><TruckIcon /><h1 className="text-2xl font-bold text-white tracking-wider">Transport Optimizer</h1></div>
      <nav className="space-x-8"><NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="hover:text-white transition-colors">Dashboard</NavLink><NavLink to="/contact" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="hover:text-white transition-colors">Contact</NavLink><NavLink to="/login" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="hover:text-white transition-colors">Login</NavLink></nav>
    </header>
  );
}
function Footer() { return (<footer className="bg-gray-800 text-gray-400 py-4 text-center text-sm flex-shrink-0">© 2025 Transport Optimizer. All rights reserved.</footer>); }
function StatCard({ icon, label, value, unit }) {
    return (<div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 border border-gray-200"><div className="bg-indigo-100 text-indigo-600 p-2 rounded-md">{icon}</div><div><p className="text-sm text-gray-500">{label}</p><p className="text-lg font-bold text-gray-800">{value} <span className="text-sm font-normal">{unit}</span></p></div></div>);
}

// --- PAGE COMPONENTS ---
function Login({ onLogin }) {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = (e) => { e.preventDefault(); if (email === "user@example.com" && password === "password") { onLogin(true); setError(null); navigate("/"); } else { setError("Invalid email or password"); }};
  return (<main className="flex-grow flex flex-col items-center justify-center p-6 bg-gray-50"><div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"><h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>{error && <p className="text-red-600 mb-4 bg-red-100 p-3 rounded-md text-center">{error}</p>}<form onSubmit={handleSubmit}><div className="mb-4"><label className="block mb-2 font-semibold text-gray-700">Email</label><input type="email" className="border border-gray-300 p-2 w-full rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} required /></div><div className="mb-6"><label className="block mb-2 font-semibold text-gray-700">Password</label><input type="password" className="border border-gray-300 p-2 w-full rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} required /></div><button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition shadow">Log In</button></form></div></main>);
}
function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); setTimeout(() => { setFormData({ name: "", email: "", message: "" }); setSubmitted(false); }, 4000); };
  return (<main className="flex-grow flex flex-col items-center justify-center p-6 bg-gray-50"><div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"><h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Get in Touch</h2><form onSubmit={handleSubmit}>{submitted && <p className="mb-4 text-center text-green-700 bg-green-100 font-semibold p-3 rounded-md">Message sent successfully!</p>}<div className="mb-4"><label className="block mb-2 font-semibold text-gray-700">Name</label><input name="name" type="text" className="border border-gray-300 p-2 w-full rounded-md" value={formData.name} onChange={handleChange} required /></div><div className="mb-4"><label className="block mb-2 font-semibold text-gray-700">Email</label><input name="email" type="email" className="border border-gray-300 p-2 w-full rounded-md" value={formData.email} onChange={handleChange} required /></div><div className="mb-6"><label className="block mb-2 font-semibold text-gray-700">Message</label><textarea name="message" rows="5" className="border border-gray-300 p-2 w-full rounded-md" value={formData.message} onChange={handleChange} required /></div><button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition shadow">Send Message</button></form></div></main>);
}
function Homepage() {
    return (<main className="flex-grow flex flex-col items-center justify-center bg-gray-50 p-8"><div className="text-center"><h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome to the Dashboard</h2><p className="text-lg text-gray-600 mb-8">Select a tool to get started.</p><div className="flex justify-center"><Link to="/optimizer" className="group bg-white p-8 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all w-full max-w-sm flex items-center justify-between"><div className="flex items-center gap-6"><div className="bg-indigo-100 text-indigo-600 p-4 rounded-lg"><MapIcon /></div><div className="text-left"><h3 className="text-xl font-bold text-gray-800">Route Optimizer</h3><p className="text-gray-500">Launch the interactive map to plan routes.</p></div></div><div className="text-indigo-400 group-hover:text-indigo-600 transition-colors"><ChevronRightIcon /></div></Link></div></div></main>);
}

// --- OPTIMIZER PAGE ---
function MapEvents({ onMapRightClick }) {
    useMapEvents({ contextmenu(e) { e.originalEvent.preventDefault(); onMapRightClick(e.latlng); }, });
    return null;
}

function OptimizerPage() {
  const [editablePoints, setEditablePoints] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routeManifest, setRouteManifest] = useState([]);
  const [activeTab, setActiveTab] = useState('controls'); 
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/get_points")
      .then(res => setEditablePoints(res.data))
      .catch(() => setError("Failed to load delivery points. Is the backend server running?"));
  }, []);

  const handleAddPoint = (latlng) => {
      const newPoint = { point_id: `user-${Date.now()}`, latitude: latlng.lat, longitude: latlng.lng, traffic_multiplier: 1.0, depot: 0 };
      setEditablePoints(prevPoints => [...prevPoints, newPoint]);
  };

  const handleRemovePoint = (pointIdToRemove) => {
      setEditablePoints(prevPoints => prevPoints.filter(p => p.point_id !== pointIdToRemove));
  };

  const runOptimization = async () => {
    setLoading(true);
    setError(null);
    setRoute([]);
    setDistance(null);
    setRouteManifest([]);
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/optimize_dynamic", editablePoints);
      const orderedPoints = res.data.optimized_route.map(id => editablePoints.find(p => p.point_id === id)).filter(Boolean);
      setDistance(res.data.total_distance_km);
      setRoute(orderedPoints.map(p => [p.latitude, p.longitude]));
      setRouteManifest(orderedPoints);
      setActiveTab('manifest'); 
    } catch {
      setError("The optimization process failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const depot = editablePoints.find(p => p.depot === 1);
  const deliveryPoints = editablePoints.filter(p => p.depot === 0);

  return (
    <div className="relative h-full w-full">
        {!isPanelVisible && (
            <button 
                onClick={() => setIsPanelVisible(true)} 
                className="absolute top-20 left-4 z-[1000] bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110" 
                aria-label="Show panel">
                <PanelLeftIcon />
            </button>
        )}
        <aside className={`absolute top-4 left-4 w-96 bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl z-[1000] border border-gray-200 flex flex-col max-h-[calc(100%-2rem)] transform transition-transform duration-300 ease-in-out ${isPanelVisible ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)]'}`}>
            <button onClick={() => setIsPanelVisible(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-900" aria-label="Hide panel"><XIcon /></button>
            <div className="flex-shrink-0 border-b border-gray-200 -mt-2 -mx-6 px-6 pb-2">
                 <div className="flex items-baseline justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Optimizer</h2>
                    <p className="text-xs text-gray-500">Right-click map to add</p>
                </div>
                <div className="flex">
                    <button onClick={() => setActiveTab('controls')} className={`py-2 px-3 text-sm font-semibold ${activeTab === 'controls' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Controls</button>
                    <button onClick={() => setActiveTab('points')} className={`py-2 px-3 text-sm font-semibold ${activeTab === 'points' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Points ({deliveryPoints.length})</button>
                    <button onClick={() => setActiveTab('manifest')} disabled={!routeManifest.length} className={`py-2 px-3 text-sm font-semibold ${activeTab === 'manifest' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'} disabled:text-gray-300`}>Manifest</button>
                </div>
            </div>

            <div className="flex-grow min-h-0 py-4 overflow-y-auto pr-2">
                {activeTab === 'controls' && (
                    <div>
                        <button onClick={runOptimization} disabled={loading || editablePoints.length < 2} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center transition-all shadow-lg">
                          {loading ? <LoadingSpinner /> : "Find Optimal Route"}
                        </button>
                        {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg font-medium">{error}</p>}
                        {distance !== null && !loading && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                 <h3 className="text-xl font-semibold text-gray-700 mb-4">Route Summary</h3>
                                 <div className="grid grid-cols-1 gap-4">
                                     <StatCard icon={<RouteIcon />} label="Distance" value={distance.toFixed(2)} unit="km" />
                                     <StatCard icon={<StopsIcon />} label="Stops" value={route.length > 1 ? route.length - 1 : 0} unit="deliveries" />
                                 </div>
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'points' && (
                    <div>
                        <ul className="space-y-2">
                            {depot && <li className="flex items-center gap-3 text-sm p-1.5 rounded-md bg-red-50"><div className="w-7 h-7 flex items-center justify-center rounded-md text-white bg-red-500"><DepotStopIcon /></div><p className="font-bold text-gray-700">Depot (ID: {depot.point_id})</p></li>}
                            {deliveryPoints.map(point => (<li key={point.point_id} className="flex items-center justify-between gap-3 text-sm p-1.5 rounded-md bg-gray-50"><div className="flex items-center gap-3"><div className="w-7 h-7 flex items-center justify-center rounded-md text-white bg-blue-500"><DeliveryStopIcon /></div><p className="font-semibold text-gray-700">ID: {point.point_id.toString().startsWith('user-') ? 'New Point' : point.point_id}</p></div><button onClick={() => handleRemovePoint(point.point_id)} className="text-gray-400 hover:text-red-500 hover:bg-red-100 p-1 rounded-full"><TrashIcon /></button></li>))}
                        </ul>
                    </div>
                )}

                {activeTab === 'manifest' && routeManifest.length > 0 && (
                    <div>
                        <ul className="space-y-2">
                            {routeManifest.map((point, index) => (<li key={point.point_id} className="flex items-center gap-3 text-sm p-1.5 rounded-md bg-gray-50"><div className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-white ${point.depot ? 'bg-red-500' : 'bg-blue-500'}`}>{point.depot ? <DepotStopIcon /> : index}</div><div><p className="font-bold text-gray-700">{point.depot ? 'Depot' : `Stop ${index}`}</p><p className="text-gray-500">ID: {point.point_id.toString().startsWith('user-') ? 'New' : point.point_id}</p></div></li>))}
                        </ul>
                    </div>
                )}
            </div>
        </aside>

        <MapContainer center={[17.385, 78.4867]} zoom={12} style={{ height: "100%", width: "100%", zIndex: 5 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <MapEvents onMapRightClick={handleAddPoint} />
            {editablePoints.map((p) => (<Marker key={p.point_id} position={[p.latitude, p.longitude]} icon={p.depot ? depotIcon : deliveryIcon}><Popup><strong>{p.depot ? "Depot" : "Delivery Point"}</strong><br/>ID: {p.point_id}</Popup></Marker>))}
            {route.length > 0 && <Polyline positions={route} color="#4F46E5" weight={5} opacity={0.8} />}
            {route.length > 0 && <FitBounds positions={route} />}
        </MapContainer>
    </div>
  );
}


// --- MAIN APP COMPONENT ---
function AppContent() {
    const [loggedIn, setLoggedIn] = useState(false);
    const location = useLocation();
    const showFooter = location.pathname !== '/optimizer';
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans"> {/*<-- CHANGED to min-h-screen*/} 
            <Header />
            <div className="flex-grow flex flex-col overflow-y-auto"> {/* Also remove min-h-0 here for best results */}
              <Routes>
                  <Route path="/" element={loggedIn ? <Homepage /> : <Navigate to="/login" replace />} />
                  <Route path="/optimizer" element={loggedIn ? <OptimizerPage /> : <Navigate to="/login" replace />} />
                  <Route path="/login" element={<Login onLogin={setLoggedIn} />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<main className="flex-grow flex items-center justify-center p-6 text-center"><h2>404: Page Not Found</h2></main>} />
              </Routes>
            </div>
            {showFooter && <Footer />}
        </div>
    );
}
export default function App() { return (<Router><AppContent /></Router>); }

