import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ArrowDown, ArrowRight, Clock3, Instagram, MapPin, Menu as MenuIcon, Phone, X } from 'lucide-react';

const fallbackMenu = [
  { name: 'Truffle Duck', description: 'Slow-roasted duck breast with a honey-truffle glaze and seasonal vegetables.', price: 1450, category: 'Chef’s signature', imageUrl: 'https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?auto=format&fit=crop&w=900&q=85', imageAlt: 'Elegant plated restaurant dish', isVegetarian: false },
  { name: 'Paneer Tikka', description: 'Charcoal-grilled paneer marinated with warming spices and a touch of cream.', price: 850, category: 'From the tandoor', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85', imageAlt: 'Indian curry served with fresh herbs', isVegetarian: true },
  { name: 'Awadhi Biryani', description: 'Fragrant basmati rice, slow-cooked dum style with a blend of Awadhi spices.', price: 1200, category: 'House favourite', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85', imageAlt: 'Traditional biryani with aromatic rice', isVegetarian: false }
];
const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function App() {
  const [menu, setMenu] = useState(fallbackMenu);
  const [menuState, setMenuState] = useState('loading');
  const [navOpen, setNavOpen] = useState(false);
  const [qr, setQr] = useState('');
  const [formState, setFormState] = useState('idle');

  useEffect(() => {
    fetch('/api/menu').then((response) => {
      if (!response.ok) throw new Error('Menu unavailable');
      return response.json();
    }).then((items) => { if (items.length) setMenu(items); setMenuState('ready'); })
      .catch(() => setMenuState('offline'));
    QRCode.toDataURL(`${window.location.origin}/#menu`, { width: 240, margin: 1, color: { dark: '#26251f', light: '#fffdf8' } }).then(setQr).catch(() => {});
  }, []);

  async function submitReservation(event) {
    event.preventDefault();
    setFormState('sending');
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    data.guests = Number(data.guests);
    try {
      const response = await fetch('/api/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'We could not send your request.');
      setFormState('sent');
      event.currentTarget.reset();
    } catch (error) { setFormState(error.message === 'Failed to fetch' ? 'offline' : error.message); }
  }

  const closeNav = () => setNavOpen(false);
  return <>
    <header className="site-header"><nav className="nav wrap" aria-label="Main navigation">
      <a className="brand" href="#home" onClick={closeNav}><span className="brand-mark">B</span><span>BALAJI<small>RESTAURANT · NAGPUR</small></span></a>
      <button className="menu-toggle" aria-label={navOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={navOpen} onClick={() => setNavOpen(!navOpen)}>{navOpen ? <X /> : <MenuIcon />}</button>
      <div className={`nav-links ${navOpen ? 'open' : ''}`}><a href="#menu" onClick={closeNav}>The menu</a><a href="#story" onClick={closeNav}>Our story</a><a href="#visit" onClick={closeNav}>Visit us</a><a className="nav-book" href="#reserve" onClick={closeNav}>Book a table <ArrowRight size={15} /></a></div>
    </nav></header>

    <main>
      <section className="hero" id="home"><div className="hero-image" /><div className="hero-content wrap"><p className="eyebrow"><span /> A TABLE WORTH GATHERING AROUND</p><h1>Rooted in India.<br /><em>Made to be savoured.</em></h1><p className="hero-copy">Honest ingredients, soulful cooking, and the warmth of a meal shared together. Welcome to Balaji.</p><div className="hero-actions"><a className="button button-dark" href="#menu">Explore our menu <ArrowRight size={17} /></a><a className="text-link" href="#story">A little about us <ArrowDown size={15} /></a></div><div className="hero-note"><span>01</span><i /> Good food. Good company. Always.</div></div><div className="hero-caption">WATHODA SQUARE · NAGPUR</div></section>

      <section className="intro wrap"><p className="eyebrow">A PLACE AT OUR TABLE</p><p className="intro-text">Food should feel like <em>coming home.</em> Around here, every plate begins with a little patience and a lot of heart.</p></section>

      <section className="menu-section" id="menu"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">FROM OUR KITCHEN</p><h2>Made with care.<br /><em>Served with joy.</em></h2></div><p className="section-aside">A few house favourites to get you started. Every dish is prepared fresh, with ingredients we believe in.</p></div>
        {menuState === 'offline' && <p className="api-note" role="status">Showing sample dishes while the local menu service is offline. Start MongoDB and the server to load your database menu.</p>}
        <div className="menu-grid">{menu.map((item) => <article className="dish" key={item._id || item.name}><div className="dish-image"><img src={item.imageUrl} alt={item.imageAlt || item.name} loading="lazy" onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85'; event.currentTarget.onerror = null; }} /><span className="dish-category">{item.category || 'From our kitchen'}</span>{item.isVegetarian && <span className="veg-mark" title="Vegetarian">V</span>}</div><div className="dish-details"><div><h3>{item.name}</h3><span className="dish-price">{money.format(item.price)}</span></div><p>{item.description}</p></div></article>)}</div>
        <div className="menu-foot"><span>{menuState === 'loading' ? 'Loading today’s menu…' : `${menu.length} dishes · thoughtfully prepared`}</span><a href="#reserve" className="text-link">Save me a seat <ArrowRight size={15} /></a></div>
      </div></section>

      <section className="story" id="story"><div className="story-photo" role="img" aria-label="A warm, candlelit restaurant table set for dinner" /><div className="story-content"><p className="eyebrow">THE BALAJI WAY</p><h2>Tradition at heart.<br /><em>Curiosity on the plate.</em></h2><p>We believe the best meals bring people closer. Our kitchen honours the flavours we grew up with and leaves room to discover something new—one shared plate at a time.</p><a href="#visit" className="text-link">Come see for yourself <ArrowRight size={15} /></a><span className="story-signature">With warmth, Balaji</span></div></section>

      <section className="reserve-section" id="reserve"><div className="wrap reserve-grid"><div className="reserve-copy"><p className="eyebrow">YOUR TABLE IS WAITING</p><h2>Make an evening<br /><em>of it.</em></h2><p>Planning a catch-up, a celebration, or just a very good dinner? Tell us when you’re coming and we’ll take it from there.</p><div className="hours-note"><Clock3 size={17} /><span>Tue–Sat, 12 pm–11 pm<br />Sun, 12 pm–10 pm · Monday closed</span></div></div><form className="reserve-form" onSubmit={submitReservation}><div className="form-row"><label>Your name<input name="name" required maxLength="100" placeholder="Name" /></label><label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label></div><div className="form-row"><label>Phone number<input name="phone" type="tel" required placeholder="Your number" /></label><label>Number of guests<select name="guests" defaultValue="2">{Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}</select></label></div><div className="form-row"><label>Date<input name="date" type="date" required min={new Date().toISOString().slice(0, 10)} /></label><label>Preferred time<input name="time" type="time" required /></label></div><label>A note for us <span className="optional">(optional)</span><textarea name="message" rows="2" maxLength="500" placeholder="A special occasion? Any requests?" /></label><button className="button button-dark submit-button" disabled={formState === 'sending'}>{formState === 'sending' ? 'Sending…' : 'Request a table'} <ArrowRight size={16} /></button>{formState === 'sent' && <p className="form-message success" role="status">Your request is on its way. We’ll be in touch to confirm.</p>}{typeof formState === 'string' && ['offline'].includes(formState) && <p className="form-message error" role="alert">Couldn’t reach the reservation service. Please call us to book.</p>}{formState !== 'idle' && formState !== 'sent' && formState !== 'sending' && formState !== 'offline' && <p className="form-message error" role="alert">{formState}</p>}</form></div></section>

      <section className="visit-section" id="visit"><div className="wrap visit-grid"><div><p className="eyebrow">FIND YOUR WAY HERE</p><h2>There’s always<br /><em>room for one more.</em></h2><p>Drop by for a long lunch or linger into the evening. We’ll keep a seat warm.</p><a className="button button-light" href="https://maps.google.com/?q=Wathoda+Square+Nagpur" target="_blank" rel="noreferrer">Find us on the map <ArrowRight size={16} /></a></div><div className="visit-details"><div><MapPin /><p><strong>Wathoda Square</strong><br />Nagpur, Maharashtra, India</p></div><div><Phone /><p><strong>Give us a call</strong><br /><a href="tel:+910000000000">+91 00000 00000</a><small>Update this number with the restaurant’s contact.</small></p></div><div><Clock3 /><p><strong>Opening hours</strong><br />Tue–Sat 12 pm–11 pm · Sun 12 pm–10 pm<br />Monday closed</p></div></div></div></section>

      <section className="qr-section"><div><p className="eyebrow">TAKE A LOOK</p><h2>The menu, <em>at your fingertips.</em></h2><p>Scan it next time you’re here—or send it to someone you’d like to bring along.</p></div>{qr && <img className="qr-code" src={qr} alt="QR code linking to the menu section" />}</section>
    </main>

    <footer className="footer"><div className="wrap footer-top"><a className="brand footer-brand" href="#home"><span className="brand-mark">B</span><span>BALAJI<small>RESTAURANT · NAGPUR</small></span></a><span>Made for the moments around the table.</span><a href="https://instagram.com" aria-label="Instagram" className="social-link"><Instagram size={19} /></a></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Balaji Restaurant</span><span>Wathoda Square · Nagpur</span></div></footer>
  </>;
}

export default App;
