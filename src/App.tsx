import { FormEvent, useEffect, useRef, useState } from "react";

type Wish = { id: number; name: string; message: string; date: string };
type Announcement = { id: number; title: string; description: string; date: string; published: boolean };
type Photo = { id: number; src: string; category: string; title: string; date: string };
type WeddingEvent = { id: number; name: string; date: string; time: string; venue: string; address: string; dressCode: string; description: string };
type Settings = {
  bride: string;
  groom: string;
  weddingDate: string;
  heading: string;
  description: string;
  countdown: boolean;
  music: boolean;
  primary: string;
  secondary: string;
  background: string;
  font: string;
  buttonStyle: string;
  heroImage: string;
  brideContact: string;
  groomContact: string;
  familyContact: string;
  coordinatorContact: string;
  instagram: string;
  musicUrl: string;
};

const categories = ["All", "Pre-Wedding", "Engagement", "Haldi", "Mehendi", "Sangeet", "Wedding", "Reception", "Family"];
const hero = "https://images.unsplash.com/photo-1735052712464-9d24b69be5f5?auto=format&fit=crop&w=1800&q=88";
const venueImage = "https://images.unsplash.com/photo-1575994532957-773da2f83eb1?auto=format&fit=crop&w=1400&q=85";
const initialPhotos: Photo[] = [
  { id: 1, src: hero, category: "Pre-Wedding", title: "Into forever", date: "12 Feb 2026" },
  { id: 2, src: "https://images.unsplash.com/photo-1665960213530-3fb10da1f25e?auto=format&fit=crop&w=1000&q=85", category: "Engagement", title: "A promise made", date: "14 Feb 2026" },
  { id: 3, src: "https://images.unsplash.com/photo-1781154110149-cc5f526e1a22?auto=format&fit=crop&w=900&q=85", category: "Haldi", title: "Sunshine & laughter", date: "18 Nov 2026" },
  { id: 4, src: "https://images.unsplash.com/photo-1730003727902-3643640a3d43?auto=format&fit=crop&w=1000&q=85", category: "Mehendi", title: "Written in henna", date: "19 Nov 2026" },
  { id: 5, src: "https://images.unsplash.com/photo-1630526720753-aa4e71acf67d?auto=format&fit=crop&w=1000&q=85", category: "Wedding", title: "Sacred vows", date: "21 Nov 2026" },
  { id: 6, src: "https://images.unsplash.com/photo-1722952934661-dde241aeb591?auto=format&fit=crop&w=1000&q=85", category: "Reception", title: "Our beginning", date: "22 Nov 2026" },
  { id: 7, src: "https://images.unsplash.com/photo-1633104502699-b2ecf0fee294?auto=format&fit=crop&w=1000&q=85", category: "Family", title: "Together, always", date: "22 Nov 2026" },
  { id: 8, src: "https://images.unsplash.com/photo-1665960213508-48f07086d49c?auto=format&fit=crop&w=1000&q=85", category: "Sangeet", title: "An evening of joy", date: "20 Nov 2026" },
];
const initialWishes: Wish[] = [
  { id: 1, name: "Ananya & Rohan", message: "May every chapter you write together be more beautiful than the last. All our love, always.", date: "May 12, 2026" },
  { id: 2, name: "Nani", message: "Two wonderful souls, one beautiful journey. May your home always be full of laughter and light.", date: "May 10, 2026" },
  { id: 3, name: "Kabir Mehta", message: "Here’s to a lifetime of small moments, grand adventures, and choosing each other every day.", date: "May 08, 2026" },
];
const initialAnnouncements: Announcement[] = [
  { id: 1, title: "A little update", description: "The Sangeet begins at 7:30 PM. Come ready to dance under the stars.", date: "20 Nov · 7:30 PM", published: true },
];
const initialSettings: Settings = {
  bride: "Aanya",
  groom: "Veer",
  weddingDate: "2026-11-21T17:30",
  heading: "Together, with our families",
  description: "We invite you to celebrate a weekend of love, laughter, and new beginnings in the city of lakes.",
  countdown: true,
  music: false,
  primary: "#9a7850",
  secondary: "#eee2dd",
  background: "#f7f3ed",
  font: "Italiana",
  buttonStyle: "rounded",
  heroImage: hero,
  brideContact: "Aanya · +91 98765 43210",
  groomContact: "Veer · +91 98765 43211",
  familyContact: "Meera Mehta · +91 98765 43212",
  coordinatorContact: "Rhea · hello@aanyaveer.com",
  instagram: "https://instagram.com",
  musicUrl: "",
};

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return initial;
      const parsed = JSON.parse(saved);
      if (parsed && initial && typeof parsed === "object" && typeof initial === "object" && !Array.isArray(parsed) && !Array.isArray(initial)) {
        return { ...initial, ...parsed };
      }
      return parsed;
    } catch {
      return initial;
    }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue] as const;
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6" /></>,
    edit: <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" /><path d="m14 7 3 3" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    logout: <><path d="M10 17l5-5-5-5m5 5H3m10-9h7v18h-7" /></>,
    upload: <><path d="M12 16V4m-4 4 4-4 4 4M5 20h14" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    music: <><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.heart}</svg>;
}

function Button({ children, variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" }) {
  return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>;
}
function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="field" {...props} />;
}
function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="field textarea" {...props} />;
}

const initialEvents: WeddingEvent[] = [
  { id: 1, name: "Engagement", date: "Thursday, 19 November", time: "5:00 PM", venue: "The Courtyard", address: "City Palace Road, Udaipur", dressCode: "Pastels & florals", description: "An intimate exchange of rings followed by high tea." },
  { id: 2, name: "Haldi", date: "Friday, 20 November", time: "10:00 AM", venue: "The Zenana Garden", address: "City Palace Road, Udaipur", dressCode: "Sunshine yellow", description: "A morning of turmeric, marigolds, music, and mischief." },
  { id: 3, name: "Mehendi", date: "Friday, 20 November", time: "2:00 PM", venue: "Poolside Pavilion", address: "City Palace Road, Udaipur", dressCode: "Indian festive", description: "Henna artists, folk songs, and a leisurely garden lunch." },
  { id: 4, name: "Sangeet", date: "Friday, 20 November", time: "7:30 PM", venue: "The Grand Ballroom", address: "City Palace Road, Udaipur", dressCode: "Evening glamour", description: "Join both families for stories, performances, and dancing." },
  { id: 5, name: "Wedding", date: "Saturday, 21 November", time: "5:30 PM", venue: "Lakeview Lawns", address: "City Palace Road, Udaipur", dressCode: "Indian formal", description: "The ceremony begins at sunset beneath the flowering mandap." },
  { id: 6, name: "Reception", date: "Sunday, 22 November", time: "7:00 PM", venue: "The Durbar Hall", address: "City Palace Road, Udaipur", dressCode: "Black tie / formal", description: "Dinner, toasts, and a celebration of our new beginning." },
];
const story = [
  ["2019", "A chance hello", "A mutual friend, a rainy evening in Mumbai, and a conversation that neither of us wanted to end.", initialPhotos[7].src],
  ["2020", "Our first adventure", "A spontaneous road trip to the coast taught us that the best plans are the ones made together.", initialPhotos[1].src],
  ["2024", "The easiest yes", "On a quiet terrace filled with jasmine and candlelight, Veer asked and Aanya said yes.", initialPhotos[0].src],
  ["2026", "Our forever begins", "Surrounded by the people we love most, we begin the next chapter of our story.", initialPhotos[4].src],
];

function SectionHead({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="section-head reveal"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}<div className="flourish"><i /><b>◇</b><i /></div></div>;
}

function Countdown({ date }: { date: string }) {
  const calculate = () => {
    const diff = Math.max(0, new Date(date).getTime() - Date.now());
    return { Days: Math.floor(diff / 86400000), Hours: Math.floor(diff / 3600000) % 24, Minutes: Math.floor(diff / 60000) % 60, Seconds: Math.floor(diff / 1000) % 60 };
  };
  const [time, setTime] = useState(calculate);
  useEffect(() => { const id = setInterval(() => setTime(calculate()), 1000); return () => clearInterval(id); }, [date]);
  return <div className="countdown">{Object.entries(time).map(([label, value]) => <div key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>;
}

function GuestSite({ photos, setPhotos, wishes, setWishes, announcements, settings, events, goAdmin }: {
  photos: Photo[]; setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>; wishes: Wish[]; setWishes: React.Dispatch<React.SetStateAction<Wish[]>>;
  announcements: Announcement[]; settings: Settings; events: WeddingEvent[]; goAdmin: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [music, setMusic] = useState(settings.music);
  const audioRef = useRef<HTMLAudioElement>(null);
  const galleryCategories = ["All", ...Array.from(new Set([...categories.slice(1), ...photos.map((photo) => photo.category)]))];
  const shownPhotos = filter === "All" ? photos : photos.filter((p) => p.category === filter);
  const toggleMusic = () => {
    const next = !music;
    setMusic(next);
    if (next) audioRef.current?.play().catch(() => setMusic(false));
    else audioRef.current?.pause();
  };
  const submitWish = (e: FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMessage.trim()) return;
    setWishes((old) => [{ id: Date.now(), name: wishName, message: wishMessage, date: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }) }, ...old]);
    setWishName(""); setWishMessage(""); setSent(true); setTimeout(() => setSent(false), 3500);
  };
  useEffect(() => {
    const observer = new IntersectionObserver((items) => items.forEach((i) => i.isIntersecting && i.target.classList.add("visible")), { threshold: .1 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <main className={`guest font-${settings.font.toLowerCase().replace(" ", "-")} buttons-${settings.buttonStyle}`} style={{ "--accent": settings.primary, "--rose": settings.secondary, "--ivory": settings.background } as React.CSSProperties}>
    <audio ref={audioRef} src={settings.musicUrl} loop />
    <header className="nav">
      <a className="monogram" href="#home">A <span>·</span> V</a>
      <nav className={menu ? "nav-links open" : "nav-links"}>
        {["Home", "Our Story", "Events", "Venue", "Gallery", "Travel", "Wishes", "Contact"].map((item) => <a key={item} href={`#${item.toLowerCase().replace("our ", "").replace(" ", "-")}`} onClick={() => setMenu(false)}>{item}</a>)}
      </nav>
      <div className="nav-actions">
        <Button variant="ghost" className="icon-btn" aria-label="Toggle music" onClick={toggleMusic}><Icon name="music" /><span className={music ? "sound on" : "sound"} /></Button>
        <Button variant="ghost" className="menu-btn" aria-label="Open menu" onClick={() => setMenu(!menu)}><Icon name={menu ? "close" : "menu"} size={22} /></Button>
      </div>
    </header>

    <section id="home" className="hero">
      <img src={settings.heroImage || hero} alt={`${settings.bride} and ${settings.groom} walking together`} />
      <div className="hero-overlay" />
      <div className="botanical botanical-left">❧</div><div className="botanical botanical-right">❧</div>
      <div className="hero-content">
        <span className="hero-kicker">{settings.heading}</span>
        <h1><span>{settings.bride}</span><i>&</i><span>{settings.groom}</span></h1>
        <p className="hero-date">21 · 11 · 2026&nbsp;&nbsp; | &nbsp;&nbsp;Udaipur, India</p>
        <div className="hero-line" />
        <p className="hero-copy">{settings.description}</p>
        {settings.countdown && <Countdown date={settings.weddingDate} />}
      </div>
      <a className="scroll-cue" href="#story"><span>Discover our story</span><i /></a>
    </section>

    {announcements.filter((a) => a.published).map((a) => <section className="announcement" key={a.id}><span>With love, a note for our guests</span><strong>{a.title}</strong><p>{a.description}</p><small>{a.date}</small></section>)}

    <section id="story" className="section story-section">
      <SectionHead eyebrow="How it all began" title="Our story, so far" copy="Some stories are written in the stars. Ours began with rain, coffee, and a perfectly timed hello." />
      <div className="timeline">
        <div className="timeline-line" />
        {story.map((item, index) => <article className={`story-card reveal ${index % 2 ? "reverse" : ""}`} key={item[0]}>
          <div className="story-image"><img src={item[3]} alt={item[1]} /></div>
          <span className="story-dot">{index + 1}</span>
          <div className="story-copy"><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></div>
        </article>)}
      </div>
    </section>

    <section id="events" className="section events-section">
      <SectionHead eyebrow="The celebrations" title="A weekend to remember" copy="Every gathering is a new memory waiting to be made. We would be honoured to celebrate each one with you." />
      <div className="event-grid">
        {events.map((event, index) => <article className="event-card reveal" key={event.id}>
          <span className="event-no">0{index + 1}</span><div className="event-ornament">✦</div><h3>{event.name}</h3>
          <p className="event-date">{event.date}<br /><strong>{event.time}</strong></p>
          <div className="rule" /><p>{event.description}</p>
          <dl><div><dt>Venue</dt><dd>{event.venue}</dd></div><div><dt>Dress code</dt><dd>{event.dressCode}</dd></div></dl>
          <a className="text-link" href="#venue"><Icon name="pin" size={16} /> {event.address}</a>
        </article>)}
      </div>
    </section>

    <section id="venue" className="venue-section">
      <div className="venue-image"><img src={venueImage} alt="The Oberoi Udaivilas, Udaipur" /><span>A palace by the lake</span></div>
      <div className="venue-copy reveal"><span className="eyebrow">The destination</span><h2>The Oberoi Udaivilas</h2><p className="lead">Haridasji Ki Magri, Mulla Talai<br />Udaipur, Rajasthan 313001</p><p>Set against the serene waters of Lake Pichola, our celebration unfolds amid sunlit courtyards, domed pavilions, and gardens fragrant with jasmine.</p>
        <div className="venue-meta"><div><b>Parking</b><span>Complimentary valet parking is available</span></div><div><b>Nearby landmark</b><span>8 minutes from City Palace by boat</span></div></div>
        <a className="btn btn-primary" href="https://maps.google.com/?q=Oberoi+Udaivilas" target="_blank" rel="noreferrer">Get directions <Icon name="arrow" /></a>
      </div>
      <div className="map-card"><div className="map-grid" /><span className="map-pin"><Icon name="pin" size={24} /></span><b>Lake Pichola</b><small>Udaipur · Rajasthan</small></div>
    </section>

    <section id="gallery" className="section gallery-section">
      <SectionHead eyebrow="A few favourite moments" title="Our gallery" copy="The little glances, grand gestures, and every beautiful moment in between." />
      <div className="filters">{galleryCategories.map((c) => <Button key={c} variant="ghost" className={filter === c ? "active" : ""} onClick={() => setFilter(c)}>{c}</Button>)}</div>
      <div className="masonry">{shownPhotos.map((photo, index) => <button className={`gallery-item ${index % 5 === 0 ? "tall" : ""}`} key={photo.id} onClick={() => setLightbox(photo)}><img src={photo.src} alt={photo.title} /><span><small>{photo.category}</small><b>{photo.title}</b></span></button>)}</div>
      {shownPhotos.length === 0 && <div className="empty">New moments from this celebration will appear here soon.</div>}
    </section>

    <section id="travel" className="section travel-section">
      <SectionHead eyebrow="Plan your stay" title="Stay & travel" copy="Everything you need for a relaxed weekend in the city of lakes." />
      <div className="travel-grid">
        <article className="hotel-feature"><img src="https://images.unsplash.com/photo-1573363059771-8b2b53b492ff?auto=format&fit=crop&w=1000&q=85" alt="Luxury hotel in Udaipur" /><div><span>Preferred stay</span><h3>Trident Udaipur</h3><p>Special wedding rates, breakfast, and scheduled shuttles to all celebrations.</p><a href="#contact" className="text-link">Request booking details <Icon name="arrow" /></a></div></article>
        {[["By air", "Maharana Pratap Airport", "35 km · Approx. 45 minutes. Pre-booked cars are available at arrivals."], ["By rail", "Udaipur City Station", "7 km · Approx. 20 minutes. Taxi and hotel transfers are readily available."], ["Getting around", "Celebration shuttles", "Shuttles depart from partner hotels 45 minutes before each event."], ["Good to know", "November in Udaipur", "Warm afternoons and cool evenings. A light layer is recommended after sunset."]].map((x) => <article className="travel-card reveal" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}
      </div>
    </section>

    <section id="wishes" className="wishes-section">
      <div className="section wishes-head"><SectionHead eyebrow="Notes from our people" title="With love, from you" /></div>
      <div className="wish-carousel">{wishes.slice(0, 6).map((wish) => <article className="wish-card" key={wish.id}><Icon name="heart" size={22} /><blockquote>“{wish.message}”</blockquote><div><span>{wish.name}</span><small>{wish.date}</small></div></article>)}</div>
      <form className="wish-form" onSubmit={submitWish}>
        <span className="eyebrow">Leave us a little love</span><h3>Write a wish</h3>
        <label>Your name<Field value={wishName} onChange={(e) => setWishName(e.target.value)} placeholder="How should we remember you?" required /></label>
        <label>Your message<TextArea value={wishMessage} onChange={(e) => setWishMessage(e.target.value)} placeholder="Share a memory, blessing, or a few kind words..." required rows={4} /></label>
        <Button type="submit">{sent ? "Your wish is now part of our story" : "Send your wish"} <Icon name="arrow" /></Button>
        <small>Your message will appear here instantly.</small>
      </form>
    </section>

    <footer id="contact" className="footer">
      <div className="footer-mark">A <i>&</i> V</div><p>We cannot wait to celebrate with you.</p>
      <div className="footer-contacts"><div><span>Bride</span><b>{settings.brideContact}</b></div><div><span>Groom</span><b>{settings.groomContact}</b></div><div><span>Family</span><b>{settings.familyContact}</b></div><div><span>Wedding concierge</span><b>{settings.coordinatorContact}</b></div></div>
      <div className="socials"><a href={settings.instagram} target="_blank" rel="noreferrer">Instagram</a><i>·</i><a href="#contact">Pinterest</a><i>·</i><a href="mailto:hello@aanyaveer.com">Email</a></div>
      <small>Made with love for Aanya & Veer · 2026</small>
      <button className="admin-entry" onClick={goAdmin}>Private admin access</button>
    </footer>
    {lightbox && <div className="lightbox" role="dialog" aria-modal="true"><Button variant="ghost" className="lightbox-close" onClick={() => setLightbox(null)}><Icon name="close" size={26} /></Button><img src={lightbox.src} alt={lightbox.title} /><div><span>{lightbox.category}</span><h3>{lightbox.title}</h3></div></div>}
  </main>;
}

const adminItems = [
  ["Dashboard", "DB"], ["Gallery Management", "GM"], ["Wishes Management", "WM"], ["Announcements", "AN"], ["Website Settings", "WS"], ["Admin Security", "AS"],
];

function AdminLogin({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [show, setShow] = useState(false);
  const [forgot, setForgot] = useState(false);
  return <main className="login-page">
    <div className="login-visual"><img src={hero} alt="" /><div><span>A <i>&</i> V</span><p>Wedding administration suite</p></div></div>
    <div className="login-panel"><button className="back-link" onClick={onBack}>← Back to celebration</button><form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
      <span className="login-mark">A · V</span><small>Private administration</small><h1>{forgot ? "Reset your password" : "Welcome back"}</h1><p>{forgot ? "Enter your admin email and we’ll send secure reset instructions." : "Sign in to thoughtfully manage every detail of the celebration."}</p>
      <label>Email address<Field type="email" placeholder="admin@aanyaveer.com" required /></label>
      {!forgot && <label>Password<div className="password-field"><Field type={show ? "text" : "password"} placeholder="Enter your password" required /><button type="button" onClick={() => setShow(!show)} aria-label="Show password"><Icon name="eye" /></button></div></label>}
      {!forgot && <div className="form-row"><label className="checkbox"><input type="checkbox" /> Keep me signed in</label><button type="button" onClick={() => setForgot(true)}>Forgot password?</button></div>}
      <Button type="submit">{forgot ? "Send reset link" : "Sign in securely"} <Icon name={forgot ? "arrow" : "lock"} /></Button>
      {forgot && <button type="button" className="return-login" onClick={() => setForgot(false)}>Return to sign in</button>}
      <div className="secure-note"><Icon name="lock" size={15} /> Protected administrative area · Session encrypted</div>
    </form></div>
  </main>;
}

function AdminDashboard({ photos, wishes, announcements, onNavigate }: { photos: Photo[]; wishes: Wish[]; announcements: Announcement[]; onNavigate: (page: string) => void }) {
  const stats = [["Total photos", photos.length, "+8 this month"], ["Total wishes", wishes.length, "+12 this week"], ["Active announcements", announcements.filter((x) => x.published).length, "Published"], ["Website status", "Live", "All systems normal"]];
  return <><AdminHeader eyebrow="Overview" title="Good morning, Aanya" copy="Here’s what is happening with your wedding website today." />
    <div className="stats">{stats.map((s, i) => <article key={s[0]}><div className={`stat-icon s${i}`}>{["P", "W", "A", "L"][i]}</div><span>{s[0]}</span><strong>{s[1]}</strong><small>{s[2]}</small></article>)}</div>
    <div className="dashboard-grid"><section className="admin-card activity"><div className="card-head"><div><h3>Website activity</h3><p>Visits and engagement over the past 7 days</p></div><span>Last 7 days⌄</span></div><div className="chart"><div className="chart-labels"><span>600</span><span>400</span><span>200</span><span>0</span></div><svg viewBox="0 0 700 220" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a4865f" stopOpacity=".24" /><stop offset="1" stopColor="#a4865f" stopOpacity="0" /></linearGradient></defs><path className="chart-area" d="M0 180 C60 150 90 165 145 125 S240 150 290 105 380 128 435 72 525 110 575 55 650 75 700 35 L700 220 L0 220Z" /><path className="chart-line" d="M0 180 C60 150 90 165 145 125 S240 150 290 105 380 128 435 72 525 110 575 55 650 75 700 35" /></svg><div className="chart-days">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(x => <span key={x}>{x}</span>)}</div></div></section>
      <section className="admin-card quick"><div className="card-head"><div><h3>Quick actions</h3><p>Common tasks</p></div></div>{[["Upload new photos", "Add moments to your gallery", "upload", "Gallery Management"], ["Create announcement", "Share an update with guests", "plus", "Announcements"], ["Update website details", "Edit date, names, or styles", "edit", "Website Settings"]].map(x => <button key={x[0]} onClick={() => onNavigate(x[3])}><i><Icon name={x[2]} /></i><span><b>{x[0]}</b><small>{x[1]}</small></span><Icon name="chevron" /></button>)}</section></div>
    <div className="dashboard-grid thirds"><Recent title="Recent wishes" action="View all" onAction={() => onNavigate("Wishes Management")} items={wishes.slice(0, 3).map(w => [w.name, w.message, w.date])} />
      <section className="admin-card recent"><div className="card-head"><div><h3>Recent photos</h3><p>Latest gallery additions</p></div><button onClick={() => onNavigate("Gallery Management")}>View all</button></div><div className="recent-photos">{photos.slice(0, 4).map(p => <img key={p.id} src={p.src} alt={p.title} />)}</div></section>
      <Recent title="Announcements" action="Manage" onAction={() => onNavigate("Announcements")} items={announcements.slice(0, 3).map(a => [a.title, a.description, a.published ? "Published" : "Draft"])} /></div>
  </>;
}

function AdminHeader({ eyebrow, title, copy, children }: { eyebrow: string; title: string; copy: string; children?: React.ReactNode }) {
  return <header className="admin-header"><div><span>{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>{children}</header>;
}
function Recent({ title, action, items, onAction }: { title: string; action: string; items: string[][]; onAction: () => void }) {
  return <section className="admin-card recent"><div className="card-head"><div><h3>{title}</h3><p>Latest updates</p></div><button onClick={onAction}>{action}</button></div>{items.map((x, i) => <article key={i}><div className="avatar">{x[0][0]}</div><div><b>{x[0]}</b><p>{x[1]}</p><small>{x[2]}</small></div></article>)}</section>;
}

function GalleryAdmin({ photos, setPhotos }: { photos: Photo[]; setPhotos: React.Dispatch<React.SetStateAction<Photo[]>> }) {
  const [filter, setFilter] = useState("All");
  const [upload, setUpload] = useState(false);
  const [manageAlbums, setManageAlbums] = useState(false);
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Pre-Wedding");
  const [albums, setAlbums] = useStored<string[]>("av-albums", categories.slice(1));
  const [newAlbum, setNewAlbum] = useState("");
  const shown = photos.filter(photo => (filter === "All" || photo.category === filter) && `${photo.title} ${photo.category}`.toLowerCase().includes(query.toLowerCase()));
  const move = (id: number, direction: -1 | 1) => setPhotos(old => {
    const index = old.findIndex(photo => photo.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= old.length) return old;
    const next = [...old];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });
  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    [...files].forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setPhotos(old => [{ id: Date.now() + Math.random(), src: String(reader.result), category, title: file.name.replace(/\.[^.]+$/, ""), date: new Date().toLocaleDateString() }, ...old]);
      reader.readAsDataURL(file);
    });
    setUpload(false);
  };
  const saveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (editPhoto) setPhotos(old => old.map(photo => photo.id === editPhoto.id ? editPhoto : photo));
    setEditPhoto(null);
  };
  const addAlbum = (e: FormEvent) => {
    e.preventDefault();
    const name = newAlbum.trim();
    if (name && !albums.includes(name)) setAlbums(old => [...old, name]);
    setNewAlbum("");
  };
  return <><AdminHeader eyebrow="Content" title="Gallery management" copy="Curate albums and keep your favourite moments beautifully organized."><div className="header-actions"><Button variant="outline" onClick={() => setManageAlbums(true)}>Manage albums</Button><Button onClick={() => setUpload(true)}><Icon name="upload" /> Upload photos</Button></div></AdminHeader>
    <div className="admin-toolbar"><div className="searchbox"><Icon name="search" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search photos..." /></div><select value={filter} onChange={e => setFilter(e.target.value)}><option>All</option>{albums.map(c => <option key={c}>{c}</option>)}</select><span>{shown.length} photos</span></div>
    <div className="admin-photo-grid">{shown.map(p => <article key={p.id}><div><img src={p.src} alt={p.title} /><span>{p.category}</span><div className="photo-actions"><Button variant="ghost" title="Move earlier" onClick={() => move(p.id, -1)}>‹</Button><Button variant="ghost" title="Move later" onClick={() => move(p.id, 1)}>›</Button><Button variant="ghost" title="Edit photo" onClick={() => setEditPhoto(p)}><Icon name="edit" /></Button><Button variant="ghost" title="Delete photo" onClick={() => setPhotos(old => old.filter(x => x.id !== p.id))}><Icon name="trash" /></Button></div></div><h3>{p.title}</h3><p>Uploaded {p.date}</p></article>)}</div>
    {shown.length === 0 && <div className="admin-empty"><Icon name="upload" size={30} /><h3>No photos in this album</h3><p>Upload a few moments to bring this collection to life.</p><Button onClick={() => setUpload(true)}>Upload photos</Button></div>}
    {upload && <div className="modal"><form className="modal-card"><Button type="button" variant="ghost" className="modal-close" onClick={() => setUpload(false)}><Icon name="close" /></Button><span>Gallery</span><h2>Upload new photos</h2><p>Choose an album and add one or more high-resolution images.</p><label>Album<select value={category} onChange={e => setCategory(e.target.value)}>{albums.map(c => <option key={c}>{c}</option>)}</select></label><label className="dropzone"><Icon name="upload" size={28} /><b>Choose photos to upload</b><small>JPG, PNG or WEBP</small><input type="file" accept="image/*" multiple onChange={e => addFiles(e.target.files)} /></label></form></div>}
    {editPhoto && <div className="modal"><form className="modal-card" onSubmit={saveEdit}><Button type="button" variant="ghost" className="modal-close" onClick={() => setEditPhoto(null)}><Icon name="close" /></Button><span>Photo details</span><h2>Edit photo</h2><label>Title<Field value={editPhoto.title} onChange={e => setEditPhoto({ ...editPhoto, title: e.target.value })} required /></label><label>Album<select value={editPhoto.category} onChange={e => setEditPhoto({ ...editPhoto, category: e.target.value })}>{albums.map(album => <option key={album}>{album}</option>)}</select></label><Button type="submit">Save changes</Button></form></div>}
    {manageAlbums && <div className="modal"><div className="modal-card"><Button variant="ghost" className="modal-close" onClick={() => setManageAlbums(false)}><Icon name="close" /></Button><span>Organization</span><h2>Manage albums</h2><form className="album-create" onSubmit={addAlbum}><Field value={newAlbum} onChange={e => setNewAlbum(e.target.value)} placeholder="New album name" /><Button type="submit"><Icon name="plus" /> Add</Button></form><div className="album-list">{albums.map(album => <div key={album}><span>{album}<small>{photos.filter(photo => photo.category === album).length} photos</small></span><Button variant="ghost" disabled={photos.some(photo => photo.category === album)} onClick={() => setAlbums(old => old.filter(item => item !== album))}><Icon name="trash" /></Button></div>)}</div><p className="modal-hint">Albums containing photos cannot be deleted.</p></div></div>}</>;
}

function WishesAdmin({ wishes, setWishes }: { wishes: Wish[]; setWishes: React.Dispatch<React.SetStateAction<Wish[]>> }) {
  const [query, setQuery] = useState("");
  const shown = wishes.filter(w => `${w.name} ${w.message}`.toLowerCase().includes(query.toLowerCase()));
  return <><AdminHeader eyebrow="Community" title="Wishes management" copy="Every message appears on your public website instantly. You can view or remove wishes here." />
    <div className="admin-toolbar"><div className="searchbox"><Icon name="search" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by guest or message..." /></div><span>{shown.length} wishes</span></div>
    <section className="admin-card table-card"><table><thead><tr><th>Guest</th><th>Message</th><th>Submitted</th><th /></tr></thead><tbody>{shown.map(w => <tr key={w.id}><td><div className="guest-cell"><span>{w.name[0]}</span><b>{w.name}</b></div></td><td>{w.message}</td><td>{w.date}<small> · 10:42 AM</small></td><td><Button variant="ghost" onClick={() => setWishes(old => old.filter(x => x.id !== w.id))}><Icon name="trash" /></Button></td></tr>)}</tbody></table></section></>;
}

function AnnouncementsAdmin({ items, setItems }: { items: Announcement[]; setItems: React.Dispatch<React.SetStateAction<Announcement[]>> }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [title, setTitle] = useState(""); const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const startCreate = () => { setEditing(null); setTitle(""); setDescription(""); setScheduledAt(""); setOpen(true); };
  const startEdit = (item: Announcement) => { setEditing(item.id); setTitle(item.title); setDescription(item.description); setScheduledAt(""); setOpen(true); };
  const submit = (e: FormEvent) => { e.preventDefault(); const date = scheduledAt ? new Date(scheduledAt).toLocaleString() : new Date().toLocaleString(); setItems(old => editing ? old.map(item => item.id === editing ? { ...item, title, description, date: scheduledAt ? date : item.date } : item) : [{ id: Date.now(), title, description, date, published: true }, ...old]); setOpen(false); setTitle(""); setDescription(""); };
  return <><AdminHeader eyebrow="Updates" title="Announcements" copy="Share timely notes and important updates directly with your guests."><Button onClick={startCreate}><Icon name="plus" /> New announcement</Button></AdminHeader>
    <div className="announcement-list">{items.map(a => <article className="admin-card" key={a.id}><div className="announce-status"><span className={a.published ? "published" : ""}>{a.published ? "Published" : "Draft"}</span><small>{a.date}</small></div><h3>{a.title}</h3><p>{a.description}</p><div className="announce-actions"><label className="switch"><input type="checkbox" checked={a.published} onChange={() => setItems(old => old.map(x => x.id === a.id ? { ...x, published: !x.published } : x))} /><i /></label><span>{a.published ? "Visible on website" : "Hidden from website"}</span><Button variant="ghost" onClick={() => startEdit(a)}><Icon name="edit" /></Button><Button variant="ghost" onClick={() => setItems(old => old.filter(x => x.id !== a.id))}><Icon name="trash" /></Button></div></article>)}</div>
    {open && <div className="modal"><form className="modal-card" onSubmit={submit}><Button type="button" variant="ghost" className="modal-close" onClick={() => setOpen(false)}><Icon name="close" /></Button><span>Guest update</span><h2>{editing ? "Edit announcement" : "Create announcement"}</h2><label>Title<Field value={title} onChange={e => setTitle(e.target.value)} placeholder="A little update" required /></label><label>Description<TextArea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Share the details..." required /></label><label>Date & time<Field type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} /></label><Button type="submit">{editing ? "Save changes" : "Publish announcement"}</Button></form></div>}</>;
}

function SettingsAdmin({ settings: savedSettings, setSettings, events, setEvents, onPreview }: { settings: Settings; setSettings: React.Dispatch<React.SetStateAction<Settings>>; events: WeddingEvent[]; setEvents: React.Dispatch<React.SetStateAction<WeddingEvent[]>>; onPreview: () => void }) {
  const [settings, setDraft] = useState(savedSettings);
  const [eventDrafts, setEventDrafts] = useState(events);
  const [deletingEvent, setDeletingEvent] = useState<WeddingEvent | null>(null);
  const [dirty, setDirty] = useState(false);
  const update = (key: keyof Settings, value: string | boolean) => {
    setDraft(current => ({ ...current, [key]: value }));
    setDirty(true);
  };
  const [saved, setSaved] = useState(false);
  const save = () => {
    setSettings({ ...settings });
    setEvents(eventDrafts);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const preview = () => {
    if (dirty) {
      setSettings({ ...settings });
      setEvents(eventDrafts);
    }
    onPreview();
  };
  const updateEvent = (id: number, key: keyof WeddingEvent, value: string) => {
    setEventDrafts(current => current.map(event => event.id === id ? { ...event, [key]: value } : event));
    setDirty(true);
  };
  const deleteEvent = () => {
    if (!deletingEvent) return;
    setEventDrafts(current => current.filter(event => event.id !== deletingEvent.id));
    setDeletingEvent(null);
    setDirty(true);
  };
  const addEvent = () => {
    const nextNumber = eventDrafts.length + 1;
    setEventDrafts(current => [...current, {
      id: Date.now(),
      name: `New Event ${nextNumber}`,
      date: "Add event date",
      time: "Add event time",
      venue: "Add venue",
      address: "Add venue address",
      dressCode: "Add dress code",
      description: "Add a short description for this celebration.",
    }]);
    setDirty(true);
    requestAnimationFrame(() => document.getElementById("event-list-end")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };
  const scrollToSetting = (index: number) => document.getElementById(`setting-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return <><AdminHeader eyebrow="Configuration" title="Website settings" copy="Personalize the details, appearance, and atmosphere of your celebration."><div className="header-actions"><Button variant="outline" onClick={preview}>View website</Button><Button onClick={save} disabled={!dirty && !saved}>{saved ? "Changes saved" : dirty ? "Save changes" : "Up to date"}</Button></div></AdminHeader>
    {dirty && <div className="unsaved-banner"><span>You have unsaved website changes.</span><Button onClick={save}>Save now</Button></div>}
    <div className="settings-layout"><nav>{["Wedding information", "Hero section", "Appearance", "Countdown", "Contact", "Music", "Celebrations"].map((x, i) => <button type="button" key={x} onClick={() => scrollToSetting(i)}>{x}</button>)}</nav><div>
      <section id="setting-0" className="admin-card settings-card"><h3>Wedding information</h3><p>The essential details displayed throughout your website.</p><div className="form-grid"><label>Bride name<Field value={settings.bride} onChange={e => update("bride", e.target.value)} /></label><label>Groom name<Field value={settings.groom} onChange={e => update("groom", e.target.value)} /></label><label>Wedding date & time<Field type="datetime-local" value={settings.weddingDate} onChange={e => update("weddingDate", e.target.value)} /></label></div></section>
      <section id="setting-1" className="admin-card settings-card"><h3>Hero section</h3><p>Shape the first impression your guests receive.</p><label>Introductory heading<Field value={settings.heading} onChange={e => update("heading", e.target.value)} /></label><label>Description<TextArea rows={3} value={settings.description} onChange={e => update("description", e.target.value)} /></label><label>Hero image URL<Field value={settings.heroImage} onChange={e => update("heroImage", e.target.value)} placeholder="https://..." /></label><div className="mini-upload"><img src={settings.heroImage || hero} alt="" /><span><b>Live hero preview</b><small>Recommended portrait image, at least 1800 px tall</small></span></div></section>
      <section id="setting-2" className="admin-card settings-card"><h3>Appearance</h3><p>Fine-tune the visual mood of your website.</p><div className="form-grid"><label>Primary accent<div className="color-field"><input type="color" value={settings.primary} onChange={e => update("primary", e.target.value)} /><Field value={settings.primary} onChange={e => update("primary", e.target.value)} /></div></label><label>Secondary color<div className="color-field"><input type="color" value={settings.secondary} onChange={e => update("secondary", e.target.value)} /><Field value={settings.secondary} onChange={e => update("secondary", e.target.value)} /></div></label><label>Background color<div className="color-field"><input type="color" value={settings.background} onChange={e => update("background", e.target.value)} /><Field value={settings.background} onChange={e => update("background", e.target.value)} /></div></label><label>Heading font<select value={settings.font} onChange={e => update("font", e.target.value)}><option>Italiana</option><option>Playfair Display</option><option>Classic Serif</option></select></label><label>Button style<select value={settings.buttonStyle} onChange={e => update("buttonStyle", e.target.value)}><option value="rounded">Elegant rounded</option><option value="square">Classic square</option></select></label></div></section>
      <section id="setting-3" className="admin-card settings-card toggle-row"><div><h3>Wedding countdown</h3><p>Show a live countdown in the hero.</p></div><label className="switch"><input type="checkbox" checked={settings.countdown} onChange={e => update("countdown", e.target.checked)} /><i /></label></section>
      <section id="setting-4" className="admin-card settings-card"><h3>Contact information</h3><p>Keep your guests connected to the right people.</p><div className="form-grid"><label>Bride contact<Field value={settings.brideContact} onChange={e => update("brideContact", e.target.value)} /></label><label>Groom contact<Field value={settings.groomContact} onChange={e => update("groomContact", e.target.value)} /></label><label>Family contact<Field value={settings.familyContact} onChange={e => update("familyContact", e.target.value)} /></label><label>Coordinator contact<Field value={settings.coordinatorContact} onChange={e => update("coordinatorContact", e.target.value)} /></label><label>Instagram URL<Field value={settings.instagram} onChange={e => update("instagram", e.target.value)} /></label></div></section>
      <section id="setting-5" className="admin-card settings-card"><div className="toggle-row"><div><h3>Background music</h3><p>Allow guests to play a gentle instrumental soundtrack.</p></div><label className="switch"><input type="checkbox" checked={settings.music} onChange={e => update("music", e.target.checked)} /><i /></label></div><label>Music file URL<Field value={settings.musicUrl} onChange={e => update("musicUrl", e.target.value)} placeholder="https://.../instrumental.mp3" /></label><div className="music-preview"><Button variant="outline" type="button" onClick={() => { const audio = new Audio(settings.musicUrl); audio.play().catch(() => undefined); }}><Icon name="music" /> Preview track</Button><small>MP3 or AAC recommended. Playback always begins after a guest interaction.</small></div></section>
      <section id="setting-6" className="admin-card settings-card"><div className="setting-section-head"><div><h3>A weekend to remember</h3><p>Edit every celebration shown in the public Events section.</p></div><Button type="button" onClick={addEvent}><Icon name="plus" /> Add event</Button></div><div className="event-settings-list">{eventDrafts.map((event, index) => <details key={event.id} open={index === 0 || index === eventDrafts.length - 1}><summary><span><small>Event {String(index + 1).padStart(2, "0")}</small>{event.name}</span><Icon name="chevron" /></summary><div className="event-settings-fields"><div className="form-grid"><label>Event name<Field value={event.name} onChange={e => updateEvent(event.id, "name", e.target.value)} /></label><label>Date<Field value={event.date} onChange={e => updateEvent(event.id, "date", e.target.value)} /></label><label>Time<Field value={event.time} onChange={e => updateEvent(event.id, "time", e.target.value)} /></label><label>Venue<Field value={event.venue} onChange={e => updateEvent(event.id, "venue", e.target.value)} /></label><label>Address<Field value={event.address} onChange={e => updateEvent(event.id, "address", e.target.value)} /></label><label>Dress code<Field value={event.dressCode} onChange={e => updateEvent(event.id, "dressCode", e.target.value)} /></label></div><label>Description<TextArea rows={3} value={event.description} onChange={e => updateEvent(event.id, "description", e.target.value)} /></label><div className="event-editor-actions"><Button type="button" variant="outline" className="danger-btn" onClick={() => setDeletingEvent(event)}><Icon name="trash" /> Delete event</Button></div></div></details>)}<div id="event-list-end" /></div></section>
    </div></div>
    {deletingEvent && <div className="modal"><div className="modal-card confirm-card"><Button variant="ghost" className="modal-close" onClick={() => setDeletingEvent(null)}><Icon name="close" /></Button><span>Remove celebration</span><h2>Delete {deletingEvent.name}?</h2><p>This event will be removed from “A weekend to remember” after you save the website settings.</p><div className="confirm-actions"><Button variant="outline" onClick={() => setDeletingEvent(null)}>Keep event</Button><Button className="danger-solid" onClick={deleteEvent}><Icon name="trash" /> Delete event</Button></div></div></div>}</>;
}

function SecurityAdmin({ logout }: { logout: () => void }) {
  const [updated, setUpdated] = useState(false);
  return <><AdminHeader eyebrow="Account" title="Admin security" copy="Manage access, credentials, and active sessions for this private workspace." />
    <div className="security-grid"><form className="admin-card settings-card" onSubmit={e => { e.preventDefault(); setUpdated(true); setTimeout(() => setUpdated(false), 2500); }}><h3>Change password</h3><p>Use at least 12 characters with a mix of letters, numbers, and symbols.</p><label>Current password<Field type="password" placeholder="Current password" required /></label><label>New password<Field type="password" placeholder="New secure password" minLength={12} required /></label><label>Confirm new password<Field type="password" placeholder="Repeat new password" minLength={12} required /></label><Button type="submit">{updated ? "Password updated" : "Update password"}</Button></form>
      <section className="admin-card settings-card"><h3>Session information</h3><p>Your current session and recent security activity.</p><div className="session"><i><Icon name="lock" /></i><div><b>Current session</b><span>Chrome · Figma Make Preview</span><small>Active now · Secure connection</small></div></div><div className="security-note"><b>Last password update</b><span>12 April 2026</span></div><div className="security-note"><b>Two-step verification</b><span className="good">Enabled</span></div><Button variant="outline" onClick={logout}><Icon name="logout" /> Log out of all sessions</Button></section></div></>;
}

function AdminApp(props: {
  photos: Photo[]; setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>; wishes: Wish[]; setWishes: React.Dispatch<React.SetStateAction<Wish[]>>;
  announcements: Announcement[]; setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>; settings: Settings; setSettings: React.Dispatch<React.SetStateAction<Settings>>; events: WeddingEvent[]; setEvents: React.Dispatch<React.SetStateAction<WeddingEvent[]>>; onExit: () => void;
}) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("av-admin") === "true");
  const [page, setPage] = useState("Dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const login = () => { sessionStorage.setItem("av-admin", "true"); setAuthed(true); };
  const logout = () => { sessionStorage.removeItem("av-admin"); setAuthed(false); };
  if (!authed) return <AdminLogin onLogin={login} onBack={props.onExit} />;
  return <main className="admin-shell">
    <aside className={mobileNav ? "admin-sidebar open" : "admin-sidebar"}><div className="admin-brand"><span>A <i>·</i> V</span><small>Wedding admin</small></div><nav>{adminItems.map(([name, abbr]) => <button className={page === name ? "active" : ""} key={name} onClick={() => { setPage(name); setMobileNav(false); }}><i>{abbr}</i>{name}</button>)}</nav><div className="sidebar-profile"><span>AM</span><div><b>Aanya Mehta</b><small>Administrator</small></div><button onClick={logout}><Icon name="logout" /></button></div></aside>
    <div className="admin-main"><div className="admin-mobile-bar"><button onClick={() => setMobileNav(!mobileNav)}><Icon name="menu" /></button><b>A · V Admin</b><button onClick={props.onExit}><Icon name="close" /></button></div><div className="admin-content">
      {page === "Dashboard" && <AdminDashboard photos={props.photos} wishes={props.wishes} announcements={props.announcements} onNavigate={setPage} />}
      {page === "Gallery Management" && <GalleryAdmin photos={props.photos} setPhotos={props.setPhotos} />}
      {page === "Wishes Management" && <WishesAdmin wishes={props.wishes} setWishes={props.setWishes} />}
      {page === "Announcements" && <AnnouncementsAdmin items={props.announcements} setItems={props.setAnnouncements} />}
      {page === "Website Settings" && <SettingsAdmin settings={props.settings} setSettings={props.setSettings} events={props.events} setEvents={props.setEvents} onPreview={props.onExit} />}
      {page === "Admin Security" && <SecurityAdmin logout={logout} />}
    </div></div>
  </main>;
}

export default function App() {
  const [photos, setPhotos] = useStored<Photo[]>("av-photos", initialPhotos);
  const [wishes, setWishes] = useStored<Wish[]>("av-wishes", initialWishes);
  const [announcements, setAnnouncements] = useStored<Announcement[]>("av-announcements", initialAnnouncements);
  const [settings, setSettings] = useStored<Settings>("av-settings", initialSettings);
  const [events, setEvents] = useStored<WeddingEvent[]>("av-events", initialEvents);
  const [admin, setAdmin] = useState(() => location.hash.startsWith("#admin"));
  useEffect(() => { const change = () => setAdmin(location.hash.startsWith("#admin")); addEventListener("hashchange", change); return () => removeEventListener("hashchange", change); }, []);
  const goAdmin = () => { location.hash = "admin"; setAdmin(true); };
  const exitAdmin = () => { history.replaceState(null, "", location.pathname); setAdmin(false); };
  return admin ? <AdminApp photos={photos} setPhotos={setPhotos} wishes={wishes} setWishes={setWishes} announcements={announcements} setAnnouncements={setAnnouncements} settings={settings} setSettings={setSettings} events={events} setEvents={setEvents} onExit={exitAdmin} /> : <GuestSite photos={photos} setPhotos={setPhotos} wishes={wishes} setWishes={setWishes} announcements={announcements} settings={settings} events={events} goAdmin={goAdmin} />;
}
