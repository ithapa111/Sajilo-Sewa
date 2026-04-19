import { useState, useEffect } from 'react';

const COURIER_TIERS = [
  { id: 'priority', name: 'Sazilo Priority', speed: '1-2 Hours', price: '$15.00', icon: '⚡', desc: 'DHL-style high-speed delivery for urgent documents.' },
  { id: 'ground', name: 'Sazilo Ground', speed: 'Same Day', price: '$8.50', icon: '🚚', desc: 'UPS-style reliable local parcel delivery.' },
  { id: 'express', name: 'Sazilo Express', speed: 'By 5:00 PM', price: '$12.00', icon: '📦', desc: 'FedEx-style guaranteed end-of-day delivery.' }
];

const CourierPage = () => {
  const [data, setData] = useState(null);
  const [trackingId, setTrackingId] = useState('SZL-9982-XQ');
  const [activeTab, setActiveTab] = useState('track'); // 'track' or 'ship'

  useEffect(() => {
    fetch('/api/seed')
      .then(res => res.json())
      .then(seed => setData(seed));
  }, []);

  const delivery = data?.courierDelivery?.deliveries?.[0];
  const courier = data?.users?.couriers?.[0];

  return (
    <div className="courier-container">
      {/* Logistics Hero */}
      <section className="courier-hero">
        <div className="hero-overlay">
          <div className="hero-inner">
            <span className="service-badge">Global Standards, Local Touch</span>
            <h1>Local Logistics, Reimagined.</h1>
            <p>Precise delivery solutions for businesses and individuals.</p>
            
            <div className="logistics-tabs">
              <button className={activeTab === 'track' ? 'active' : ''} onClick={() => setActiveTab('track')}>Track</button>
              <button className={activeTab === 'ship' ? 'active' : ''} onClick={() => setActiveTab('ship')}>Ship</button>
            </div>

            <div className="tracking-input-group">
              <input 
                type="text" 
                placeholder="Enter Tracking ID (e.g. SZL-XXXX-XX)" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
              <button className="track-btn">Track Shipment</button>
            </div>
          </div>
        </div>
      </section>

      <div className="courier-grid">
        {/* Main Tracking Dashboard (Left) */}
        <main className="tracking-dashboard">
          <div className="dashboard-card">
            <div className="card-header">
              <div className="title-group">
                <p className="label">ACTIVE SHIPMENT</p>
                <h2>{trackingId}</h2>
              </div>
              <div className="status-badge on-time">On Time</div>
            </div>

            <div className="shipment-progress">
              <div className="step completed">
                <div className="bullet"></div>
                <div className="content">
                  <strong>Shipment Picked Up</strong>
                  <span>Irving Hub • 09:42 AM</span>
                </div>
              </div>
              <div className="step active">
                <div className="bullet"></div>
                <div className="content">
                  <strong>In Transit</strong>
                  <span>Processing at Local Sort Facility</span>
                </div>
              </div>
              <div className="step pending">
                <div className="bullet"></div>
                <div className="content">
                  <strong>Out for Delivery</strong>
                  <span>Estimated by 2:30 PM</span>
                </div>
              </div>
              <div className="step pending">
                <div className="bullet"></div>
                <div className="content">
                  <strong>Delivered</strong>
                  <span>Pending Drop-off</span>
                </div>
              </div>
            </div>

            <div className="route-preview">
              <div className="route-node">
                <span className="node-label">Origin</span>
                <p>{delivery?.pickupAddress || '1200 Heritage Ln, Irving, TX'}</p>
              </div>
              <div className="route-divider"></div>
              <div className="route-node">
                <span className="node-label">Destination</span>
                <p>{delivery?.dropoffAddress || '8800 Valley View Ln, Irving, TX'}</p>
              </div>
            </div>
          </div>

          <div className="service-tiers-grid">
            {COURIER_TIERS.map(tier => (
              <div key={tier.id} className="tier-card">
                <div className="tier-icon">{tier.icon}</div>
                <h3>{tier.name}</h3>
                <p>{tier.desc}</p>
                <div className="tier-footer">
                  <strong>{tier.speed}</strong>
                  <span>Starts at {tier.price}</span>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Precise Info Sidebar (Right) */}
        <aside className="courier-sidebar">
          <div className="spec-card">
            <h3>Shipment Specs</h3>
            <div className="spec-row">
              <span>Weight</span>
              <strong>2.40 kg</strong>
            </div>
            <div className="spec-row">
              <span>Dimensions</span>
              <strong>12" x 8" x 4"</strong>
            </div>
            <div className="spec-row">
              <span>Service Type</span>
              <strong>Priority Express</strong>
            </div>
            <div className="spec-row">
              <span>Instructions</span>
              <strong>Leave at front desk</strong>
            </div>
          </div>

          <div className="courier-brief">
            <div className="courier-meta">
              <img src={`https://i.pravatar.cc/100?u=${courier?.id || 'courier'}`} alt="Courier" />
              <div>
                <strong>{courier?.fullName || 'Ankit Sharma'}</strong>
                <span>★ 4.9 Professional Courier</span>
              </div>
            </div>
            <button className="button secondary full-width">Message Courier</button>
          </div>

          <div className="coverage-card">
            <p className="label">CITY-WIDE NETWORK</p>
            <div className="stat">
              <strong>40+</strong>
              <span>Active Couriers</span>
            </div>
            <div className="stat">
              <strong>99.8%</strong>
              <span>On-time Rate</span>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .courier-container {
          max-width: 1300px;
          margin: 0 auto;
          padding-bottom: 5rem;
        }

        .courier-hero {
          background: #000 url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop') center/cover;
          border-radius: 0 0 40px 40px;
          overflow: hidden;
          margin-bottom: 3rem;
          color: white;
        }

        .hero-overlay {
          background: linear-gradient(rgba(16, 163, 127, 0.9), rgba(11, 133, 111, 0.8));
          padding: 6rem 2rem;
          text-align: center;
        }

        .hero-inner {
          max-width: 800px;
          margin: 0 auto;
        }

        .service-badge {
          background: rgba(255,255,255,0.2);
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          display: inline-block;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .courier-hero h1 { font-size: 4rem; font-weight: 900; margin-bottom: 1rem; }
        .courier-hero p { font-size: 1.25rem; opacity: 0.9; margin-bottom: 3rem; }

        .logistics-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .logistics-tabs button {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.4);
          color: white;
          padding: 0.6rem 2rem;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }

        .logistics-tabs button.active {
          background: white;
          color: #10a37f;
          border-color: white;
        }

        .tracking-input-group {
          background: white;
          padding: 0.5rem;
          border-radius: 50px;
          display: flex;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .tracking-input-group input {
          border: none;
          flex: 1;
          padding: 0 1.5rem;
          font-size: 1.1rem;
          outline: none;
          color: #333;
        }

        .track-btn {
          background: #10a37f;
          color: white;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          font-weight: 800;
          cursor: pointer;
        }

        .courier-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2.5rem;
          padding: 0 1.5rem;
        }

        .dashboard-card {
          background: white;
          border-radius: 24px;
          border: 1px solid #eee;
          padding: 2.5rem;
          margin-bottom: 2rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f5f5f5;
        }

        .card-header h2 { font-size: 2.2rem; font-weight: 900; margin: 0; }

        .status-badge {
          padding: 0.5rem 1.25rem;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.85rem;
          text-transform: uppercase;
        }

        .status-badge.on-time { background: #e7f6f2; color: #10a37f; }

        .shipment-progress {
          margin-bottom: 3rem;
          padding-left: 2rem;
          position: relative;
        }

        .shipment-progress::before {
          content: '';
          position: absolute;
          left: 4px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #eee;
        }

        .step {
          position: relative;
          padding-bottom: 2rem;
          padding-left: 1.5rem;
        }

        .step:last-child { padding-bottom: 0; }

        .bullet {
          position: absolute;
          left: -19px;
          top: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #eee;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #eee;
          z-index: 1;
        }

        .step.completed .bullet { background: #10a37f; box-shadow: 0 0 0 2px #10a37f; }
        .step.active .bullet { 
          background: white; 
          box-shadow: 0 0 0 2px #10a37f; 
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0px rgba(16, 163, 127, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16, 163, 127, 0); }
          100% { box-shadow: 0 0 0 0px rgba(16, 163, 127, 0); }
        }

        .step.completed .content strong { color: #10a37f; }
        .step .content strong { display: block; font-size: 1.1rem; font-weight: 800; }
        .step .content span { font-size: 0.9rem; color: #888; }

        .route-preview {
          background: #f8faff;
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .route-node { flex: 1; }
        .node-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #888; display: block; margin-bottom: 0.25rem; }
        .route-node p { font-weight: 700; color: #333; margin: 0; line-height: 1.4; }
        .route-divider { width: 40px; height: 2px; background: #ddd; border-radius: 2px; }

        .service-tiers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .tier-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid #eee;
          transition: all 0.3s;
        }

        .tier-card:hover { border-color: #10a37f; transform: translateY(-5px); }
        .tier-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .tier-card h3 { font-weight: 800; margin-bottom: 0.75rem; }
        .tier-card p { font-size: 0.9rem; color: #666; margin-bottom: 1.5rem; line-height: 1.5; }
        
        .tier-footer {
          border-top: 1px solid #f5f5f5;
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
        }

        .tier-footer strong { color: #10a37f; font-size: 1.1rem; }
        .tier-footer span { font-size: 0.8rem; color: #888; }

        .courier-sidebar { display: flex; flex-direction: column; gap: 2rem; }

        .spec-card, .coverage-card, .courier-brief {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid #eee;
        }

        .spec-card h3 { font-weight: 800; margin-bottom: 1.5rem; }
        .spec-row {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .spec-row:last-child { border: none; }
        .spec-row span { color: #888; font-weight: 600; }
        .spec-row strong { color: #333; font-weight: 800; }

        .courier-meta { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; }
        .courier-meta img { width: 50px; height: 50px; border-radius: 50%; }
        .courier-meta strong { display: block; font-weight: 800; }
        .courier-meta span { font-size: 0.8rem; color: #10a37f; font-weight: 700; }

        .stat { margin-top: 1.5rem; }
        .stat strong { font-size: 1.8rem; font-weight: 900; color: #10a37f; display: block; }
        .stat span { font-size: 0.9rem; color: #888; font-weight: 600; }

        .full-width { width: 100%; }
      `}</style>
    </div>
  );
};

export default CourierPage;
