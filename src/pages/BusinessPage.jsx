import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BusinessPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
  const [reviewNote, setReviewNote] = useState({ message: '', type: '' });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [slug]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/marketplace/businesses/${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error('Business not found');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate(`/account?type=member&next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      const res = await fetch(`/api/marketplace/businesses/${encodeURIComponent(profile.business.id)}/favorite`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('sajilo_token')}` }
      });
      if (res.ok) setIsSaved(true);
    } catch (err) {
      console.error('Error saving favorite:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(`/account?type=member&next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      const res = await fetch(`/api/marketplace/businesses/${encodeURIComponent(profile.business.id)}/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sajilo_token')}` 
        },
        body: JSON.stringify(reviewForm)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to post review');

      setProfile(prev => ({
        ...prev,
        reviews: [result, ...prev.reviews]
      }));
      setReviewForm({ rating: 5, title: '', body: '' });
      setReviewNote({ message: 'Review posted successfully!', type: 'success' });
    } catch (err) {
      setReviewNote({ message: err.message, type: 'error' });
    }
  };

  if (loading) return <div className="business-loader">Loading profile...</div>;
  if (error || !profile) return (
    <div className="business-empty">
      <h2>Business not found</h2>
      <p>Return to marketplace search and choose another listing.</p>
      <Link className="button primary" to="/marketplace">Back to search</Link>
    </div>
  );

  const { business, reviews } = profile;

  return (
    <div className="business-container">
      {/* Hero Section */}
      <section className="business-hero">
        <div className="hero-media">
          <img src={business.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200'} alt={business.name} />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <span className="eyebrow-tag">{business.categoryName || 'Local Service'}</span>
          <h1>{business.name}</h1>
          <div className="rating-row">
            <span className="stars">{'★'.repeat(Math.round(business.rating))}</span>
            <strong>{Number(business.rating).toFixed(1)}</strong>
            <span>({Number(business.reviewCount || 0) + reviews.length} reviews)</span>
          </div>
          <p className="description">{business.description}</p>
          <div className="badge-row">
            {business.trustBadges?.map(badge => <span key={badge} className="badge trust">{badge}</span>)}
            {business.serviceModes?.map(mode => <span key={mode} className="badge mode">{mode}</span>)}
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <nav className="business-actions">
        <a href={`tel:${business.phone}`} className="button primary">Call</a>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.lat},${business.lng}`)}`} target="_blank" rel="noreferrer" className="button secondary">Directions</a>
        <button className={`button secondary ${isSaved ? 'is-active' : ''}`} onClick={handleSave}>
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <Link to="/account?type=business" className="button secondary">Claim Business</Link>
      </nav>

      <div className="business-grid">
        <div className="main-info">
          {/* Details Section */}
          <section className="info-panel">
            <h3>Community Details</h3>
            <div className="detail-item">
              <strong>Address</strong>
              <p>{business.address}</p>
              <p>{business.neighborhood} | {business.cityName}, {business.stateCode}</p>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="reviews-section">
            <div className="section-header">
              <h2>What members say</h2>
              <p className="subtitle">Real experiences from the community</p>
            </div>

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="form-row">
                <select 
                  value={reviewForm.rating} 
                  onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                >
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
                <input 
                  type="text" 
                  placeholder="Review Title" 
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                  required
                />
              </div>
              <textarea 
                placeholder="Share your community experience..." 
                value={reviewForm.body}
                onChange={(e) => setReviewForm({...reviewForm, body: e.target.value})}
                required
              ></textarea>
              <button type="submit" className="button primary">Post Review</button>
              {reviewNote.message && <p className={`form-note ${reviewNote.type === 'success' ? 'is-success' : 'is-error'}`}>{reviewNote.message}</p>}
            </form>

            <div className="review-list">
              {reviews.map((r, i) => (
                <article key={i} className="review-card">
                  <div className="review-header">
                    <span className="stars">{'★'.repeat(r.rating)}</span>
                    <span className="source">{r.verificationSource?.replaceAll('_', ' ') || 'member'}</span>
                  </div>
                  <h4>{r.title}</h4>
                  <p>{r.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="side-info">
          {/* Services Panel */}
          <section className="info-panel">
            <h3>Popular Options</h3>
            <div className="service-list">
              {business.topServices?.map(s => (
                <div key={s.name} className="service-item">
                  <strong>{s.name}</strong>
                  <span>{s.priceLabel}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Hours Panel */}
          <section className="info-panel">
            <h3>Hours</h3>
            <div className="hours-list">
              {Object.entries(business.hours || {}).map(([day, hrs]) => (
                <div key={day} className="hour-row">
                  <span className="day">{day.toUpperCase()}</span>
                  <span className="hrs">{hrs}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <style>{`
        .business-container { max-width: 1200px; margin: 0 auto; padding-bottom: 5rem; }
        
        .business-hero { position: relative; height: 500px; color: white; border-radius: 0 0 32px 32px; overflow: hidden; margin-bottom: 2rem; }
        .hero-media { position: absolute; inset: 0; z-index: -1; }
        .hero-media img { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); }
        
        .hero-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 3rem; max-width: 800px; }
        .eyebrow-tag { background: var(--accent); padding: 0.4rem 1rem; border-radius: 50px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 1rem; display: inline-block; }
        .hero-content h1 { font-size: 3.5rem; font-weight: 900; margin-bottom: 1rem; letter-spacing: -1px; }
        .rating-row { display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem; margin-bottom: 1rem; }
        .rating-row .stars { color: #ff9900; letter-spacing: 2px; }
        .description { font-size: 1.15rem; opacity: 0.9; line-height: 1.6; margin-bottom: 2rem; }
        .badge-row { display: flex; gap: 0.75rem; }
        .badge { padding: 0.4rem 1rem; border-radius: 12px; font-weight: 700; font-size: 0.85rem; }
        .badge.trust { background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); }
        .badge.mode { background: #11856f; }

        .business-actions { display: flex; gap: 1rem; padding: 0 2rem; margin-bottom: 3rem; }
        .business-actions .button { padding: 1rem 2.5rem; border-radius: 14px; font-weight: 800; }
        
        .business-grid { display: grid; grid-template-columns: 1fr 380px; gap: 2.5rem; padding: 0 2rem; }
        
        .info-panel { background: white; padding: 2rem; border-radius: 24px; border: 1px solid #eee; margin-bottom: 2rem; }
        .info-panel h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 1.5rem; border-bottom: 2px solid var(--accent); display: inline-block; padding-bottom: 0.5rem; }
        
        .service-item { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f5f5f5; }
        .service-item strong { color: #333; }
        .service-item span { color: var(--accent); font-weight: 800; }

        .hour-row { display: flex; justify-content: space-between; padding: 0.5rem 0; }
        .hour-row .day { color: #888; font-weight: 700; font-size: 0.85rem; }
        .hour-row .hrs { font-weight: 600; color: #333; }

        .reviews-section { background: white; padding: 3rem; border-radius: 32px; border: 1px solid #eee; }
        .section-header h2 { font-size: 2.2rem; font-weight: 900; margin-bottom: 0.5rem; }
        .subtitle { color: #777; font-size: 1.1rem; margin-bottom: 2.5rem; }

        .review-form { background: #f9fbff; padding: 2rem; border-radius: 20px; border: 1px solid #eef2f8; margin-bottom: 3rem; }
        .form-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
        .review-form select { padding: 0.8rem; border-radius: 12px; border: 1px solid #ddd; font-weight: 700; }
        .review-form input { flex: 1; padding: 0.8rem; border-radius: 12px; border: 1px solid #ddd; outline: none; }
        .review-form textarea { width: 100%; height: 120px; padding: 1rem; border-radius: 12px; border: 1px solid #ddd; margin-bottom: 1rem; outline: none; }

        .review-card { padding: 2rem 0; border-bottom: 1px solid #f0f0f0; }
        .review-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
        .review-header .stars { color: #ff9900; }
        .review-header .source { color: #888; font-size: 0.8rem; text-transform: uppercase; font-weight: 800; }
        .review-card h4 { font-size: 1.2rem; margin-bottom: 0.75rem; font-weight: 800; }
        .review-card p { line-height: 1.6; color: #555; }

        .is-success { color: #11856f; font-weight: 700; margin-top: 1rem; }
        .is-error { color: #d32323; font-weight: 700; margin-top: 1rem; }
      `}</style>
    </div>
  );
};

export default BusinessPage;
