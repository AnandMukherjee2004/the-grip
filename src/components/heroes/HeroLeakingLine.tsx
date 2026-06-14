export function HeroLeakingLine() {
  return (
    <div className="hero-page hero-b">
      <p className="hero-label">
        Grip&nbsp;&nbsp;·&nbsp;&nbsp;Revenue Pipeline Automation
      </p>
      <h1>
        Your pipeline
        <br />
        is leaking<span className="hero-dot">.</span>
      </h1>
      <div className="pipe" aria-hidden>
        <span className="pipe-line pipe-l" />
        <span className="pipe-line pipe-r" />
        <span className="drip" />
        <span className="drip" />
        <span className="drip" />
        <span className="pipe-cap">REVENUE LOST IN THE GAP</span>
      </div>
      <p className="sub">
        Every sale your team closes touches five different tools. None of them
        talk to each other. You&apos;re losing revenue to the gaps.
      </p>
      <div className="ctas">
        <button type="button" className="hero-btn hero-btn-light">
          See the pipeline
        </button>
        <button type="button" className="hero-btn hero-btn-ghost">
          Start free trial
        </button>
      </div>
    </div>
  );
}
