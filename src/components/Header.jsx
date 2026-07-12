const navItems = [
  ['#video', 'Video'],
  ['#reviews', 'Reviews'],
  ['#gift', 'Gift'],
  ['#material', 'Zan Wood'],
  ['#collection', 'Features'],
  ['#gallery', 'Gallery'],
  ['#faq', 'FAQ'],
  ['#checkout', 'Checkout'],
];

export default function Header() {
  return (
    <header className="nav" id="nav">
      <a className="brand" href="#top">
        <img className="brand-logo" src="/assets/juzur-logo-header.png" alt="Juzur" />
      </a>
      <nav>
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
