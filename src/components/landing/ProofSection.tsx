const QUOTES = [
  {
    company: "Turabit",
    text: "We stopped arguing about lead counts on Monday.",
    author: "Ananya Krishnan, VP Sales",
    delay: "0ms",
  },
  {
    company: "Klaro Foods",
    text: "Our Shopify orders create themselves now. Finance reconciles nothing.",
    author: "Rahul Deshpande, Head of Ops",
    delay: "60ms",
  },
  {
    company: "Vistara D2C",
    text: "The first tool my agents didn't need training for.",
    author: "Meera Shah, Founder",
    delay: "120ms",
  },
];

export function ProofSection() {
  return (
    <section className="sec proof" data-screen-label="05 Proof">
      <div className="sec-inner">
        <div className="metrics" data-rv>
          <div className="metric">
            <p className="metric-value" data-count="47000" data-suffix="+">
              0
            </p>
            <p className="metric-label">
              orders
              <br />
              auto-created
            </p>
          </div>
          <div className="metric">
            <p
              className="metric-value"
              data-steps="847,620,341,120,47,12,3,0"
              data-prefix="₹"
            >
              ₹847
            </p>
            <p className="metric-label">
              dropped orders
              <br />
              after 30 days
            </p>
          </div>
          <div className="metric">
            <p className="metric-value" data-count="94" data-suffix="%">
              0%
            </p>
            <p className="metric-label">
              data accuracy
              <br />
              vs spreadsheet
            </p>
          </div>
          <div className="metric">
            <p className="metric-value" data-count="15" data-suffix=" min">
              0 min
            </p>
            <p className="metric-label">
              avg setup
              <br />
              time
            </p>
          </div>
        </div>

        <div className="quotes">
          {QUOTES.map((q) => (
            <figure
              key={q.company}
              className="quote"
              data-rv
              style={{ "--d": q.delay } as React.CSSProperties}
            >
              <figcaption className="quote-co">{q.company}</figcaption>
              <blockquote className="quote-text">&ldquo;{q.text}&rdquo;</blockquote>
              <p className="quote-by">{q.author}</p>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
