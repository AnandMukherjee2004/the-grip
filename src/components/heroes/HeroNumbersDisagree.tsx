const CARDS = [
  { src: "META ADS", num: "847", what: "leads this week" },
  { src: "LEADSQUARED", num: "421", what: "leads in CRM" },
  { src: "RAZORPAY", num: "63", what: "payments received" },
  { src: "REVENUE · THIS WEEK", num: "?", what: "nobody knows", broken: true },
];

export function HeroNumbersDisagree() {
  return (
    <div className="hero-page hero-c">
      <div className="copy">
        <p className="hero-label">
          Revline&nbsp;&nbsp;·&nbsp;&nbsp;Revenue Pipeline Automation
        </p>
        <h1>
          Whose number
          <br />
          do you trust<span className="hero-dot">?</span>
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
      <div>
        <div className="cards">
          {CARDS.map((card) => (
            <div
              key={card.src}
              className={`card${card.broken ? " broken" : ""}`}
            >
              <span className="src">{card.src}</span>
              <span className="num">{card.num}</span>
              <span className="what">{card.what}</span>
            </div>
          ))}
        </div>
        <p className="cards-cap">
          Four tools. Four answers. <strong>Zero agreement.</strong>
        </p>
      </div>
    </div>
  );
}
