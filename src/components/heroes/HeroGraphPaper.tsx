export function HeroGraphPaper() {
  return (
    <div className="hero-page hero-a">
      <div className="blob b1" />
      <div className="blob b2" />
      <p className="hero-label">
        Grip&nbsp;&nbsp;·&nbsp;&nbsp;Revenue Pipeline Automation
      </p>
      <h1>
        <span className="w" style={{ "--i": 0 } as React.CSSProperties}>
          Your
        </span>{" "}
        <span className="w" style={{ "--i": 1 } as React.CSSProperties}>
          pipeline
        </span>
        <br />
        <span className="w punch" style={{ "--i": 2 } as React.CSSProperties}>
          is
        </span>{" "}
        <span className="w punch" style={{ "--i": 3 } as React.CSSProperties}>
          leaking<span className="hero-dot">.</span>
        </span>
      </h1>
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
