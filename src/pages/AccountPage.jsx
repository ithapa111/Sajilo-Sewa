import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AccountPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, logout, checkAuth } = useAuth();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('type') === 'business' ? 'business' : 'member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [session, setSession] = useState({ member: null, business: null });

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'business' || type === 'member') {
      setActiveTab(type);
    }
  }, [searchParams]);

  useEffect(() => {
    updateSessionState();
  }, []);

  const updateSessionState = () => {
    const memberUser = localStorage.getItem('sajilo_member_user');
    const businessUser = localStorage.getItem('sajilo_business_user');
    setSession({
      member: memberUser ? JSON.parse(memberUser) : null,
      business: businessUser ? JSON.parse(businessUser) : null
    });
  };

  const handleAuth = async (e, type, mode) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const payload = type === 'member' 
      ? {
          fullName: formData.get('fullName') || formData.get('email'),
          email: formData.get('email'),
          password: formData.get('password')
        }
      : {
          businessName: formData.get('businessName') || formData.get('email'),
          contactName: formData.get('contactName') || formData.get('businessName') || formData.get('email'),
          email: formData.get('email'),
          password: formData.get('password')
        };

    try {
      const res = await fetch(`/api/auth/${type}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Authentication failed');
      }

      localStorage.setItem(`sajilo_${type}_token`, result.token);
      localStorage.setItem(`sajilo_${type}_user`, JSON.stringify(result.user));
      localStorage.setItem('sajilo_token', result.token);

      setSuccess(`${mode === 'signup' ? 'Account created' : 'Logged in'} successfully!`);
      
      // Sync global auth state
      await checkAuth();
      updateSessionState();

      const next = searchParams.get('next');
      if (next) {
        navigate(next);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    [
      'sajilo_member_token',
      'sajilo_business_token',
      'sajilo_member_user',
      'sajilo_business_user',
      'sajilo_token'
    ].forEach((key) => localStorage.removeItem(key));
    logout();
    updateSessionState();
    setSuccess('Logged out successfully');
  };

  return (
    <div className="account-layout">
      <section className="account-hero">
        <p className="eyebrow">Two account paths</p>
        <h2>One app for members and local businesses.</h2>
        <p>
          Members can review, save, order, book, and request services. Businesses can claim listings and manage their
          community profile.
        </p>
      </section>

      <section className="account-panel" aria-label="Account forms">
        <div className="account-tabs" role="tablist" aria-label="Account type">
          <button 
            className={activeTab === 'member' ? 'is-active' : ''} 
            onClick={() => setActiveTab('member')}
            type="button"
          >
            Member Login
          </button>
          <button 
            className={activeTab === 'business' ? 'is-active' : ''} 
            onClick={() => setActiveTab('business')}
            type="button"
          >
            Business Login
          </button>
        </div>

        <div className="account-form-grid">
          {activeTab === 'member' ? (
            <form className="account-form" onSubmit={(e) => {
              const mode = e.nativeEvent.submitter.value;
              handleAuth(e, 'member', mode);
            }}>
              <p className="eyebrow">Community member</p>
              <h3>Member login or signup</h3>
              <label>
                <span>Full name</span>
                <input name="fullName" type="text" placeholder="Your name" />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" required placeholder="you@example.com" />
              </label>
              <label>
                <span>Password</span>
                <input name="password" type="password" required placeholder="Password" />
              </label>
              <div className="account-action-row">
                <button className="button primary" type="submit" value="login" disabled={loading}>
                  {loading ? 'Processing...' : 'Login'}
                </button>
                <button className="button secondary" type="submit" value="signup" disabled={loading}>
                  Join as member
                </button>
              </div>
              {error && activeTab === 'member' && <p className="form-note is-blocked">{error}</p>}
              {success && activeTab === 'member' && <p className="form-note is-success">{success}</p>}
            </form>
          ) : (
            <form className="account-form" onSubmit={(e) => {
              const mode = e.nativeEvent.submitter.value;
              handleAuth(e, 'business', mode);
            }}>
              <p className="eyebrow">Business owner</p>
              <h3>Business login or signup</h3>
              <label>
                <span>Business name</span>
                <input name="businessName" type="text" placeholder="Business name" />
              </label>
              <label>
                <span>Contact name</span>
                <input name="contactName" type="text" placeholder="Owner or manager" />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" required placeholder="owner@example.com" />
              </label>
              <label>
                <span>Password</span>
                <input name="password" type="password" required placeholder="Password" />
              </label>
              <div className="account-action-row">
                <button className="button primary" type="submit" value="login" disabled={loading}>
                  {loading ? 'Processing...' : 'Login'}
                </button>
                <button className="button secondary" type="submit" value="signup" disabled={loading}>
                  Create business account
                </button>
              </div>
              {error && activeTab === 'business' && <p className="form-note is-blocked">{error}</p>}
              {success && activeTab === 'business' && <p className="form-note is-success">{success}</p>}
            </form>
          )}
        </div>

        <article className="account-session">
          {(session.member || session.business) ? (
            <>
              <div className="account-session-grid">
                {session.member && (
                  <div>
                    <p className="label">Member session</p>
                    <strong>{session.member.email}</strong>
                    <span>{session.member.role}</span>
                  </div>
                )}
                {session.business && (
                  <div>
                    <p className="label">Business session</p>
                    <strong>{session.business.email}</strong>
                    <span>{session.business.role}</span>
                  </div>
                )}
              </div>
              <button className="button secondary" type="button" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <p className="label">Not signed in</p>
              <strong>Choose member or business login.</strong>
            </>
          )}
        </article>
      </section>
    </div>
  );
};

export default AccountPage;
