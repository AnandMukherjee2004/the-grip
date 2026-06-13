export function HeroCtas() {
  return (
    <div className="hero-ctas">
      <a
        href="/onboarding"
        className="hero-cta-primary"
        aria-current="page"
      >
        <span className="hero-cta-primary-text">
          Get Started
          <span className="hero-cta-arrow" aria-hidden="true">
            →
          </span>
        </span>
        <span className="hero-cta-streak" aria-hidden="true" />
      </a>

      <a href="/demo" className="hero-cta-secondary">
        Book a Demo
      </a>
    </div>
  );
}
