import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api';

const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <path d="M16 14h.01" />
  </svg>
);

function App() {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hostForm, setHostForm] = useState({
    ownerName: '',
    title: '',
    location: '',
    areaSqFt: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setError(null);
        const res = await axios.get(`${API_BASE}/properties`);
        setProperties(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Could not load properties. Using demo data.');
        setProperties([
          { id: 'demo-1', title: 'Demo Solar Farm', location: 'Austin, TX', roi: 15, price: 450, fundedPercentage: 72, capacity: 25 },
          { id: 'demo-2', title: 'Demo Rooftop', location: 'Phoenix, AZ', roi: 17, price: 520, fundedPercentage: 45, capacity: 18 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const addToCart = (property, amount = 1) => {
    const existing = cart.find((i) => i.id === property.id);
    if (existing) {
      setCart(cart.map((i) => (i.id === property.id ? { ...i, qty: i.qty + amount } : i)));
    } else {
      setCart([...cart, { ...property, qty: amount }]);
    }
    setView('cart');
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const cartTotal = cart.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);

  const handleHostSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      await axios.post(`https://hult-26.onrender.com/api/properties`, {
        ownerName: hostForm.ownerName,
        title: hostForm.title,
        location: hostForm.location,
        areaSqFt: Number(hostForm.areaSqFt) || 1000,
        fundedLevel: 0,
      });
      setSubmitStatus('success');
      setHostForm({ ownerName: '', title: '', location: '', areaSqFt: '' });
      const res = await axios.get(`https://hult-26.onrender.com/api/properties`);
      setProperties(Array.isArray(res.data) ? res.data : properties);
    } catch (err) {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="app">
      <nav className="nav-bar">
        <button className="nav-brand" onClick={() => setView('home')}>
          <SunIcon /> Aureon
        </button>
        <div className="nav-links">
          <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>
            <HomeIcon /> Home
          </button>
          <button className={view === 'market' ? 'active' : ''} onClick={() => setView('market')}>
            <SunIcon /> Market
          </button>
          <button className={view === 'host' ? 'active' : ''} onClick={() => setView('host')}>
            <WalletIcon /> Host
          </button>
          <button className={view === 'cart' ? 'active' : ''} onClick={() => setView('cart')}>
            <CartIcon /> Cart {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
        </div>
      </nav>

      <main className="main-content">
        {error && <div className="banner banner-warn">{error}</div>}

        {view === 'home' && (
          <section className="hero-section">
            <h1>Power the future. Own the sun.</h1>
            <p>Invest in solar projects or list your roof. Earn clean energy credits.</p>
            <div className="hero-cards">
              <div className="hero-card" onClick={() => setView('market')}>
                <div className="hero-card-icon">
                  <SunIcon />
                </div>
                <h2>Invest</h2>
                <p>Browse solar projects. Buy panels. Earn electricity credits with strong ROI.</p>
                <button className="btn-primary">Browse Projects</button>
              </div>
              <div className="hero-card" onClick={() => setView('host')}>
                <div className="hero-card-icon">
                  <WalletIcon />
                </div>
                <h2>Host</h2>
                <p>List your roof or land. Get solar installed for free. Earn from the sun.</p>
                <button className="btn-primary btn-outline">List Your Property</button>
              </div>
            </div>
          </section>
        )}

        {view === 'market' && (
          <section className="market-section">
            <h1>Solar Marketplace</h1>
            {loading ? (
              <div className="loading">Loading projects...</div>
            ) : (
              <div className="property-grid">
                {properties.map((p) => (
                  <div key={p.id} className="card property-card">
                    <div className="card-header">
                      <h3>{p.title}</h3>
                      <span className="location">{p.location}</span>
                    </div>
                    <div className="card-body">
                      <div className="stat-row">
                        <span>ROI</span>
                        <strong>{p.roi}%</strong>
                      </div>
                      <div className="stat-row">
                        <span>Price/panel</span>
                        <strong>${p.price}</strong>
                      </div>
                      <div className="stat-row">
                        <span>Capacity</span>
                        <strong>{p.capacity} kW</strong>
                      </div>
                      <div className="progress-wrap">
                        <span>Funding</span>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${p.fundedPercentage || 0}%` }} />
                        </div>
                        <span className="progress-text">{p.fundedPercentage || 0}%</span>
                      </div>
                    </div>
                    <button className="btn-primary btn-block" onClick={() => addToCart(p)}>
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {view === 'cart' && (
          <section className="cart-section">
            <h1>Your Cart</h1>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <CartIcon />
                <p>Your cart is empty</p>
                <button className="btn-primary" onClick={() => setView('market')}>
                  Browse Projects
                </button>
              </div>
            ) : (
              <>
                <div className="cart-list">
                  {cart.map((item) => (
                    <div key={item.id} className="card cart-item">
                      <div>
                        <h3>{item.title}</h3>
                        <span className="location">{item.location}</span>
                        <span className="qty">× {item.qty} @ ${item.price}/panel</span>
                      </div>
                      <div className="cart-item-right">
                        <span className="item-total">${(item.price * item.qty).toLocaleString()}</span>
                        <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-footer card">
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>${cartTotal.toLocaleString()}</strong>
                  </div>
                  <button className="btn-primary btn-large">Checkout (Simulation)</button>
                  <p className="checkout-note">This is a demo. No real payment will be processed.</p>
                </div>
              </>
            )}
          </section>
        )}

        {view === 'host' && (
          <section className="host-section">
            <h1>List Your Property</h1>
            <p className="host-subtitle">Add your roof or land to the solar marketplace.</p>
            <form className="host-form card" onSubmit={handleHostSubmit}>
              <div className="input-group">
                <label>Your Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                  value={hostForm.ownerName}
                  onChange={(e) => setHostForm({ ...hostForm, ownerName: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Project Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="My Solar Rooftop"
                  value={hostForm.title}
                  onChange={(e) => setHostForm({ ...hostForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Location</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Austin, TX"
                  value={hostForm.location}
                  onChange={(e) => setHostForm({ ...hostForm, location: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Area (sq ft)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="2500"
                  value={hostForm.areaSqFt}
                  onChange={(e) => setHostForm({ ...hostForm, areaSqFt: e.target.value })}
                  required
                  min="100"
                />
                <span className="input-hint">Capacity will be auto-calculated (area ÷ 100 kW)</span>
              </div>
              {submitStatus === 'success' && <div className="form-success">✓ Listing created successfully!</div>}
              {submitStatus === 'error' && <div className="form-error">Failed to create listing. Please try again.</div>}
              <button type="submit" className="btn-primary btn-block btn-large">
                Create Listing
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
