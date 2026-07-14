const navItems = [
  ['#collection', 'Product'],
  ['#video', 'Video'],
  ['#material', 'Zan Wood'],
  ['#gift', 'Gift'],
  ['#faq', 'FAQ'],
];

export default function Header() {
  return (
    <header className="nav" id="nav">
      <a className="brand" href="#top">
        <img className="brand-logo" src="/assets/juzur-logo-header.png" alt="Juzur" />
      </a>
      <nav aria-label="Primary navigation">
        {navItems.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <a className="nav-cta" href="#checkout">
        Order Now
      </a>
    </header>
  );
}
