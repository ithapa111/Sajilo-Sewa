import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DEFAULT_PICKUP = {
  address: "Chicago, IL",
  lat: 41.8781,
  lng: -87.6298
};

const LIVE_ETA_MINUTES = {
  tier_go: 4,
  tier_plus: 2,
  tier_exec: 6
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Component to handle map view updates
function ChangeView({ bounds }) {
  const map = useMap();
  if (bounds) map.fitBounds(bounds, { padding: [50, 50] });
  return null;
}

const RidePage = () => {
  const [data, setData] = useState(null);
  const [pickup, setPickup] = useState(DEFAULT_PICKUP);
  const [dropoff, setDropoff] = useState(null);
  const [route, setRoute] = useState(null);
  const [selectedTierId, setSelectedTierId] = useState(null);
  const [destinationInput, setDestinationInput] = useState('');
  const [status, setStatus] = useState({ type: 'ready', message: 'Detecting location...' });
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ from: "driver", text: "I am nearby. Share an exact entrance if needed." }]);
  const [messageDraft, setMessageDraft] = useState('');

  useEffect(() => {
    fetch('/api/seed')
      .then(res => res.json())
      .then(seed => {
        setData(seed);
        if (seed.rideshare?.serviceTiers?.[0]) {
          setSelectedTierId(seed.rideshare.serviceTiers[0].id);
        }
      });
    
    initializeLocation();
  }, []);

  const initializeLocation = () => {
    if (!navigator.geolocation) {
      setStatus({ type: 'error', message: 'Geolocation not supported. Using fallback.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`/api/location/reverse?lat=${latitude}&lng=${longitude}`);
          const geo = await res.json();
          setPickup({ lat: latitude, lng: longitude, address: geo.address });
          setStatus({ type: 'ready', message: 'Location detected. Where to?' });
        } catch (err) {
          setPickup({ lat: latitude, lng: longitude, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
        }
      },
      () => setStatus({ type: 'error', message: 'Location denied. Using fallback.' })
    );
  };

  const handleDestinationSubmit = async (e) => {
    e.preventDefault();
    if (!destinationInput.trim()) return;

    setLoading(true);
    setStatus({ type: 'searching', message: 'Calculating your trip...' });

    try {
      const geoRes = await fetch(`/api/location/search?q=${encodeURIComponent(destinationInput)}`);
      const dest = await geoRes.json();
      
      const routeRes = await fetch(`/api/rideshare/route?pickupLat=${pickup.lat}&pickupLng=${pickup.lng}&dropoffLat=${dest.lat}&dropoffLng=${dest.lng}`);
      const routeData = await routeRes.json();

      setDropoff(dest);
      setRoute(routeData);
      setDestinationInput(dest.address);
      setStatus({ type: 'ready', message: 'Route updated!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to find route.' });
    } finally {
      setLoading(false);
    }
  };

  const getMetrics = (tier) => {
    if (!tier) return {};
    const distanceMiles = route ? route.distanceMeters * 0.000621371 : 0;
    const durationMinutes = route ? route.durationSeconds / 60 : 0;
    const etaMinutes = LIVE_ETA_MINUTES[tier.id] || 5;
    
    const fare = Math.max(
      tier.minimumFare || 0,
      (tier.baseFare || 0) + (tier.bookingFee || 0) + (distanceMiles * (tier.perMile || 0)) + (durationMinutes * (tier.perMinute || 0))
    );

    return { distanceMiles, durationMinutes, etaMinutes, fare };
  };

  const activeTier = data?.rideshare?.serviceTiers?.find(t => t.id === selectedTierId) || data?.rideshare?.serviceTiers?.[0];
  const metrics = getMetrics(activeTier);
  const activeDriver = data?.users?.drivers?.[0];
  const activeVehicle = data?.rideshare?.vehicles?.[0];

  const mapBounds = route?.geometry?.coordinates 
    ? L.latLngBounds(route.geometry.coordinates.map(c => [c[1], c[0]]))
    : L.latLngBounds([[pickup.lat, pickup.lng], dropoff ? [dropoff.lat, dropoff.lng] : [pickup.lat, pickup.lng]]);

  return (
    <div className="ride-page-container">
      <div className="ride-grid">
        {/* Left Sidebar */}
        <aside className="ride-sidebar">
          <div className="location-inputs">
            <h2>Where to?</h2>
            <div className="input-card pickup">
              <div className="dot green"></div>
              <div className="details">
                <span className="addr">{pickup.address}</span>
                <span className="coords">Lat {pickup.lat.toFixed(4)} | Lng {pickup.lng.toFixed(4)}</span>
              </div>
            </div>
            
            <form onSubmit={handleDestinationSubmit} className="input-card dropoff">
              <div className="dot red"></div>
              <div className="details">
                <input 
                  type="text" 
                  placeholder="Enter destination" 
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                />
                {dropoff && <span className="coords">Lat {dropoff.lat.toFixed(4)} | Lng {dropoff.lng.toFixed(4)}</span>}
              </div>
              <button type="submit" disabled={loading} className="update-btn">
                {loading ? '...' : 'Go'}
              </button>
            </form>
          </div>

          <div className="tier-selection">
            <p className="label">SAJILO SELECTION</p>
            <div className="tier-list">
              {data?.rideshare?.serviceTiers?.map(tier => {
                const m = getMetrics(tier);
                const isActive = tier.id === selectedTierId;
                return (
                  <button 
                    key={tier.id} 
                    className={`tier-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => setSelectedTierId(tier.id)}
                  >
                    <div className="tier-info">
                      <strong>{tier.name}</strong>
                      <span>{m.etaMinutes} min away • {tier.capacity} seats</span>
                    </div>
                    <div className="tier-price">
                      {route ? currencyFormatter.format(m.fare) : '--'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            className="button primary request-btn" 
            disabled={!route || status.type === 'confirmed'}
            onClick={() => setStatus({ type: 'confirmed', message: 'Driver is on the way!' })}
          >
            {status.type === 'confirmed' ? 'Trip Confirmed' : `Request ${activeTier?.name || 'Ride'}`}
          </button>
        </aside>

        {/* Map View */}
        <main className="ride-map-area">
          <MapContainer 
            center={[pickup.lat, pickup.lng]} 
            zoom={13} 
            style={{ height: '100%', width: '100%', borderRadius: '24px' }}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <ChangeView bounds={mapBounds} />
            
            <Marker position={[pickup.lat, pickup.lng]}>
              <Tooltip permanent direction="top">PICKUP</Tooltip>
            </Marker>
            
            {dropoff && (
              <Marker position={[dropoff.lat, dropoff.lng]}>
                <Tooltip permanent direction="top">DESTINATION</Tooltip>
              </Marker>
            )}

            {route?.geometry && (
              <Polyline 
                positions={route.geometry.coordinates.map(c => [c[1], c[0]])}
                pathOptions={{ color: '#1b74ff', weight: 6 }}
              />
            )}
          </MapContainer>

          {status.message && (
            <div className={`status-overlay ${status.type}`}>
              {status.message}
            </div>
          )}

          {route && activeDriver && (
            <div className="driver-float">
              <div className="driver-meta">
                <img src={`https://i.pravatar.cc/100?u=${activeDriver.id}`} alt="Driver" />
                <div>
                  <strong>{activeDriver.fullName}</strong>
                  <span>{activeVehicle.color} {activeVehicle.make} • {activeVehicle.plateNumber}</span>
                </div>
              </div>
              <div className="driver-stats">
                <div><span>ETA</span><strong>{metrics.etaMinutes}m</strong></div>
                <div><span>RATE</span><strong>★{activeDriver.rating}</strong></div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .ride-page-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          height: calc(100vh - 100px);
        }
        .ride-grid {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 2rem;
          height: 100%;
        }
        .ride-sidebar {
          background: white;
          padding: 2rem;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          border: 1px solid #eee;
        }
        .location-inputs h2 { margin: 0 0 1.5rem; font-size: 1.8rem; font-weight: 800; }
        .input-card {
          background: #f8faff;
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
          border: 1px solid #eef2f8;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
        .dot.green { background: #0b856f; }
        .dot.red { background: #d32323; border-radius: 2px; }
        .details { flex: 1; display: flex; flex-direction: column; }
        .details .addr { font-weight: 700; font-size: 0.95rem; }
        .details .coords { font-size: 0.75rem; color: #888; margin-top: 4px; }
        .details input { border: none; background: transparent; font-weight: 700; width: 100%; outline: none; }
        .update-btn { background: #eee; border: none; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 700; cursor: pointer; }
        
        .tier-list { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
        .tier-card {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          border-radius: 12px;
          border: 2px solid #f0f0f0;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tier-card.is-active { border-color: #1b74ff; background: #f0f7ff; }
        .tier-info { display: flex; flex-direction: column; text-align: left; }
        .tier-info span { font-size: 0.8rem; color: #666; }
        .tier-price { font-weight: 800; font-size: 1.1rem; }
        
        .request-btn { height: 60px; font-size: 1.2rem; font-weight: 800; }

        .ride-map-area { position: relative; }
        .status-overlay {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          z-index: 1000;
          font-weight: 700;
          border-left: 5px solid #1b74ff;
        }
        .status-overlay.error { border-left-color: #d32323; color: #d32323; }
        .status-overlay.confirmed { border-left-color: #0b856f; color: #0b856f; }

        .driver-float {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: #070f1c;
          color: white;
          padding: 1.5rem;
          border-radius: 18px;
          z-index: 1000;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .driver-meta { display: flex; gap: 1rem; align-items: center; }
        .driver-meta img { width: 48px; height: 48px; border-radius: 50%; }
        .driver-meta span { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
        .driver-stats { display: flex; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; justify-content: space-around; }
        .driver-stats div { display: flex; flex-direction: column; align-items: center; }
        .driver-stats span { font-size: 0.7rem; color: rgba(255,255,255,0.5); }
      `}</style>
    </div>
  );
};

export default RidePage;
